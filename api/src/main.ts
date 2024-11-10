import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SeedService } from './services/seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const config = new DocumentBuilder()
    .setTitle('What Ai API')
    .setDescription('description')
    .setVersion('1.0')
    .build();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, config));
  await app.listen(process.env.API_PORT);

  try {
    const seedService = app.get(SeedService);
    await seedService.seedAll();
  } catch (err) {
    console.error('❌ ~ Seed ~ err:', err);
  }
  Logger.log(
    `🚀 Application is running on: http://localhost:${process.env.API_PORT}/`,
  );
}

bootstrap();
