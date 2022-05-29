import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Appointment } from './appointment.entity';
import { PrescriptionMedication } from './prescriptionMedication.entity';

@Entity()
export class Prescription {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @OneToOne(() => Appointment, (appointment) => appointment.prescription)
  appointment: Appointment;

  @OneToMany(
    () => PrescriptionMedication,
    (prescriptionMedication) => prescriptionMedication.prescription,
    { cascade: true, nullable: true, eager: true },
  )
  prescriptionMedications?: PrescriptionMedication[];
}
