import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './ENTITIES/user.entity';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    //adding entities
    TypeOrmModule.forFeature([User])
],
})
export class UserModule {
    
}
