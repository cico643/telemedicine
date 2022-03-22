import { Appointment } from '../../appointments/entities/appointment.entity';
import { Department } from '../../hospitals/entities/department.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PatientDiagnose } from './patientDiagnose.entity';
import { User } from './user.entity';

@Entity()
export class Doctor extends User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @ManyToOne(() => Department, (department) => department.doctors)
  department: Department;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];

  @OneToMany(
    () => PatientDiagnose,
    (patientDiagnose) => patientDiagnose.doctor,
    { nullable: true },
  )
  patientDiagnoses?: PatientDiagnose[];
}
