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
    //extract token and check it 
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new HttpException(`Access token is missing. Please provide an access token.`,HttpStatus.UNAUTHORIZED)
    }
    //retrive the data sent by Role decorator
    const role=this.reflector.get(Roles,context.getHandler())
  
    console.log(`should be ${role}`)


    try {
      // do not need secrete here to decode the token because you specefied the secret globally inside app module
      // if Token is invalid, JWT will throw an error
      const decoded = await this.jwtService.verify(token); 
      const params_custom= { uuid:decoded.id }
      console.log(params_custom)
      const user:User=await this.userservice.getOneUser(params_custom)
      if(!(user.role==role)){
        console.log("This user is not an admin..")
        throw new HttpException('User is not an admin',HttpStatus.UNAUTHORIZED)
      }
      request["params_custom"] = params_custom
      return true;
    } catch (error) {
      // handle JWT verification errors
      throw new HttpException(`Invalid token. Please provide a valid access token.`,HttpStatus.UNAUTHORIZED)
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorizationHeader = request.headers['authorization'];
    if (typeof authorizationHeader === 'string') {
      const [type, token] = authorizationHeader.split(' ');
      return type === 'Bearer' ? token : undefined;
    }
    return undefined;
  }
}
