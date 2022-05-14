import { Appointment } from '../../appointments/entities/appointment.entity';
import { Document } from '../../documents/document.entity';
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

  @OneToMany(() => Appointment, (appointment) => appointment.patient, {
    eager: true,
    cascade: true,
    nullable: true,
  })
  appointments?: Appointment[];

  @OneToMany(() => Document, (document) => document.patient, {
    eager: true,
    cascade: true,
    nullable: true,
  })
  documents?: Document[];

  @OneToMany(
    () => PatientDiagnose,
    (patientDiagnose) => patientDiagnose.patient,
    { eager: true, cascade: true, nullable: true },
  )
  patientDiagnoses?: PatientDiagnose[];

  @OneToMany(
    () => PatientMedication,
    (patientMedication) => patientMedication.patient,
    { eager: true, cascade: true, nullable: true },
  )
  patientMedications?: PatientMedication[];

  @OneToMany(
    () => PatientRelative,
    (patientRelative) => patientRelative.patient,
    { eager: true, cascade: true, nullable: true },
  )
  patientRelatives?: PatientRelative[];
}
