import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  //instead of using id as number like:1,2,3...
  //'uuid' will make IDs unique
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  fullname: string;

  @Column()
  email: string;

  @Column()
  password: string;
  
  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}