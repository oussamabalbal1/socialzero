import { Post } from 'src/post/ENTITIES/post.entity';
import { User } from 'src/user/ENTITIES/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, ManyToMany, OneToMany, JoinTable } from 'typeorm';

@Entity()
export class Group {
  //instead of using id as number like:1,2,3...
  //'uuid' will make IDs unique
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
  
  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  //generally typeorm will create userId column automatically as a foreign key refer to user
  //the importance of these two lines is when i try to create new post
  //instead of refer to the Post like this (description,createdAt,updatedAt,User()) while User() is object
  //we will refer to it like this (description,createdAt,updatedAt,userId) while userId is string
  //both ways are working
//   @Column({name:'userId'})
//   userId:string
//   @ManyToOne(()=>User,(user)=>user.postes)
//   user: User;

  //a group can owned by one user only
  @ManyToOne(()=>User,(user)=>user.groups)
  owner: User;

  //group can have many posts
  @OneToMany(()=>Post,(post)=>post.group)
  postes:Post[]

  //group can have many members
  //each one user can joined to many groups
  @ManyToMany(()=>User,(user)=>user.joinedGroups)
  @JoinTable({
    name: 'group_user', // Specify the name of the join table
    joinColumn: {
      name: 'groupId', // Specify the name of the column referencing Group entity
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'userId', // Specify the name of the column referencing User entity
      referencedColumnName: 'id'
    }
  })
  members:User[]
}