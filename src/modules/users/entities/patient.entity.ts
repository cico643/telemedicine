import { Appointment } from 'src/modules/appointments/entities/appointment.entity';
import { Document } from 'src/modules/documents/document.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PatientDiagnose } from './patientDiagnose.entity';
import { PatientMedication } from './patientMedication.entity';
import { PatientRelative } from './patientRelative.entity';
import { User } from './user.entity';

@Entity()
export class Patient extends User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];

  @OneToMany(() => Document, (document) => document.patient)
  documents: Document[];

  @OneToMany(
    () => PatientDiagnose,
    (patientDiagnose) => patientDiagnose.patient,
  )
  patientDiagnoses: PatientDiagnose[];

  @OneToMany(
    () => PatientMedication,
    (patientMedication) => patientMedication.patient,
  )
  patientMedications: PatientMedication[];

  @OneToMany(
    () => PatientRelative,
    (patientRelative) => patientRelative.patient,
  )
  patientRelatives: PatientRelative[];
}
