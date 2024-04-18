import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //access properties and data of the incoming HTTP request, such as headers, query parameters, request body, etc
    const request = context.switchToHttp().getRequest();
    //extract token
    //this is my way but if user not provided a token, server will crash
    // const token = request.headers.authorization.replace('Bearer ', '')
    //another way to extract token found on nest js docs
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new HttpException(`You have not provided a token`,HttpStatus.UNAUTHORIZED)
    }
    // do not need secrete here to decode the token because you specefied the secret globally inside app module
    try {
      //if when we trying to decode token if token was invalid jwt service will throw an error
      const decoded = this.jwtService.verify(token);
      console.log("inside auth gaurd")
      console.log(decoded)
      return true;
    } catch (error) {
      throw new HttpException(`Token incorrect`,HttpStatus.UNAUTHORIZED)
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

