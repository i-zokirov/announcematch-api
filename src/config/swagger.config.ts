import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

export const swaggerCustomOptions: SwaggerCustomOptions = {
  customSiteTitle: 'AnnounceMatch API Docs',
  swaggerOptions: {
    authActions: {
      bearerAuth: {
        name: 'Bearer',
        schema: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
        },
      },
      value: 'Bearer <JWT>',
    },
  },
};

export const swaggerConfig = new DocumentBuilder()
  .setTitle('AnnounceMatch API Docs')
  .setDescription('')
  .setVersion('1.0')
  .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
  .build();
