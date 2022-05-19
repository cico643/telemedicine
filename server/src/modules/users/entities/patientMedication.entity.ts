import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Medication } from './medication.entity';
import { Patient } from './patient.entity';

@Entity()
export class PatientMedication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startDate: string;

  @Column({ nullable: true })
  endDate?: string;

  @Column()
  dailyDosage: number;

  @ManyToOne(() => Patient, (patient) => patient.patientMedications)
  patient: Patient;

  @ManyToOne(() => Medication, (medication) => medication.patientMedications, {
    eager: true,
    cascade: ['insert'],
  })
  medication: Medication;
}
