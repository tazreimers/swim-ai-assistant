import { Controller, Get, Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ClubModule } from './club/club.module';
import { SessionModule } from './session/session.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AiModule } from './ai/ai.module';

@Controller()
class HealthController {
  @Get('health')
  getHealth() {
    return { status: 'ok', message: 'Swim AI API is running' };
  }
}

@Module({
  imports: [PrismaModule, UserModule, ClubModule, SessionModule, AnalyticsModule, AiModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
