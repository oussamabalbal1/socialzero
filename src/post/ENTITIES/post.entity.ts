import { User } from 'src/user/ENTITIES/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Post {
  //instead of using id as number like:1,2,3...
  //'uuid' will make IDs unique
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  description: string;
  
  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
  
      // (One side - many-to-one):
  @ManyToOne(()=>User,(student)=>student.postes)
  user: User;
}