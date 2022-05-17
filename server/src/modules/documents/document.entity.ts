import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Patient } from '../users/entities/patient.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image: string;

  @ManyToOne(() => Appointment, (appointment) => appointment.documents)
  appointment: Appointment;

  @ManyToOne(() => Patient, (patient) => patient.documents)
  patient: Patient;
}
