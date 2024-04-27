import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';




@Injectable()
//the main purpose of this guard is to check if the user is authonticated and store user id on req.params_custom
//verify if token is valid, if yes decode it and store user id without checking database
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService,private readonly userservice:UserService) {}
  async canActivate(
    context: ExecutionContext,
  ):Promise<boolean>{
    console.log("inside authentication guard..")
    //access properties and data of the incoming HTTP request, such as headers, query parameters, request body, etc
    const request = context.switchToHttp().getRequest();
    //extract token and check it 
    const token = this.extractTokenFromHeader(request);
    //if there is not token throw an error
    if (!token) {
      throw new HttpException(`Access token is missing. Please provide an access token.`,HttpStatus.UNAUTHORIZED)
    }
    try {
      // do not need secrete here to decode the token because you specefied the secret globally inside app module
      // if Token is invalid, JWT will throw an error
      const decoded = await this.jwtService.verify(token); 
      const params_custom= { uuid:decoded.id }
      //i found on nest docs that can assigning data to the request object
      //so that we can access to the data in any route handler using this guard
      request["params_custom"] = params_custom
      console.log("End authentication guard..")
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

