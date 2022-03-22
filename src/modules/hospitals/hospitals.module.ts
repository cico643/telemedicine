import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { Hospital } from './entities/hospital.entity';
import { HospitalsController } from './hospitals.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Hospital, Department])],
  controllers: [HospitalsController],
})
export class HospitalsModule {}
