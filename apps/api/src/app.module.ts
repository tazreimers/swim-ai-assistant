import { Controller, Get, Module, ServiceUnavailableException } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ClubModule } from './club/club.module';
import { SessionModule } from './session/session.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AiModule } from './ai/ai.module';
import { PrismaService } from './prisma/prisma.service';

@Controller()
class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('health')
  async getHealth() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      throw new ServiceUnavailableException('Database health check failed');
    }

    return { status: 'ok', service: 'swim-api' };
  }
}

@Module({
  imports: [PrismaModule, UserModule, ClubModule, SessionModule, AnalyticsModule, AiModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
