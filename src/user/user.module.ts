import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './ENTITIES/user.entity';
import { Post } from 'src/post/ENTITIES/post.entity';
import { PostService } from 'src/post/post.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    //adding entities
    TypeOrmModule.forFeature([User])
],
exports:[UserService]
})
export class UserModule {
    
}
