import { Document } from '../../documents/document.entity';
import { Doctor } from '../../users/entities/doctor.entity';
import { Patient } from '../../users/entities/patient.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Prescription } from './prescription.entity';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  startHour: Date;

  @Column()
  endHour: Date;

  @Column()
  note: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments)
  doctor: Doctor;

  @ManyToOne(() => Patient, (patient) => patient.appointments)
  patient: Patient;

  @OneToOne(() => Prescription, (prescription) => prescription.appointment)
  prescription: Prescription;

  @OneToMany(() => Document, (document) => document.appointment)
  documents: Document[];
}
