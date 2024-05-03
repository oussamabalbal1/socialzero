import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Roles } from './DECORATORS/role/role.decorator';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/ENTITIES/user.entity';

@Injectable()
export class AuthRoleGuard implements CanActivate {

  constructor(
    //we need JWT Service to decode the token a get user is to check the use is a normal user or admin 
    private jwtService: JwtService,
    private readonly userservice:UserService,
    //the same reflector that we user to create the role decorator
    //we need it to retrive the data that have been sent into the decorate to check if it is admin or normal user 
    private reflector:Reflector) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    console.log("inside auth role guard")

    const request = context.switchToHttp().getRequest();

    //this role set based on user token
    const currentUserRole=request["params_role"]
  
  
    //retrive the data sent by Role decorator
    const role=this.reflector.get(Roles,context.getHandler())
    if(!(currentUserRole.role==role)){
      throw new HttpException('UNAUTHORIZED',HttpStatus.UNAUTHORIZED)
    }
    return true;
  }

}
