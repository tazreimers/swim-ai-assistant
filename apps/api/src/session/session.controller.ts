import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SupabaseAuthGuard } from '../common/guards/auth.guard';
import type { AuthenticatedRequest } from '../common/types/authenticated-request';
import {
  CreateSessionDto,
  PhotoCompleteDto,
  PhotoUploadDto,
  SaveResultDto,
  UpdateSessionDto,
} from './session.dto';
import { SessionService } from './session.service';

@Controller()
@UseGuards(SupabaseAuthGuard)
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('sessions')
  createSession(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateSessionDto,
  ) {
    return this.sessionService.createSession(req.user!, dto);
  }

  @Get('squads/:squadId/sessions')
  listSquadSessions(
    @Req() req: AuthenticatedRequest,
    @Param('squadId', ParseUUIDPipe) squadId: string,
  ) {
    return this.sessionService.listSquadSessions(req.user!, squadId);
  }

  @Get('athletes/me/sessions/today')
  getTodaySessions(@Req() req: AuthenticatedRequest) {
    return this.sessionService.getTodaySessions(req.user!);
  }

  @Get('sessions/:sessionId')
  getSession(
    @Req() req: AuthenticatedRequest,
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
  ) {
    return this.sessionService.getSession(req.user!, sessionId);
  }

  @Patch('sessions/:sessionId')
  updateSession(
    @Req() req: AuthenticatedRequest,
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Body() dto: UpdateSessionDto,
  ) {
    return this.sessionService.updateSession(req.user!, sessionId, dto);
  }

  @Post('sessions/:sessionId/publish')
  publishSession(
    @Req() req: AuthenticatedRequest,
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
  ) {
    return this.sessionService.publishSession(req.user!, sessionId);
  }

  @Post('sessions/:sessionId/photo')
  createPhotoUpload(
    @Req() req: AuthenticatedRequest,
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Body() dto: PhotoUploadDto,
  ) {
    return this.sessionService.createPhotoUpload(req.user!, sessionId, dto);
  }

  @Post('sessions/:sessionId/photo/complete')
  completePhoto(
    @Req() req: AuthenticatedRequest,
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Body() dto: PhotoCompleteDto,
  ) {
    return this.sessionService.completePhoto(req.user!, sessionId, dto);
  }

  @Get('sessions/:sessionId/photo-url')
  getPhotoUrl(
    @Req() req: AuthenticatedRequest,
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
  ) {
    return this.sessionService.getPhotoUrl(req.user!, sessionId);
  }

  @Get('sessions/:sessionId/my-result')
  getMyResult(
    @Req() req: AuthenticatedRequest,
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
  ) {
    return this.sessionService.getMyResult(req.user!, sessionId);
  }

  @Put('sessions/:sessionId/my-result')
  saveMyResult(
    @Req() req: AuthenticatedRequest,
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Body() dto: SaveResultDto,
  ) {
    return this.sessionService.saveMyResult(req.user!, sessionId, dto);
  }

  @Post('sessions/:sessionId/my-result/complete')
  completeMyResult(
    @Req() req: AuthenticatedRequest,
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
  ) {
    return this.sessionService.completeMyResult(req.user!, sessionId);
  }
}
