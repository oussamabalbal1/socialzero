//we will use this class to validate data that users sent to use to create a student
//of course we do not need id because we will create that automatically

import {IsEmail, IsEnum, IsOptional, IsString, Matches, MinLength, } from "class-validator";
import { Role } from "src/auth/DECORATORS/role/interface";

//we need to validate  oonly data that user sent to us
export class CreateUserDTO {

    @IsString()
    @MinLength(5)
    readonly fullname: string;
    @IsEmail()
    readonly email: string;
    @IsString()
    // @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    //     message: 'Password must be strong.'
    //   })
    @MinLength(8)
    readonly password:string;

    @IsOptional()
    @IsEnum(Role)
    readonly role: Role;


}
