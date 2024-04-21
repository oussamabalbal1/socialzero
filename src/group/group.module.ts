import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './ENTITIES/group.entity';
import { User } from 'src/user/ENTITIES/user.entity';
import { PostExtractTokenToGetIdMiddleware } from 'src/MIDDLEWARES/post.extract-token-to-get-id.middleware';

@Module({
  imports: [
    //adding entities
    TypeOrmModule.forFeature([Group,User])
],
  controllers: [GroupController],
  providers: [GroupService]
})

//applying middleware for all routes inside GroupContoller
export class GroupModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PostExtractTokenToGetIdMiddleware).forRoutes(
      GroupController
      // { path: 'post', method: RequestMethod.GET }
    )
  }

}
