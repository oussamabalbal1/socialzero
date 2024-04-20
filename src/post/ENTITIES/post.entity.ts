import { User } from 'src/user/ENTITIES/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Post {
  //instead of using id as number like:1,2,3...
  //'uuid' will make IDs unique
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;
  
  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  //generally typeorm will create userId column automatically as a foreign key refer to user
  //the importance of these two lines is when i try to create new post
  //instead of refer to the Post like this (description,createdAt,updatedAt,User()) while User() is object
  //we will refer to it like this (description,createdAt,updatedAt,userId) while userId is string
  //both ways are working
  @Column({name:'userId'})
  userId:string
      // (One side - many-to-one):
  @ManyToOne(()=>User,(student)=>student.postes)
  user: User;
}