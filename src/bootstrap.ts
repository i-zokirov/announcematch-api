import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { helperConfigOptions } from './config/helmet.config';
import { swaggerConfig, swaggerCustomOptions } from './config/swagger.config';
import { AllExceptionsFilter } from './utils/exception-filter';
import { PayloadTooLargeFilter } from './utils/payload-too-large-filter';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: '*', credentials: true });

  app.use(helmet(helperConfigOptions));

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalFilters(new PayloadTooLargeFilter());

  app.use(json({ limit: '2mb' }));
  app.use(urlencoded({ extended: true, limit: '2mb' }));

  app.setGlobalPrefix('api');

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/docs', app, document, swaggerCustomOptions);

  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

export default bootstrap;
