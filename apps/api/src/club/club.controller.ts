import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SupabaseAuthGuard } from '../common/guards/auth.guard';
import type { AuthenticatedRequest } from '../common/types/authenticated-request';
import {
  AddSquadMemberDto,
  CreateClubDto,
  CreateInvitationDto,
  CreateSquadDto,
  UpdateClubDto,
  UpdateSquadDto,
} from './club.dto';
import { ClubService } from './club.service';

@Controller()
@UseGuards(SupabaseAuthGuard)
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @Post('clubs')
  createClub(@Req() req: AuthenticatedRequest, @Body() dto: CreateClubDto) {
    return this.clubService.createClub(req.user!, dto);
  }

  @Get('clubs')
  listClubs(@Req() req: AuthenticatedRequest) {
    return this.clubService.listClubs(req.user!);
  }

  @Get('clubs/:clubId')
  getClub(
    @Req() req: AuthenticatedRequest,
    @Param('clubId', ParseUUIDPipe) clubId: string,
  ) {
    return this.clubService.getClub(req.user!, clubId);
  }

  @Patch('clubs/:clubId')
  updateClub(
    @Req() req: AuthenticatedRequest,
    @Param('clubId', ParseUUIDPipe) clubId: string,
    @Body() dto: UpdateClubDto,
  ) {
    return this.clubService.updateClub(req.user!, clubId, dto);
  }

  @Post('clubs/:clubId/invitations')
  createInvitation(
    @Req() req: AuthenticatedRequest,
    @Param('clubId', ParseUUIDPipe) clubId: string,
    @Body() dto: CreateInvitationDto,
  ) {
    return this.clubService.createInvitation(req.user!, clubId, dto);
  }

  @Get('clubs/:clubId/invitations')
  listInvitations(
    @Req() req: AuthenticatedRequest,
    @Param('clubId', ParseUUIDPipe) clubId: string,
  ) {
    return this.clubService.listInvitations(req.user!, clubId);
  }

  @Post('clubs/:clubId/squads')
  createSquad(
    @Req() req: AuthenticatedRequest,
    @Param('clubId', ParseUUIDPipe) clubId: string,
    @Body() dto: CreateSquadDto,
  ) {
    return this.clubService.createSquad(req.user!, clubId, dto);
  }

  @Get('clubs/:clubId/squads')
  listSquads(
    @Req() req: AuthenticatedRequest,
    @Param('clubId', ParseUUIDPipe) clubId: string,
  ) {
    return this.clubService.listSquads(req.user!, clubId);
  }

  @Patch('squads/:squadId')
  updateSquad(
    @Req() req: AuthenticatedRequest,
    @Param('squadId', ParseUUIDPipe) squadId: string,
    @Body() dto: UpdateSquadDto,
  ) {
    return this.clubService.updateSquad(req.user!, squadId, dto);
  }

  @Post('squads/:squadId/members')
  addSquadMember(
    @Req() req: AuthenticatedRequest,
    @Param('squadId', ParseUUIDPipe) squadId: string,
    @Body() dto: AddSquadMemberDto,
  ) {
    return this.clubService.addSquadMember(req.user!, squadId, dto);
  }

  @Delete('squads/:squadId/members/:userId')
  removeSquadMember(
    @Req() req: AuthenticatedRequest,
    @Param('squadId', ParseUUIDPipe) squadId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.clubService.removeSquadMember(req.user!, squadId, userId);
  }
}

@Controller('invitations')
@UseGuards(SupabaseAuthGuard)
export class InvitationController {
  constructor(private readonly clubService: ClubService) {}

  @Post(':token/accept')
  acceptInvitation(
    @Req() req: AuthenticatedRequest,
    @Param('token') token: string,
  ) {
    return this.clubService.acceptInvitation(req.user!, token);
  }
}
