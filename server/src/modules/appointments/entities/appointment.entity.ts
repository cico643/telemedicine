import { Doctor } from '../../users/entities/doctor.entity';
import { Patient } from '../../users/entities/patient.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Prescription } from './prescription.entity';
import { Document } from './document.entity';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  startHour: string;

  @Column({ nullable: true })
  note: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments, {
    eager: true,
  })
  doctor: Doctor;

  @ManyToOne(() => Patient, (patient) => patient.appointments, {
    eager: true,
  })
  patient: Patient;

  @JoinColumn()
  @OneToOne(() => Prescription, (prescription) => prescription.appointment, {
    eager: true,
    cascade: true,
  })
  prescription: Prescription;

  @OneToMany(() => Document, (document) => document.appointment, {
    eager: true,
    cascade: true,
  })
  documents: Document[];
}
