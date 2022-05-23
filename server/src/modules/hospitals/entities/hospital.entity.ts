import { Department } from './department.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Hospital {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  province: string;

  @Column()
  district: string;

  @OneToMany(() => Department, (department) => department.hospital, {
    cascade: true,
  })
  departments: Department[];
}
