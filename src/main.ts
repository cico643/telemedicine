import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { COOKIE_SECRET, PORT } from './config';
import logger from './lib/logger';
const cors = require('cors');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger,
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Telemedicine')
    .setDescription('Telemedicine API Documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(cors());
  app.use(
    session({
      secret: COOKIE_SECRET,
    }),
  );
  await app.listen(PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap().catch(console.error);
