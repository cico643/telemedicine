import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diagnose } from './entities/diagnose.entity';
import { Doctor } from './entities/doctor.entity';
import { Medication } from './entities/medication.entity';
import { Patient } from './entities/patient.entity';
import { PatientDiagnose } from './entities/patientDiagnose.entity';
import { PatientMedication } from './entities/patientMedication.entity';
import PublicFile from 'src/providers/s3/publicFile.entity';
import { FilesModule } from 'src/providers/s3/files.module';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { DiagnosesController } from './controllers/diagnoses.controller';
import { DiagnosesService } from './services/diagnoses.service';
import { Admin } from './entities/admin.entity';
import { MedicationsController } from './controllers/medications.controller';
import { MedicationsService } from './services/medications.service';
import { Relative } from './entities/relative.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Diagnose,
      Medication,
      Patient,
      PatientDiagnose,
      PatientMedication,
      Relative,
      Doctor,
      PublicFile,
      Admin,
    ]),
    FilesModule,
  ],
  controllers: [UsersController, DiagnosesController, MedicationsController],
  providers: [UsersService, DiagnosesService, MedicationsService, Logger],
  exports: [UsersService],
})
export class UsersModule {}
