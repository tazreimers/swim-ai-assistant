import 'dotenv/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { AppModule } from './app.module';
import { validateApiConfig } from './config/runtime-config';

async function bootstrap() {
  validateApiConfig();
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('http');
  app.use((request: Request, response: Response, next: NextFunction) => {
    const requestIdHeader = request.headers['x-request-id'];
    const requestId =
      typeof requestIdHeader === 'string' && requestIdHeader.trim()
        ? requestIdHeader
        : randomUUID();
    const startedAt = Date.now();
    response.setHeader('x-request-id', requestId);
    response.on('finish', () => {
      const status = response.statusCode;
      logger.log(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          service: 'api',
          requestId,
          route: request.path,
          status,
          durationMs: Date.now() - startedAt,
          errorCode: status >= 400 ? `HTTP_${Math.floor(status / 100)}XX` : null,
        }),
      );
    });
    next();
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`API listening on port ${port}`);
}

bootstrap();
