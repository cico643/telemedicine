import {
  CacheModule,
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { DatabaseModule } from './providers/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { HospitalsModule } from './modules/hospitals/hospitals.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { RolesGuard } from './common/guards/role.guard';
import LoggerMiddleware from './common/middlewares/logger.middleware';
import { FilesModule } from './providers/s3/files.module';
import { RedisModule } from './providers/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { CitiesController } from './cities.controller';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    HospitalsModule,
    AppointmentsModule,
    FilesModule,
    RedisModule,
    CacheModule.register({
      ttl: 8 * 60 * 60,
    }),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    Logger,
  ],
  controllers: [CitiesController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
