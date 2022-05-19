import { Appointment } from '../../appointments/entities/appointment.entity';
import { Document } from '../../documents/document.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PatientDiagnose } from './patientDiagnose.entity';
import { PatientMedication } from './patientMedication.entity';
import { Relative } from './relative.entity';
import { User } from './user.entity';

export enum BloodTypes {
  OPositive = '0+',
  ONegative = '0-',
  APositive = 'A+',
  ANegative = 'A-',
  BPositive = 'B+',
  BNegative = 'B-',
  ABPositive = 'AB+',
  ABNegative = 'AB-',
}

@Entity()
export class Patient extends User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  height: number;

  @Column()
  weight: number;

  @Column({
    type: 'enum',
    enum: BloodTypes,
  })
  bloodType: BloodTypes;

  @OneToMany(() => Appointment, (appointment) => appointment.patient, {
    cascade: true,
    nullable: true,
  })
  appointments?: Appointment[];

  @OneToMany(() => Document, (document) => document.patient, {
    cascade: true,
    nullable: true,
  })
  documents?: Document[];

  @OneToMany(
    () => PatientDiagnose,
    (patientDiagnose) => patientDiagnose.patient,
    { nullable: true },
  )
  patientDiagnoses?: PatientDiagnose[];

  @OneToMany(
    () => PatientMedication,
    (patientMedication) => patientMedication.patient,
    { cascade: true, nullable: true },
  )
  patientMedications?: PatientMedication[];

  @OneToMany(() => Relative, (relative) => relative.patient, {
    cascade: true,
    nullable: true,
  })
  relatives?: Relative[];

  toJSON() {
    delete this.password;
    return this;
  }
}