import { Column } from 'typeorm';

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

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Patient
  })
  type: UserRole;
}
