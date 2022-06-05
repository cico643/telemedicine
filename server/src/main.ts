import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PORT, SESSION_SECRET } from './config';
import logger from './lib/logger';
import { RedisService } from './providers/redis/redis.service';
import { session } from './common/middlewares/session.middleware';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
const cors = require('cors');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger,
  });

  const redisService = app.get(RedisService);

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Telemedicine')
    .setDescription('Telemedicine API Documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Middleware
  //app.use(cors());
  app.set('trust proxy', 1);
  app.enableCors({
    origin: 'https://teletip-marmara.netlify.app',
    credentials: true,
  });
  app.use(helmet());
  app.use(session(redisService.instance));
  app.use(cookieParser(SESSION_SECRET));

  await app.listen(PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap().catch(console.error);
