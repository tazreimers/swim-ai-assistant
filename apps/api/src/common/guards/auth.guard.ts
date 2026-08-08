import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyToken } from '@clerk/backend';
import type { AuthenticatedRequest } from '../types/authenticated-request';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.headers.authorization;
    const token = authorization?.startsWith('Bearer ')
      ? authorization.slice('Bearer '.length)
      : undefined;

    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      throw new UnauthorizedException('Clerk authentication is not configured');
    }

    try {
      const claims = await verifyToken(token, {
        secretKey,
        issuer: null,
      });

      if (!claims.sub) {
        throw new UnauthorizedException('Token does not contain a user ID');
      }

      request.user = {
        id: claims.sub,
        email: typeof claims.email === 'string' ? claims.email : '',
        firstName:
          typeof claims.first_name === 'string' ? claims.first_name : undefined,
        lastName:
          typeof claims.last_name === 'string' ? claims.last_name : undefined,
        imageUrl: typeof claims.image_url === 'string' ? claims.image_url : undefined,
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException('Invalid or expired bearer token');
    }
  }
}
