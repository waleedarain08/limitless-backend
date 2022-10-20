import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  const configService = app.get<ConfigService>(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('Limitless Children')
    .setDescription('Limitless Children API documentation')
    .setVersion('v1.0')
    .addTag('limitless-children')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(configService.get('PORT') || 8080);
}
bootstrap();
