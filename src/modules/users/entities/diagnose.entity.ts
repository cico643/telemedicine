import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PatientDiagnose } from './patientDiagnose.entity';

@Entity()
export class Diagnose {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(
    () => PatientDiagnose,
    (patientDiagnose) => patientDiagnose.diagnose,
    { eager: true },
  )
  patientDiagnoses: PatientDiagnose[];
}
