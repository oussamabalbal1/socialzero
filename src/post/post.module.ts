import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './ENTITIES/post.entity';
import { User } from 'src/user/ENTITIES/user.entity';
import { UserService } from 'src/user/user.service';
import { PostExtractTokenToGetIdMiddleware } from 'src/MIDDLEWARES/post.extract-token-to-get-id.middleware';

@Module({
  imports: [
    //adding entities
    TypeOrmModule.forFeature([Post,User])
],
  providers: [PostService,UserService],
  controllers: [PostController]
  
})
//applying middleware for all routes inside PosttContoller
export class PostModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PostExtractTokenToGetIdMiddleware).forRoutes(
      PostController
      // { path: 'post', method: RequestMethod.GET }
    )
  }

}
