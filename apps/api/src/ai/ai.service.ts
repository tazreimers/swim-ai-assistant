import {
  AiReportStatus,
  AiReportType,
  ClubRole,
  MembershipStatus,
  Prisma,
} from '@prisma/client';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { createHash } from 'node:crypto';
import type { AuthenticatedRequest } from '../common/types/authenticated-request';
import { PrismaService } from '../prisma/prisma.service';

type AuthUser = NonNullable<AuthenticatedRequest['user']>;
type AnalysisSession = {
  id: string;
  title: string | null;
  sessionType: string | null;
  scheduledDate: Date;
  mainSets: Array<{
    id: string;
    position: number;
    stroke: string | null;
    distanceMeters: number | null;
    repetitions: number;
  }>;
  results: Array<{
    user: { id: string };
    status: string;
    repResults: Array<{ mainSetId: string; repNumber: number; timeMs: number }>;
  }>;
};

const PROMPT_VERSION = 'swim-insights-v1';

@Injectable()
export class AiService {
  constructor(private readonly prisma: PrismaService) {}

  async generateReport(authUser: AuthUser, sessionId: string) {
    const { session, user, isCoach } = await this.authorizeSession(authUser, sessionId);
    const athleteId = isCoach ? undefined : user.id;
    const reportType = athleteId ? AiReportType.ATHLETE : AiReportType.SESSION;
    const input = this.buildInput(session, athleteId);
    const inputSummaryHash = createHash('sha256')
      .update(JSON.stringify(input))
      .digest('hex');

    const existing = await this.prisma.aiReport.findFirst({
      where: { sessionId, athleteId, reportType, inputSummaryHash },
      orderBy: { createdAt: 'desc' },
    });
    if (existing?.status === AiReportStatus.COMPLETED) return existing;

    const report =
      existing ??
      (await this.prisma.aiReport.create({
        data: {
          sessionId,
          athleteId,
          reportType,
          promptVersion: PROMPT_VERSION,
          inputSummaryHash,
        },
      }));

    await this.prisma.aiReport.update({
      where: { id: report.id },
      data: { status: AiReportStatus.PROCESSING, startedAt: new Date(), errorCode: null },
    });

    try {
      const generated = await this.callAiService(input);
      return await this.prisma.aiReport.update({
        where: { id: report.id },
        data: {
          status: AiReportStatus.COMPLETED,
          model: generated.model,
          result: generated.result as Prisma.InputJsonValue,
          renderedSummary: this.renderSummary(generated.result),
          completedAt: new Date(),
        },
      });
    } catch (error) {
      await this.prisma.aiReport.update({
        where: { id: report.id },
        data: {
          status: AiReportStatus.FAILED,
          errorCode: error instanceof Error && error.name === 'TimeoutError'
            ? 'AI_TIMEOUT'
            : 'AI_PROVIDER_UNAVAILABLE',
          retryCount: { increment: 1 },
        },
      });
      throw new ServiceUnavailableException(
        'AI insights are temporarily unavailable. You can safely retry this report.',
      );
    }
  }

  async getSessionReport(authUser: AuthUser, sessionId: string) {
    const { user, isCoach } = await this.authorizeSession(authUser, sessionId);
    return this.prisma.aiReport.findFirst({
      where: {
        sessionId,
        reportType: isCoach ? AiReportType.SESSION : AiReportType.ATHLETE,
        athleteId: isCoach ? null : user.id,
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        sessionId: true,
        athleteId: true,
        reportType: true,
        status: true,
        model: true,
        result: true,
        renderedSummary: true,
        errorCode: true,
        retryCount: true,
        completedAt: true,
        createdAt: true,
      },
    });
  }

  async getMyInsights(authUser: AuthUser) {
    const user = await this.ensureUser(authUser);
    return this.prisma.aiReport.findMany({
      where: { athleteId: user.id, reportType: AiReportType.ATHLETE },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        sessionId: true,
        status: true,
        result: true,
        renderedSummary: true,
        errorCode: true,
        completedAt: true,
        createdAt: true,
        session: { select: { title: true, scheduledDate: true } },
      },
    });
  }

  async regenerate(authUser: AuthUser, reportId: string) {
    const report = await this.prisma.aiReport.findUnique({
      where: { id: reportId },
      select: { sessionId: true },
    });
    if (!report) throw new NotFoundException('AI report not found');
    await this.prisma.aiReport.update({
      where: { id: reportId },
      data: { status: AiReportStatus.STALE },
    });
    return this.generateReport(authUser, report.sessionId);
  }

  private async authorizeSession(authUser: AuthUser, sessionId: string) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        mainSets: { orderBy: { position: 'asc' } },
        results: {
          include: { user: { select: { id: true } }, repResults: true },
        },
      },
    });
    if (!session?.clubId) throw new NotFoundException('Session not found');
    const user = await this.ensureUser(authUser);
    const membership = await this.prisma.clubMembership.findUnique({
      where: { clubId_userId: { clubId: session.clubId, userId: user.id } },
    });
    const isCoach =
      membership?.status === MembershipStatus.ACTIVE &&
      (membership.role === ClubRole.OWNER || membership.role === ClubRole.COACH);
    const isAthlete =
      membership?.status === MembershipStatus.ACTIVE &&
      membership.role === ClubRole.ATHLETE;
    if (!isCoach && !isAthlete) {
      throw new ForbiddenException('You do not have access to this report');
    }
    return { session: session as AnalysisSession, user, isCoach };
  }

  private buildInput(session: AnalysisSession, athleteId?: string) {
    return {
      session: {
        id: session.id,
        title: session.title,
        session_type: session.sessionType,
        scheduled_date: session.scheduledDate.toISOString(),
        main_sets: session.mainSets.map((set) => ({
          id: set.id,
          position: set.position,
          stroke: set.stroke,
          distance_meters: set.distanceMeters,
          repetitions: set.repetitions,
        })),
      },
      athletes: session.results
        .filter((result) => !athleteId || result.user.id === athleteId)
        .map((result) => ({
          athlete_id: result.user.id,
          status: result.status,
          reps: result.repResults
            .slice()
            .sort((a, b) => a.mainSetId.localeCompare(b.mainSetId) || a.repNumber - b.repNumber)
            .map((rep) => ({
              main_set_id: rep.mainSetId,
              rep_number: rep.repNumber,
              time_ms: rep.timeMs,
            })),
        })),
    };
  }

  private async callAiService(input: ReturnType<AiService['buildInput']>) {
    const baseUrl = process.env.AI_SERVICE_URL ?? 'http://localhost:8000';
    const response = await fetch(`${baseUrl}/insights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.AI_SERVICE_TOKEN
          ? { Authorization: `Bearer ${process.env.AI_SERVICE_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({ prompt_version: PROMPT_VERSION, ...input }),
      signal: AbortSignal.timeout(25_000),
    });
    if (!response.ok) throw new Error(`AI service returned ${response.status}`);
    return (await response.json()) as {
      model: string;
      result: Record<string, unknown>;
    };
  }

  private renderSummary(result: Record<string, unknown>) {
    const summary = result.session_summary;
    return typeof summary === 'string' ? summary : 'AI report generated.';
  }

  private async ensureUser(authUser: AuthUser) {
    const name = [authUser.firstName, authUser.lastName].filter(Boolean).join(' ').trim();
    return this.prisma.user.upsert({
      where: { authId: authUser.id },
      update: { email: authUser.email, name: name || authUser.email },
      create: { authId: authUser.id, email: authUser.email, name: name || authUser.email },
    });
  }
}
