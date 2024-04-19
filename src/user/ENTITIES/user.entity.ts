import { Post } from 'src/post/ENTITIES/post.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

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

    //Consider two entities: User and Post. If User can have multiple Postes entities associated with it (one-to-many relationship)
    //(Many side - one-to-many)
    //cascade:true that means when i delete the user with delete his postes too
    @OneToMany(() => Post, (post) => post.user,{cascade:true})
    postes: Post[];

    
}