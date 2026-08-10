import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SupabaseAuthGuard } from '../common/guards/auth.guard';
import type { AuthenticatedRequest } from '../common/types/authenticated-request';
import { AiService } from './ai.service';

@Controller()
@UseGuards(SupabaseAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('sessions/:sessionId/ai-report')
  generateReport(
    @Req() req: AuthenticatedRequest,
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
  ) {
    return this.aiService.generateReport(req.user!, sessionId);
  }

  @Get('sessions/:sessionId/ai-report')
  getSessionReport(
    @Req() req: AuthenticatedRequest,
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
  ) {
    return this.aiService.getSessionReport(req.user!, sessionId);
  }

  @Get('athletes/me/ai-insights')
  getMyInsights(@Req() req: AuthenticatedRequest) {
    return this.aiService.getMyInsights(req.user!);
  }

  @Post('ai-reports/:reportId/regenerate')
  regenerate(
    @Req() req: AuthenticatedRequest,
    @Param('reportId', ParseUUIDPipe) reportId: string,
  ) {
    return this.aiService.regenerate(req.user!, reportId);
  }
}
