import { Role } from 'src/auth/DECORATORS/role/interface';
import { Group } from 'src/group/ENTITIES/group.entity';
import { Post } from 'src/post/ENTITIES/post.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class User {
  //instead of using id as number like:1,2,3...
  //'uuid' will make IDs unique
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullname: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default:Role.User}) // Specify your default value here
  role: Role;
  
  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

    //Consider two entities: User and Post. If User can have multiple Postes entities associated with it (one-to-many relationship)
    //(Many side - one-to-many)
    //cascade:true that means when i delete the user with delete his postes too

    //user can have many posts
    @OneToMany(() => Post, (post) => post.user,{cascade:true})
    postes: Post[];
    //user can own many groups
    @OneToMany(() => Group, (group) => group.admin,{cascade:true})
    adminIn: Group[];
    //each one user can joined to many groups
    @ManyToMany(() => Group, (group) => group.members,{cascade:true})
    memberIn:Group[]

    

    
}