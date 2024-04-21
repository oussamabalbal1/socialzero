import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';



//the main goal of this middleware is getting access to token and decode it get retrieve userId
//this method make it easy for me to getting access to id based on token instead to embad it with link
@Injectable()
export class PostExtractTokenToGetIdMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  use(req: any, res: any, next: () => void) {

    try {
      console.log("inside auth middleware..")
      //getting access to token
      const token:string=req.headers['authorization'].replace('Bearer ', '')
      //if there is not token throw error
      if (!token) {
        throw new HttpException(`You have not provided a token`,HttpStatus.UNAUTHORIZED)
      }
      // do not need secrete here to decode the token because you specefied the secret globally inside app module
      //if when we trying to decode token if token was invalid jwt service will throw an error
      const decoded = this.jwtService.verify(token);
      const idFromToken:string=decoded.id
      req.idFromToken= idFromToken
  
     
    } catch (error) {
      throw new HttpException(`Token invalide`,HttpStatus.UNAUTHORIZED)
    }
    next();
    
  }
}
