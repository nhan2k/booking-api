import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  // Serve files from the 'uploads' directory
  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
  await app.listen(3001);
}
bootstrap();
