import { Group } from 'src/group/ENTITIES/group.entity';
import { User } from 'src/user/ENTITIES/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
export enum Location {
  Profile="Profile",
  Group="Group",
}
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

  //used to know which location should list this post
  //there are two types of posts --> the first one should list from profile and the second one from group
  @Column()
  source:Location

  //generally typeorm will create userId column automatically as a foreign key refer to user
  //the importance of these two lines is when i try to create new post
  //instead of refer to the Post like this (description,createdAt,updatedAt,User()) while User() is object
  //we will refer to it like this (description,createdAt,updatedAt,userId) while userId is string
  //both ways are working
  @Column({name:'userId'})
  userId:string
  //many posts can owned by one user
  @ManyToOne(()=>User,(user)=>user.postes)
  user: User;

  //nullable makes the relationship optional
  @Column({name:'groupId',nullable: true})
  groupId:string
  //many posts can owned by one group
  @ManyToOne(()=>Group,(group)=>group.postes)
  group: Group;
}