import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Diagnose } from './diagnose.entity';
import { Doctor } from './doctor.entity';
import { Patient } from './patient.entity';

@Entity()
export class PatientDiagnose {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'bool', nullable: true, default: false })
  approved: boolean;

  @ManyToOne(() => Patient, (patient) => patient.patientDiagnoses, {
    cascade: true,
  })
  patient: Patient;

  @ManyToOne(() => Diagnose, (diagnose) => diagnose.patientDiagnoses, {
    eager: true,
    cascade: ['insert'],
  })
  diagnose: Diagnose;

  @ManyToOne(() => Doctor, (doctor) => doctor.patientDiagnoses, {
    eager: true,
    nullable: true,
  })
  doctor?: Doctor;
}
