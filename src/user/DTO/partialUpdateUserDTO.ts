import {IsEmail, IsNumber, IsOptional, IsString, Matches, MinLength } from 'class-validator';


export class PartialUpdateUserDTO {
    @IsOptional()
    @IsString()
    @MinLength(10)
    readonly fullname: string;

    @IsOptional()
    @IsEmail()
    readonly email: string;

    @IsOptional()
    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'Password must be strong.'
      })
    readonly password:string;

    /*  
      The regular expression /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ enforces the following criteria:
        At least 8 characters long
        At least one uppercase letter
        At least one lowercase letter
        At least one number
        At least one special character (e.g., @$!%*?&)
    */
}