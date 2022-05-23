import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule } from '../../providers/s3/files.module';
import { UsersModule } from '../users/users.module';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './entities/appointment.entity';
import { Document } from './entities/document.entity';
import { Prescription } from './entities/prescription.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Prescription, Document]),
    UsersModule,
    FilesModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, Logger],
})
export class AppointmentsModule {}
