import { Medication } from '../../../modules/users/entities/medication.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Prescription } from './prescription.entity';

@Entity()
export class PrescriptionMedication {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => Prescription,
    (prescription) => prescription.prescriptionMedications,
  )
  prescription: Prescription;

  @ManyToOne(
    () => Medication,
    (medication) => medication.prescriptionMedications,
    {
      eager: true,
      cascade: true,
    },
  )
  medication: Medication;

  @Column()
  signatura: string;
}
