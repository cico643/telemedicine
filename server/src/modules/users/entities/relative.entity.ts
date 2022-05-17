import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Patient } from './patient.entity';

// other relations will be added.
export enum Relation {
  MOTHER = 'mother',
  FATHER = 'father',
  SISTER = 'sister',
  BROTHER = 'brother',
  AUNT = 'aunt',
  UNCLE = 'uncle',
  COUSIN = 'cousin',
  FRIEND = 'friend',
}

@Entity()
export class Relative {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Patient, (patient) => patient.relatives)
  patient: Patient;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: Relation,
    default: Relation.MOTHER,
  })
  relation: Relation;
}
