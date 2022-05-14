import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsController } from './doctors/doctors.controller';
import { DoctorsService } from './doctors/doctors.service';
import { Diagnose } from './entities/diagnose.entity';
import { Doctor } from './entities/doctor.entity';
import { Medication } from './entities/medication.entity';
import { Patient } from './entities/patient.entity';
import { PatientDiagnose } from './entities/patientDiagnose.entity';
import { PatientMedication } from './entities/patientMedication.entity';
import { PatientRelative } from './entities/patientRelative.entity';
import { Relative } from './entities/relative.entity';
import { CurrentUserMiddleware } from '../../common/middlewares/current-user.middleware';
import { PatientsController } from './patients/patients.controller';
import { PatientsService } from './patients/patients.service';
import PublicFile from 'src/providers/s3/publicFile.entity';
import { FilesModule } from 'src/providers/s3/files.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Diagnose,
      Medication,
      Patient,
      PatientDiagnose,
      PatientMedication,
      PatientRelative,
      Relative,
      Doctor,
      PublicFile,
    ]),
    FilesModule,
  ],
  controllers: [PatientsController, DoctorsController],
  providers: [PatientsService, DoctorsService, Logger],
})
export class UsersModule {
  constructor() {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
