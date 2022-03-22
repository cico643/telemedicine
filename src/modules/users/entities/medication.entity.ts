import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PatientMedication } from './patientMedication.entity';

@Entity()
export class Medication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(
    () => PatientMedication,
    (patientMedication) => patientMedication.medication,
  )
  patientMedications: PatientMedication[];
}
