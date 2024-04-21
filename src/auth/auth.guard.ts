import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/ENTITIES/user.entity';
import { UserService } from 'src/user/user.service';
import { UUIDDTO } from 'src/user/DTO/IdDTO';



@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService,@InjectRepository(User) private readonly userrepository:Repository<User>) {}
  async canActivate(
    context: ExecutionContext,
  ):Promise<boolean>{
    //the main purpose of this guard this to check if the user is authonticated or not 
    // by checking token -> decode it -> check if that token related to any user in database
    console.log("inside authentication gaurd..")
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
      const decoded = this.jwtService.verify(token); 
      const id:string=decoded.id
      //chekc if user is stored in database
      const user=await this.userrepository.findOneBy({id});
      //if we can not find the user with that id throw an erro
      if(!user){
        throw new UnauthorizedException();
      }
      console.log("The user is authorized to perform this activity.")
      return true;
    } catch (error) {
      // handle JWT verification errors
      throw new HttpException(`Invalid token. Please provide a valid access token.`,HttpStatus.UNAUTHORIZED)
    }

  
    
    // catch (error) {
    //   throw new HttpException(`Token incorrect`,HttpStatus.UNAUTHORIZED)
    // }
    //extract user information by id


   
  

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

