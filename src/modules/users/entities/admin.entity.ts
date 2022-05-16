import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Admin extends User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;
}
