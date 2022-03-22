import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Patient } from './patient.entity';
import { Relative } from './relative.entity';

// other relations will be added.
enum Relation {
  MOTHER = 'mother',
  FATHER = 'father',
}

@Entity()
export class PatientRelative {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Patient, (patient) => patient.patientRelatives)
  patient: Patient;

  @ManyToOne(() => Relative, (relative) => relative.patientRelatives)
  relative: Relative;

  @Column({
    type: 'enum',
    enum: Relation,
    default: Relation.MOTHER,
  })
  relation: Relation;
}
