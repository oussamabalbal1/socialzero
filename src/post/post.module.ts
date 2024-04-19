import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './ENTITIES/post.entity';
import { User } from 'src/user/ENTITIES/user.entity';

@Module({
  imports: [
    //adding entities
    TypeOrmModule.forFeature([Post,User])
],
  providers: [PostService],
  controllers: [PostController]
})
export class PostModule {}
