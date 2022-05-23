import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/services/users.service';
import { UsersModule } from '../users/users.module';
import { Department } from './entities/department.entity';
import { Hospital } from './entities/hospital.entity';
import { HospitalsController } from './hospitals.controller';
import { HospitalsService } from './hospitals.service';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Hospital, Department])],
  controllers: [HospitalsController],
  providers: [HospitalsService, Logger],
})
export class HospitalsModule {}
