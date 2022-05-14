import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PatientRelative } from './patientRelative.entity';

@Entity()
export class Relative {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  phoneNumber: string;

  @OneToMany(
    () => PatientRelative,
    (patientRelative) => patientRelative.relative,
    { eager: true },
  )
  patientRelatives: PatientRelative[];
}
