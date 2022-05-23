import { Hospital } from '../../hospitals/entities/hospital.entity';
import { Doctor } from '../../users/entities/doctor.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Doctor, (doctor) => doctor.department, {
    cascade: ['insert'],
  })
  doctors: Doctor[];

  @ManyToOne(() => Hospital, (hospital) => hospital.departments, {
    nullable: false,
  })
  hospital: Hospital;
}
