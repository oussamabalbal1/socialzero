//we will use this class to validate data that users sent to use to create a student
//of course we do not need id because we will create that automatically

import {IsEmail, IsString, } from "class-validator";

//we need to validate  oonly data that user sent to us
export class CreateUserDTO {

    @IsString()
    readonly fullname: string;
    @IsEmail()
    readonly email: string;
    @IsString()
    readonly password:string;

}
