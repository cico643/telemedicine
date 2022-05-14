import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Diagnose } from './diagnose.entity';
import { Doctor } from './doctor.entity';
import { Patient } from './patient.entity';

@Entity()
export class PatientDiagnose {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startDate: Date;

  @Column()
  approved: boolean;

  @ManyToOne(() => Patient, (patient) => patient.patientDiagnoses)
  patient: Patient;

  @ManyToOne(() => Diagnose, (diagnose) => diagnose.patientDiagnoses)
  diagnose: Diagnose;

  @ManyToOne(() => Doctor, (doctor) => doctor.patientDiagnoses, {
    nullable: true,
  })
  doctor?: Doctor;
}
