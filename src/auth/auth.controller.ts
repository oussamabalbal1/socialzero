import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { SigninUserDTO } from './DTO/signinUserDTO';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor (private readonly authervice:AuthService){};


//user sign in - input : User credential output : all User information with Token
@Get('signin')
singin(@Body() usersignindata:SigninUserDTO){
        return this.authervice.authentication(usersignindata)
    }
@Get('test')
@UseGuards(AuthGuard)
test(){
    console.log("every thing working good..")
    return "every thing working good.."
}
}
