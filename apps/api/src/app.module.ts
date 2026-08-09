import { Controller, Get, Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Controller()
class HealthController {
  @Get('health')
  getHealth() {
    return { status: 'ok', message: 'Swim AI API is running' };
  }
}

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
