import { Controller, Get, UseGuards, Req as RequestDecorator } from '@nestjs/common';
import { SupabaseAuthGuard } from '../common/guards/auth.guard';
import { AuthenticatedRequest } from '../common/types/authenticated-request';

@Controller('user')
export class UserController {
  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  getProfile(@RequestDecorator() req: AuthenticatedRequest) {
    return {
      id: req.user?.id,
      email: req.user?.email,
      firstName: req.user?.firstName,
      lastName: req.user?.lastName,
      imageUrl: req.user?.imageUrl,
    };
  }

  @Get('health')
  healthCheck() {
    return { status: 'ok', message: 'Swim AI API is running' };
  }
}
