import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  NODE_ENV,
  POSTGRES_DB,
  POSTGRES_HOST,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_USER,
} from 'src/config';
import { Document } from '../../modules/appointments/entities/document.entity';
import { Appointment } from '../../modules/appointments/entities/appointment.entity';
import { Prescription } from '../../modules/appointments/entities/prescription.entity';
import { Department } from '../../modules/hospitals/entities/department.entity';
import { Hospital } from '../../modules/hospitals/entities/hospital.entity';
import { Admin } from '../../modules/users/entities/admin.entity';
import { Diagnose } from '../../modules/users/entities/diagnose.entity';
import { Doctor } from '../../modules/users/entities/doctor.entity';
import { Medication } from '../../modules/users/entities/medication.entity';
import { Patient } from '../../modules/users/entities/patient.entity';
import { PatientDiagnose } from '../../modules/users/entities/patientDiagnose.entity';
import { PatientMedication } from '../../modules/users/entities/patientMedication.entity';
import { Relative } from '../../modules/users/entities/relative.entity';
import { User } from '../../modules/users/entities/user.entity';
import PublicFile from '../s3/publicFile.entity';
import { PrescriptionMedication } from '../../modules/appointments/entities/prescriptionMedication.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ssl: NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      type: 'postgres',
      host: POSTGRES_HOST,
      port: Number(POSTGRES_PORT),
      username: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      database: POSTGRES_DB,
      entities: [
        PublicFile,
        User,
        Admin,
        Doctor,
        Patient,
        Document,
        Diagnose,
        Relative,
        Hospital,
        Medication,
        Department,
        Appointment,
        Prescription,
        PatientDiagnose,
        PatientMedication,
        PrescriptionMedication,
      ],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
