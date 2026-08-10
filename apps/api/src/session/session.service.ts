import {
  AthleteResultStatus,
  ClubRole,
  MembershipStatus,
  SessionWorkflowStatus,
} from '@prisma/client';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'node:crypto';
import type { AuthenticatedRequest } from '../common/types/authenticated-request';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import {
  CreateSessionDto,
  MainSetDto,
  PhotoCompleteDto,
  PhotoUploadDto,
  SaveResultDto,
  UpdateSessionDto,
} from './session.dto';

type AuthUser = NonNullable<AuthenticatedRequest['user']>;

@Injectable()
export class SessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
  ) {}

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

  private async requireClubMember(
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

  private async getSessionOrThrow(sessionId: string) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        mainSets: { orderBy: { position: 'asc' } },
        photo: true,
        squad: true,
      },
    });
    if (!session || !session.clubId || !session.squadId) {
      throw new NotFoundException('Training session not found');
    }
    return {
      ...session,
      clubId: session.clubId,
      squadId: session.squadId,
    };
  }

  async createSession(authUser: AuthUser, dto: CreateSessionDto) {
    const { user } = await this.requireClubMember(authUser, dto.clubId, [
      ClubRole.OWNER,
      ClubRole.COACH,
    ]);
    await this.requireSquad(dto.clubId, dto.squadId);
    this.validateMainSets(dto.mainSets);

    return this.prisma.session.create({
      data: {
        clubId: dto.clubId,
        squadId: dto.squadId,
        coachId: user.id,
        title: dto.title.trim(),
        sessionType: dto.sessionType.trim(),
        scheduledDate: new Date(dto.scheduledDate),
        notes: dto.notes?.trim(),
        mainSets: { create: dto.mainSets.map((set) => this.mainSetData(set)) },
      },
      include: { mainSets: { orderBy: { position: 'asc' } } },
    });
  }

  async listSquadSessions(authUser: AuthUser, squadId: string) {
    const squad = await this.prisma.squad.findUnique({
      where: { id: squadId },
      select: { clubId: true },
    });
    if (!squad) throw new NotFoundException('Squad not found');
    await this.requireClubMember(authUser, squad.clubId);

    return this.prisma.session.findMany({
      where: {
        squadId,
        workflowStatus: { not: SessionWorkflowStatus.ARCHIVED },
      },
      include: {
        mainSets: { orderBy: { position: 'asc' } },
        photo: true,
      },
      orderBy: { scheduledDate: 'desc' },
    });
  }

  async getSession(authUser: AuthUser, sessionId: string) {
    const session = await this.getSessionOrThrow(sessionId);
    const { user, membership } = await this.requireClubMember(
      authUser,
      session.clubId,
    );

    const result =
      membership.role === ClubRole.ATHLETE
        ? await this.prisma.athleteResult.findUnique({
            where: { sessionId_userId: { sessionId, userId: user.id } },
            include: { repResults: true },
          })
        : null;

    return { ...session, myResult: result };
  }

  async updateSession(
    authUser: AuthUser,
    sessionId: string,
    dto: UpdateSessionDto,
  ) {
    const session = await this.getSessionOrThrow(sessionId);
    await this.requireClubMember(authUser, session.clubId, [
      ClubRole.OWNER,
      ClubRole.COACH,
    ]);
    if (session.workflowStatus !== SessionWorkflowStatus.DRAFT) {
      throw new ConflictException('Only draft sessions can be edited');
    }
    if (dto.mainSets) this.validateMainSets(dto.mainSets);

    return this.prisma.$transaction(async (transaction) => {
      if (dto.mainSets) {
        await transaction.mainSet.deleteMany({ where: { sessionId } });
        await transaction.mainSet.createMany({
          data: dto.mainSets.map((set) => ({
            sessionId,
            ...this.mainSetData(set),
          })),
        });
      }

      return transaction.session.update({
        where: { id: sessionId },
        data: {
          title: dto.title?.trim(),
          scheduledDate: dto.scheduledDate
            ? new Date(dto.scheduledDate)
            : undefined,
          sessionType: dto.sessionType?.trim(),
          notes: dto.notes?.trim(),
        },
        include: { mainSets: { orderBy: { position: 'asc' } } },
      });
    });
  }

  async publishSession(authUser: AuthUser, sessionId: string) {
    const session = await this.getSessionOrThrow(sessionId);
    await this.requireClubMember(authUser, session.clubId, [
      ClubRole.OWNER,
      ClubRole.COACH,
    ]);
    if (session.workflowStatus !== SessionWorkflowStatus.DRAFT) {
      throw new ConflictException('Only draft sessions can be published');
    }
    if (session.mainSets.length === 0) {
      throw new BadRequestException('Add at least one main set before publishing');
    }

    return this.prisma.session.update({
      where: { id: sessionId },
      data: {
        workflowStatus: SessionWorkflowStatus.PUBLISHED,
        publishedAt: new Date(),
      },
      include: { mainSets: { orderBy: { position: 'asc' } } },
    });
  }

  async getTodaySessions(authUser: AuthUser) {
    const { user } = await this.ensureAthleteAccess(authUser);
    const now = new Date();
    const start = new Date(now);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);

    return this.prisma.session.findMany({
      where: {
        scheduledDate: { gte: start, lt: end },
        workflowStatus: {
          in: [SessionWorkflowStatus.PUBLISHED, SessionWorkflowStatus.COMPLETED],
        },
        squad: { memberships: { some: { userId: user.id } } },
      },
      include: {
        mainSets: { orderBy: { position: 'asc' } },
        photo: true,
        results: {
          where: { userId: user.id },
          include: { repResults: true },
        },
      },
      orderBy: { scheduledDate: 'asc' },
    });
  }

  async getMyResult(authUser: AuthUser, sessionId: string) {
    const { user } = await this.ensureAthleteAccess(authUser, sessionId);
    return this.getOrCreateResult(sessionId, user.id);
  }

  async saveMyResult(
    authUser: AuthUser,
    sessionId: string,
    dto: SaveResultDto,
  ) {
    const { user } = await this.ensureAthleteAccess(authUser, sessionId);
    const session = await this.getSessionOrThrow(sessionId);
    if (session.workflowStatus !== SessionWorkflowStatus.PUBLISHED) {
      throw new ConflictException('This session is not available for logging');
    }

    const mainSets = new Map(session.mainSets.map((set) => [set.id, set]));
    for (const rep of dto.reps) {
      const mainSet = mainSets.get(rep.mainSetId);
      if (!mainSet || rep.repNumber > mainSet.repetitions) {
        throw new BadRequestException('A rep result does not match this session');
      }
    }

    const result = await this.getOrCreateResult(sessionId, user.id);
    return this.prisma.$transaction(async (transaction) => {
      for (const rep of dto.reps) {
        await transaction.repResult.upsert({
          where: {
            athleteResultId_mainSetId_repNumber: {
              athleteResultId: result.id,
              mainSetId: rep.mainSetId,
              repNumber: rep.repNumber,
            },
          },
          update: { timeMs: rep.timeMs, notes: rep.notes?.trim() },
          create: {
            athleteResultId: result.id,
            mainSetId: rep.mainSetId,
            repNumber: rep.repNumber,
            timeMs: rep.timeMs,
            notes: rep.notes?.trim(),
          },
        });
      }
      return transaction.athleteResult.findUniqueOrThrow({
        where: { id: result.id },
        include: { repResults: { orderBy: [{ mainSetId: 'asc' }, { repNumber: 'asc' }] } },
      });
    });
  }

  async completeMyResult(authUser: AuthUser, sessionId: string) {
    const { user } = await this.ensureAthleteAccess(authUser, sessionId);
    const session = await this.getSessionOrThrow(sessionId);
    const result = await this.prisma.athleteResult.findUnique({
      where: { sessionId_userId: { sessionId, userId: user.id } },
      include: { repResults: true },
    });
    if (!result) throw new BadRequestException('Save at least one result first');

    const requiredReps = session.mainSets.reduce(
      (total, mainSet) => total + mainSet.repetitions,
      0,
    );
    if (result.repResults.length < requiredReps) {
      throw new BadRequestException('Enter every rep time before completing');
    }

    const completedResult = await this.prisma.athleteResult.update({
      where: { id: result.id },
      data: {
        status: AthleteResultStatus.COMPLETED,
        completedAt: new Date(),
      },
      include: { repResults: true },
    });

    try {
      await this.aiService.generateReport(authUser, sessionId);
      return { ...completedResult, aiReportStatus: 'COMPLETED' as const };
    } catch (error) {
      if (!(error instanceof ServiceUnavailableException)) throw error;
      return { ...completedResult, aiReportStatus: 'FAILED' as const };
    }
  }

  async createPhotoUpload(
    authUser: AuthUser,
    sessionId: string,
    dto: PhotoUploadDto,
  ) {
    const session = await this.getSessionOrThrow(sessionId);
    await this.requireClubMember(authUser, session.clubId, [
      ClubRole.OWNER,
      ClubRole.COACH,
    ]);
    const safeName = dto.fileName.replace(/[^a-zA-Z0-9._-]/g, '-');
    const storagePath = `${sessionId}/${randomBytes(12).toString('hex')}-${safeName}`;
    const storage = this.getStorageClient();
    const { data, error } = await storage.storage
      .from(this.bucketName())
      .createSignedUploadUrl(storagePath);
    if (error || !data) {
      throw new ServiceUnavailableException('Unable to prepare photo upload');
    }

    return {
      bucket: this.bucketName(),
      path: storagePath,
      token: data.token,
      contentType: dto.contentType,
      sizeBytes: dto.sizeBytes,
    };
  }

  async completePhoto(
    authUser: AuthUser,
    sessionId: string,
    dto: PhotoCompleteDto,
  ) {
    const session = await this.getSessionOrThrow(sessionId);
    await this.requireClubMember(authUser, session.clubId, [
      ClubRole.OWNER,
      ClubRole.COACH,
    ]);
    if (!dto.storagePath.startsWith(`${sessionId}/`)) {
      throw new ForbiddenException('Photo path is not scoped to this session');
    }

    return this.prisma.sessionPhoto.upsert({
      where: { sessionId },
      update: {
        storagePath: dto.storagePath,
        contentType: dto.contentType,
        sizeBytes: dto.sizeBytes,
      },
      create: {
        sessionId,
        storagePath: dto.storagePath,
        contentType: dto.contentType,
        sizeBytes: dto.sizeBytes,
      },
    });
  }

  async getPhotoUrl(authUser: AuthUser, sessionId: string) {
    const session = await this.getSessionOrThrow(sessionId);
    await this.requireClubMember(authUser, session.clubId);
    if (!session.photo) throw new NotFoundException('Session has no photo');

    const { data, error } = await this.getStorageClient().storage
      .from(this.bucketName())
      .createSignedUrl(session.photo.storagePath, 3600);
    if (error || !data) {
      throw new ServiceUnavailableException('Unable to prepare photo access');
    }
    return { url: data.signedUrl, expiresIn: 3600 };
  }

  private async ensureAthleteAccess(authUser: AuthUser, sessionId?: string) {
    const user = await this.ensureUser(authUser);
    if (!sessionId) return { user };
    const session = await this.getSessionOrThrow(sessionId);
    const membership = await this.prisma.clubMembership.findUnique({
      where: { clubId_userId: { clubId: session.clubId!, userId: user.id } },
    });
    const squadMembership = await this.prisma.squadMembership.findUnique({
      where: { squadId_userId: { squadId: session.squadId!, userId: user.id } },
    });
    if (
      !membership ||
      membership.role !== ClubRole.ATHLETE ||
      membership.status !== MembershipStatus.ACTIVE ||
      !squadMembership
    ) {
      throw new ForbiddenException('Only squad athletes can log this session');
    }
    return { user, session };
  }

  private async getOrCreateResult(sessionId: string, userId: string) {
    return this.prisma.athleteResult.upsert({
      where: { sessionId_userId: { sessionId, userId } },
      update: {},
      create: { sessionId, userId },
      include: { repResults: true },
    });
  }

  private async requireSquad(clubId: string, squadId: string) {
    const squad = await this.prisma.squad.findFirst({
      where: { id: squadId, clubId, isActive: true },
    });
    if (!squad) throw new NotFoundException('Active squad not found');
    return squad;
  }

  private validateMainSets(mainSets: MainSetDto[]) {
    if (mainSets.length === 0) {
      throw new BadRequestException('At least one main set is required');
    }
    const positions = new Set(mainSets.map((set) => set.position));
    if (positions.size !== mainSets.length) {
      throw new BadRequestException('Main set positions must be unique');
    }
  }

  private mainSetData(set: MainSetDto) {
    return {
      position: set.position,
      stroke: set.stroke?.trim(),
      distanceMeters: set.distanceMeters,
      repetitions: set.repetitions,
      sendOffSeconds: set.sendOffSeconds,
      notes: set.notes?.trim(),
    };
  }

  private getStorageClient() {
    const url = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceRoleKey) {
      throw new ServiceUnavailableException('Supabase Storage is not configured');
    }
    return createClient(url, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  private bucketName() {
    return process.env.SUPABASE_SESSION_PHOTOS_BUCKET ?? 'session-photos';
  }
}
