import {
  ClubRole,
  InvitationStatus,
  MembershipStatus,
  Prisma,
} from '@prisma/client';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, createHash } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthenticatedRequest } from '../common/types/authenticated-request';
import {
  AddSquadMemberDto,
  CreateClubDto,
  CreateInvitationDto,
  CreateSquadDto,
  UpdateClubDto,
  UpdateSquadDto,
} from './club.dto';

type AuthUser = NonNullable<AuthenticatedRequest['user']>;

@Injectable()
export class ClubService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureUser(authUser: AuthUser) {
    const name = [authUser.firstName, authUser.lastName]
      .filter(Boolean)
      .join(' ')
      .trim();

    return this.prisma.user.upsert({
      where: { authId: authUser.id },
      update: {
        email: authUser.email,
        name: name || authUser.email,
      },
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

  async createClub(authUser: AuthUser, dto: CreateClubDto) {
    const user = await this.ensureUser(authUser);

    return this.prisma.club.create({
      data: {
        name: dto.name.trim(),
        ownerId: user.id,
        memberships: {
          create: {
            userId: user.id,
            role: ClubRole.OWNER,
          },
        },
      },
      include: { memberships: true },
    });
  }

  async listClubs(authUser: AuthUser) {
    const user = await this.ensureUser(authUser);

    return this.prisma.clubMembership.findMany({
      where: { userId: user.id, status: MembershipStatus.ACTIVE },
      include: {
        club: {
          include: {
            _count: { select: { memberships: true, squads: true } },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getClub(authUser: AuthUser, clubId: string) {
    await this.requireMembership(authUser, clubId);

    return this.prisma.club.findUniqueOrThrow({
      where: { id: clubId },
      include: {
        memberships: {
          where: { status: MembershipStatus.ACTIVE },
          include: { user: { select: { id: true, email: true, name: true } } },
          orderBy: { createdAt: 'asc' },
        },
        squads: {
          where: { isActive: true },
          include: { _count: { select: { memberships: true } } },
          orderBy: { name: 'asc' },
        },
      },
    });
  }

  async updateClub(authUser: AuthUser, clubId: string, dto: UpdateClubDto) {
    await this.requireMembership(authUser, clubId, [
      ClubRole.OWNER,
      ClubRole.COACH,
    ]);

    return this.prisma.club.update({
      where: { id: clubId },
      data: { name: dto.name?.trim() },
    });
  }

  async createInvitation(
    authUser: AuthUser,
    clubId: string,
    dto: CreateInvitationDto,
  ) {
    const { user } = await this.requireMembership(authUser, clubId, [
      ClubRole.OWNER,
      ClubRole.COACH,
    ]);
    const email = dto.email.trim().toLowerCase();
    const existingMember = await this.prisma.clubMembership.findFirst({
      where: {
        clubId,
        status: MembershipStatus.ACTIVE,
        user: { email },
      },
    });

    if (existingMember) {
      throw new ConflictException('That email is already a club member');
    }

    await this.prisma.invitation.updateMany({
      where: { clubId, email, status: InvitationStatus.PENDING },
      data: { status: InvitationStatus.REVOKED },
    });

    const token = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(token);
    const invitation = await this.prisma.invitation.create({
      data: {
        clubId,
        email,
        role: dto.role,
        tokenHash,
        invitedById: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      select: {
        id: true,
        email: true,
        role: true,
        expiresAt: true,
        status: true,
      },
    });

    return {
      ...invitation,
      inviteToken: token,
      deliveryRequired: true,
    };
  }

  async listInvitations(authUser: AuthUser, clubId: string) {
    await this.requireMembership(authUser, clubId, [
      ClubRole.OWNER,
      ClubRole.COACH,
    ]);

    return this.prisma.invitation.findMany({
      where: { clubId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        expiresAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async acceptInvitation(authUser: AuthUser, token: string) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { tokenHash: this.hashToken(token) },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (
      invitation.status !== InvitationStatus.PENDING ||
      invitation.expiresAt <= new Date()
    ) {
      if (invitation.status === InvitationStatus.PENDING) {
        await this.prisma.invitation.update({
          where: { id: invitation.id },
          data: { status: InvitationStatus.EXPIRED },
        });
      }
      throw new ConflictException('This invitation has expired or was used');
    }

    const user = await this.ensureUser(authUser);
    if (user.email.toLowerCase() !== invitation.email.toLowerCase()) {
      throw new ForbiddenException(
        'Sign in with the email address that received this invitation',
      );
    }

    await this.prisma.$transaction([
      this.prisma.clubMembership.upsert({
        where: {
          clubId_userId: { clubId: invitation.clubId, userId: user.id },
        },
        update: { role: invitation.role, status: MembershipStatus.ACTIVE },
        create: {
          clubId: invitation.clubId,
          userId: user.id,
          role: invitation.role,
        },
      }),
      this.prisma.invitation.update({
        where: { id: invitation.id },
        data: {
          status: InvitationStatus.ACCEPTED,
          acceptedById: user.id,
        },
      }),
    ]);

    return { clubId: invitation.clubId, role: invitation.role };
  }

  async createSquad(
    authUser: AuthUser,
    clubId: string,
    dto: CreateSquadDto,
  ) {
    await this.requireMembership(authUser, clubId, [
      ClubRole.OWNER,
      ClubRole.COACH,
    ]);

    try {
      return await this.prisma.squad.create({
        data: {
          clubId,
          name: dto.name.trim(),
          description: dto.description?.trim() || undefined,
        },
        include: { _count: { select: { memberships: true } } },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('A squad with that name already exists');
      }
      throw error;
    }
  }

  async listSquads(authUser: AuthUser, clubId: string) {
    await this.requireMembership(authUser, clubId);

    return this.prisma.squad.findMany({
      where: { clubId },
      include: {
        memberships: {
          include: {
            user: { select: { id: true, email: true, name: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async updateSquad(
    authUser: AuthUser,
    squadId: string,
    dto: UpdateSquadDto,
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

    return this.prisma.squad.update({
      where: { id: squadId },
      data: {
        name: dto.name?.trim(),
        description: dto.description?.trim(),
        isActive: dto.isActive,
      },
    });
  }

  async addSquadMember(
    authUser: AuthUser,
    squadId: string,
    dto: AddSquadMemberDto,
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
    const athleteMembership = await this.prisma.clubMembership.findUnique({
      where: {
        clubId_userId: { clubId: squad.clubId, userId: dto.userId },
      },
    });

    if (
      !athleteMembership ||
      athleteMembership.status !== MembershipStatus.ACTIVE ||
      athleteMembership.role !== ClubRole.ATHLETE
    ) {
      throw new ForbiddenException('Only active club athletes can join squads');
    }

    return this.prisma.squadMembership.upsert({
      where: { squadId_userId: { squadId, userId: dto.userId } },
      update: {},
      create: { squadId, userId: dto.userId },
      include: {
        user: { select: { id: true, email: true, name: true } },
      },
    });
  }

  async removeSquadMember(
    authUser: AuthUser,
    squadId: string,
    userId: string,
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

    await this.prisma.squadMembership.deleteMany({
      where: { squadId, userId },
    });
    return { removed: true };
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }
}
