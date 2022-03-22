import { Hospital } from 'src/modules/hospitals/entities/hospital.entity';
import { Doctor } from 'src/modules/users/entities/doctor.entity';
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

  @OneToMany(() => Doctor, (doctor) => doctor.department)
  doctors: Doctor[];

  @ManyToOne(() => Hospital, (hospital) => hospital.departments)
  hospital: Hospital;
}
