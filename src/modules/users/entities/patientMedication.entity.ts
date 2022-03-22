import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Medication } from './medication.entity';
import { Patient } from './patient.entity';

@Entity()
export class PatientMedication {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Patient, (patient) => patient.patientMedications)
  patient: Patient;

  @ManyToOne(() => Medication, (medication) => medication.patientMedications)
  medication: Medication;
}
