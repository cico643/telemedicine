import PublicFile from '../../../providers/s3/publicFile.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Appointment } from './appointment.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @JoinColumn()
  @OneToOne(() => PublicFile, {
    eager: true,
    nullable: true,
  })
  image?: PublicFile;

  @ManyToOne(() => Appointment, (appointment) => appointment.documents)
  appointment: Appointment;
}
