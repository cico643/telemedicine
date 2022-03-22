import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PatientDiagnose } from './patientDiagnose.entity';

@Entity()
export class Diagnose {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(
    () => PatientDiagnose,
    (patientDiagnose) => patientDiagnose.diagnose,
  )
  patientDiagnoses: PatientDiagnose[];
}
