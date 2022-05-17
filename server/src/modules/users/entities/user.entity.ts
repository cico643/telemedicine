import PublicFile from '../../../providers/s3/publicFile.entity';
import { Column, JoinColumn, OneToOne } from 'typeorm';

export enum UserRole {
  Doctor = 'doctor',
  Patient = 'patient',
  Admin = 'admin',
}

export abstract class User {
  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  password: string;

  @Column()
  address: string;

  @Column()
  phoneNumber: string;

  @JoinColumn()
  @OneToOne(() => PublicFile, {
    eager: true,
    nullable: true,
  })
  avatar?: PublicFile;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Patient,
  })
  type: UserRole;
}
