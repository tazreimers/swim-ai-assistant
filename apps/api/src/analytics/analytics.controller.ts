import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SupabaseAuthGuard } from '../common/guards/auth.guard';
import type { AuthenticatedRequest } from '../common/types/authenticated-request';
import { AnalyticsService } from './analytics.service';
import { ProgressQueryDto } from './analytics.dto';

@Controller()
@UseGuards(SupabaseAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('athletes/me/progress')
  getAthleteProgress(
    @Req() req: AuthenticatedRequest,
    @Query() query: ProgressQueryDto,
  ) {
    return this.analyticsService.getAthleteProgress(req.user!, query);
  }

  @Get('athletes/me/sessions')
  getAthleteSessions(
    @Req() req: AuthenticatedRequest,
    @Query() query: ProgressQueryDto,
  ) {
    return this.analyticsService.getAthleteSessions(req.user!, query);
  }

  @Get('sessions/:sessionId/results')
  getSessionResults(
    @Req() req: AuthenticatedRequest,
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
  ) {
    return this.analyticsService.getSessionResults(req.user!, sessionId);
  }

  @Get('sessions/:sessionId/summary')
  getSessionSummary(
    @Req() req: AuthenticatedRequest,
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
  ) {
    return this.analyticsService.getSessionSummary(req.user!, sessionId);
  }

  @Get('coach/dashboard')
  getCoachDashboard(
    @Req() req: AuthenticatedRequest,
    @Query('clubId', ParseUUIDPipe) clubId: string,
    @Query() query: ProgressQueryDto,
  ) {
    return this.analyticsService.getCoachDashboard(req.user!, clubId, query);
  }

  @Get('squads/:squadId/progress')
  getSquadProgress(
    @Req() req: AuthenticatedRequest,
    @Param('squadId', ParseUUIDPipe) squadId: string,
    @Query() query: ProgressQueryDto,
  ) {
    return this.analyticsService.getSquadProgress(req.user!, squadId, query);
  }
}
