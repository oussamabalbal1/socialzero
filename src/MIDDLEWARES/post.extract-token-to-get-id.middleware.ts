import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';



//the main goal of this middleware is getting access to token and decode it get retrieve userId
//this method make it easy for me to getting access to id based on token instead to embad it with link
@Injectable()
export class PostExtractTokenToGetIdMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  use(req: any, res: any, next: () => void) {
    console.log("inside middleware..")
    //getting access to token
    // const token:string=req.headers['authorization'].replace('Bearer ', '')
    const token = this.extractTokenFromHeader(req);
    //if there is not token throw error
    if (!token) {
      throw new HttpException(`Access token is missing. Please provide an access token.`,HttpStatus.UNAUTHORIZED)
    }

    try {
      // do not need secrete here to decode the token because you specefied the secret globally inside app module
      //if when we trying to decode token if token was invalid jwt service will throw an error
      const decoded = this.jwtService.verify(token);
      const params_custom= { uuid:decoded.id }
      req.params_custom = params_custom

  
     
    } catch (error) {
      throw new HttpException(`Invalid token. Please provide a valid access token.`,HttpStatus.UNAUTHORIZED)
    }
    next();
    
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
