import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ClubController, InvitationController } from './club.controller';
import { ClubService } from './club.service';

@Module({
  imports: [PrismaModule],
  controllers: [ClubController, InvitationController],
  providers: [ClubService],
})
export class ClubModule {}
