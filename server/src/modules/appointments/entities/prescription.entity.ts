import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Appointment } from './appointment.entity';

@Entity()
export class Prescription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @OneToOne(() => Appointment, (appointment) => appointment.prescription)
  appointment: Appointment;
}
