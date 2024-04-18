import {IsEmail, IsString, } from "class-validator";

export class UpdateUserDTO {

    @IsString()
    readonly fullname: string;
    @IsEmail()
    readonly email: string;
    @IsString()
    readonly password:string;

}
