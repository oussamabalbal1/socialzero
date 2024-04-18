import {IsEmail, IsString } from 'class-validator';
export class SigninUserDTO {
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;
}