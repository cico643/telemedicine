import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diagnose } from './entities/diagnose.entity';
import { Doctor } from './entities/doctor.entity';
import { Medication } from './entities/medication.entity';
import { Patient } from './entities/patient.entity';
import { PatientDiagnose } from './entities/patientDiagnose.entity';
import { PatientMedication } from './entities/patientMedication.entity';
import { PatientRelative } from './entities/patientRelative.entity';
import { Relative } from './entities/relative.entity';
import PublicFile from 'src/providers/s3/publicFile.entity';
import { FilesModule } from 'src/providers/s3/files.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

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
  controllers: [UsersController],
  providers: [UsersService, Logger],
})
export class UsersModule {}
