import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsController } from './appointments.controller';
import { Appointment } from './entities/appointment.entity';
import { Prescription } from './entities/prescription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Prescription])],
  controllers: [AppointmentsController],
})
export class AppointmentsModule {}
