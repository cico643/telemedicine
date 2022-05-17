import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PatientMedication } from './patientMedication.entity';

@Entity()
export class Medication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(
    () => PatientMedication,
    (patientMedication) => patientMedication.medication,
  )
  patientMedications: PatientMedication[];
}
