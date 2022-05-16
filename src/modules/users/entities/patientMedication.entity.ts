import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Medication } from './medication.entity';
import { Patient } from './patient.entity';

@Entity()
export class PatientMedication {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Patient, (patient) => patient.patientMedications, {
    cascade: true,
  })
  patient: Patient;

  @ManyToOne(() => Medication, (medication) => medication.patientMedications, {
    eager: true,
    cascade: ['insert'],
  })
  medication: Medication;
}
