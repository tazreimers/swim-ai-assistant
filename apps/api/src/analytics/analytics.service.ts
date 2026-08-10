import {
  AthleteResultStatus,
  ClubRole,
  MembershipStatus,
} from '@prisma/client';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { AuthenticatedRequest } from '../common/types/authenticated-request';
import { PrismaService } from '../prisma/prisma.service';
import { ProgressQueryDto } from './analytics.dto';

type AuthUser = NonNullable<AuthenticatedRequest['user']>;
type ResultWithSession = {
  id: string;
  userId: string;
  repResults: Array<{ mainSetId: string; repNumber: number; timeMs: number }>;
  session: {
    id: string;
    title: string | null;
    scheduledDate: Date;
    squadId: string | null;
    mainSets: Array<{ id: string; repetitions: number }>;
  };
};

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAthleteProgress(authUser: AuthUser, query: ProgressQueryDto) {
    const user = await this.ensureUser(authUser);
    const results = await this.getCompletedResults(user.id, query);
    return this.buildProgress(results);
  }

  async getAthleteSessions(authUser: AuthUser, query: ProgressQueryDto) {
    const user = await this.ensureUser(authUser);
    const results = await this.getCompletedResults(user.id, query);
    return this.buildProgress(results).sessionHistory;
  }

  async getSessionResults(authUser: AuthUser, sessionId: string) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      select: { id: true, clubId: true, title: true, scheduledDate: true },
    });
    if (!session?.clubId) throw new NotFoundException('Session not found');
    await this.requireMembership(authUser, session.clubId, [
      ClubRole.OWNER,
      ClubRole.COACH,
    ]);

    return this.prisma.athleteResult.findMany({
      where: { sessionId, status: AthleteResultStatus.COMPLETED },
      include: {
        user: { select: { id: true, name: true, email: true } },
        repResults: { orderBy: [{ mainSetId: 'asc' }, { repNumber: 'asc' }] },
      },
      orderBy: { completedAt: 'asc' },
    });
  }

  async getSessionSummary(authUser: AuthUser, sessionId: string) {
    const results = await this.getSessionResults(authUser, sessionId);
    const averages = results.map((result) => ({
      athleteId: result.user.id,
      athleteName: result.user.name,
      averageTimeMs: this.average(result.repResults.map((rep) => rep.timeMs)),
      bestTimeMs: this.minimum(result.repResults.map((rep) => rep.timeMs)),
    }));

    return {
      sessionId,
      attendance: results.length,
      averageTimeMs: this.average(averages.map((item) => item.averageTimeMs)),
      bestPerformers: averages.sort((a, b) => a.averageTimeMs - b.averageTimeMs).slice(0, 5),
      mostImproved: null,
      largestPaceDropOff: this.findLargestDropOff(results),
    };
  }

  async getCoachDashboard(
    authUser: AuthUser,
    clubId: string,
    query: ProgressQueryDto,
  ) {
    await this.requireMembership(authUser, clubId, [
      ClubRole.OWNER,
      ClubRole.COACH,
    ]);
    const results = await this.prisma.athleteResult.findMany({
      where: {
        status: AthleteResultStatus.COMPLETED,
        session: {
          clubId,
          scheduledDate: this.dateFilter(query),
        },
      },
      include: {
        user: { select: { id: true, name: true } },
        repResults: true,
        session: {
          select: {
            id: true,
            scheduledDate: true,
            mainSets: true,
            aiReports: {
              where: { status: 'COMPLETED', reportType: 'SESSION' },
              orderBy: { createdAt: 'desc' },
              take: 1,
              select: { renderedSummary: true, result: true },
            },
          },
        },
      },
      orderBy: { session: { scheduledDate: 'asc' } },
    });

    const byAthlete = new Map<
      string,
      { name: string; sessions: Array<{ date: Date; averageTimeMs: number }> }
    >();
    for (const result of results) {
      const current = byAthlete.get(result.user.id) ?? {
        name: result.user.name,
        sessions: [],
      };
      current.sessions.push({
        date: result.session.scheduledDate,
        averageTimeMs: this.average(result.repResults.map((rep) => rep.timeMs)),
      });
      byAthlete.set(result.user.id, current);
    }

    const improvements = [...byAthlete.entries()]
      .map(([athleteId, athlete]) => {
        const first = athlete.sessions[0]?.averageTimeMs;
        const latest = athlete.sessions.at(-1)?.averageTimeMs;
        return {
          athleteId,
          athleteName: athlete.name,
          improvementMs: first !== undefined && latest !== undefined ? first - latest : 0,
        };
      })
      .sort((a, b) => b.improvementMs - a.improvementMs);

    return {
      completedResults: results.length,
      athletesWithResults: byAthlete.size,
      averageSessionPerformanceMs: this.average(
        results.map((result) => this.average(result.repResults.map((rep) => rep.timeMs))),
      ),
      mostImproved: improvements[0] ?? null,
      largestImprovementMs: improvements[0]?.improvementMs ?? 0,
      largestPaceDropOff: this.findLargestDropOff(results),
      recentSessions: [...new Set(results.map((result) => result.session.id))].length,
      latestCompletedSessionId: results.at(-1)?.session.id ?? null,
      latestAiSummary: results
        .map((result) => result.session.aiReports[0]?.renderedSummary)
        .find((summary): summary is string => Boolean(summary)) ?? null,
    };
  }

  async getSquadProgress(
    authUser: AuthUser,
    squadId: string,
    query: ProgressQueryDto,
  ) {
    const squad = await this.prisma.squad.findUnique({
      where: { id: squadId },
      select: { clubId: true },
    });
    if (!squad) throw new NotFoundException('Squad not found');
    await this.requireMembership(authUser, squad.clubId, [
      ClubRole.OWNER,
      ClubRole.COACH,
    ]);

    const results = await this.prisma.athleteResult.findMany({
      where: {
        status: AthleteResultStatus.COMPLETED,
        session: {
          squadId,
          scheduledDate: this.dateFilter(query),
        },
      },
      include: {
        user: { select: { id: true, name: true } },
        repResults: true,
        session: { select: { id: true, title: true, scheduledDate: true } },
      },
      orderBy: { session: { scheduledDate: 'desc' } },
    });

    return results.map((result) => ({
      athleteId: result.user.id,
      athleteName: result.user.name,
      sessionId: result.session.id,
      sessionTitle: result.session.title,
      scheduledDate: result.session.scheduledDate,
      averageTimeMs: this.average(result.repResults.map((rep) => rep.timeMs)),
      bestTimeMs: this.minimum(result.repResults.map((rep) => rep.timeMs)),
      completedReps: result.repResults.length,
    }));
  }

  private async getCompletedResults(userId: string, query: ProgressQueryDto) {
    return this.prisma.athleteResult.findMany({
      where: {
        userId,
        status: AthleteResultStatus.COMPLETED,
        session: { scheduledDate: this.dateFilter(query) },
      },
      include: {
        repResults: true,
        session: {
          include: {
            mainSets: { select: { id: true, repetitions: true } },
          },
        },
      },
      orderBy: { session: { scheduledDate: 'asc' } },
    }) as Promise<ResultWithSession[]>;
  }

  private buildProgress(results: ResultWithSession[]) {
    const allTimes = results.flatMap((result) =>
      result.repResults.map((rep) => rep.timeMs),
    );
    const differences = results.flatMap((result) => {
      const bySet = new Map<string, number[]>();
      result.repResults.forEach((rep) => {
        const values = bySet.get(rep.mainSetId) ?? [];
        values.push(rep.timeMs);
        bySet.set(rep.mainSetId, values);
      });
      return [...bySet.values()].flatMap((times) =>
        times.slice(1).map((time, index) => time - times[index]),
      );
    });

    return {
      metrics: {
        averageTimeMs: this.average(allTimes),
        bestTimeMs: this.minimum(allTimes),
        worstTimeMs: this.maximum(allTimes),
        averageRepDifferenceMs: this.average(differences),
        completedSessions: results.length,
      },
      progressPoints: results.map((result) => ({
        sessionId: result.session.id,
        date: result.session.scheduledDate,
        averageTimeMs: this.average(result.repResults.map((rep) => rep.timeMs)),
      })),
      sessionHistory: results
        .slice()
        .reverse()
        .map((result) => ({
          sessionId: result.session.id,
          title: result.session.title ?? 'Training session',
          date: result.session.scheduledDate,
          averageTimeMs: this.average(result.repResults.map((rep) => rep.timeMs)),
          bestTimeMs: this.minimum(result.repResults.map((rep) => rep.timeMs)),
          completedReps: result.repResults.length,
          totalReps: result.session.mainSets.reduce(
            (total, mainSet) => total + mainSet.repetitions,
            0,
          ),
        })),
    };
  }

  private findLargestDropOff(
    results: Array<{ user: { id: string; name: string }; repResults: Array<{ timeMs: number }> }>,
  ) {
    return results
      .map((result) => {
        const times = result.repResults.map((rep) => rep.timeMs);
        return {
          athleteId: result.user.id,
          athleteName: result.user.name,
          dropOffMs: times.length > 1 ? times.at(-1)! - times[0] : 0,
        };
      })
      .sort((a, b) => b.dropOffMs - a.dropOffMs)[0] ?? null;
  }

  private async ensureUser(authUser: AuthUser) {
    const name = [authUser.firstName, authUser.lastName]
      .filter(Boolean)
      .join(' ')
      .trim();
    return this.prisma.user.upsert({
      where: { authId: authUser.id },
      update: { email: authUser.email, name: name || authUser.email },
      create: {
        authId: authUser.id,
        email: authUser.email,
        name: name || authUser.email,
      },
    });
  }

  private async requireMembership(
    authUser: AuthUser,
    clubId: string,
    roles?: ClubRole[],
  ) {
    const user = await this.ensureUser(authUser);
    const membership = await this.prisma.clubMembership.findUnique({
      where: { clubId_userId: { clubId, userId: user.id } },
    });
    if (
      !membership ||
      membership.status !== MembershipStatus.ACTIVE ||
      (roles && !roles.includes(membership.role))
    ) {
      throw new ForbiddenException('You do not have access to this club');
    }
    return { user, membership };
  }

  private dateFilter(query: ProgressQueryDto) {
    if (!query.from && !query.to) return undefined;
    return {
      gte: query.from ? new Date(query.from) : undefined,
      lte: query.to ? new Date(query.to) : undefined,
    };
  }

  private average(values: number[]) {
    return values.length
      ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
      : 0;
  }

  private minimum(values: number[]) {
    return values.length ? Math.min(...values) : 0;
  }

  private maximum(values: number[]) {
    return values.length ? Math.max(...values) : 0;
  }
}
