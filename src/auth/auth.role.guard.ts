import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Roles } from './DECORATORS/role/role.decorator';

@Injectable()
export class AuthRoleGuard implements CanActivate {

  constructor(
    //we need JWT Service to decode the token a get user is to check the use is a normal user or admin 
    private jwtService: JwtService,
    //the same reflector that we user to create the role decorator
    //we need it to retrive the data that have been sent into the decorate to check if it is admin or normal user 
    private reflector:Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log("inside auth role guard")

    const request = context.switchToHttp().getRequest();

    console.log(request)
    //retrive the data sent by Role decorator
    const role=this.reflector.get(Roles,context.getHandler())
    console.log(role)
    return true;
  }
}
