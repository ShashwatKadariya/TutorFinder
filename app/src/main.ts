import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';

import * as cookieParser from 'cookie-parser';

// swagger imports
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { swaggerConfig } from 'src/config';

import { PrismaClientExceptionFilter } from './prisma-client-exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  // validation pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // swagger setup
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDocument);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  await app.listen(3000);
}
bootstrap();
