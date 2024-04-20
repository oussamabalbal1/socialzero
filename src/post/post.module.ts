import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './ENTITIES/post.entity';
import { User } from 'src/user/ENTITIES/user.entity';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    //adding entities
    TypeOrmModule.forFeature([Post,User])
],
  providers: [PostService,UserService],
  controllers: [PostController]
  
})
export class PostModule {}
