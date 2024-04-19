import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SigninUserDTO } from './DTO/signinUserDTO';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/ENTITIES/user.entity';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

     //we need to import user repository into auth module using type orm
    constructor(@InjectRepository(User) private readonly userrepository:Repository<User>){}




    //check if email and password are correct if okey generate a Token
    async authonticate(usersignindata:SigninUserDTO){
        //first check if the user exists by his email
        const email:string=usersignindata.email
        const user_if_exist = await this.userrepository.findOneBy({email})
        if (!user_if_exist) {
            throw new HttpException(`Invalide credentials`,HttpStatus.NOT_FOUND)
        }
        //check if the possword that provided by client is matching the password that stored in database
        //we have to use bcrypt for that because we hashed the password
        const passwordsMatch:boolean=await bcrypt.compare(usersignindata.password,user_if_exist.password)
        if(!passwordsMatch){
            throw new HttpException(`Password invalide`,HttpStatus.NOT_FOUND)
        }

        //generate token using user infromation (data) + "secrete" string
        //next time when i need to decode the token i need the "secrete", token contain user information
        //i need that information inside the tocken to check if user is authonticated
        const data:any={
            "email":user_if_exist.email,
            "fullname":user_if_exist.fullname,
        }
        const token=sign(data,"secrete")
        // const { password, ...result } = user;
        const data_r={token,user_if_exist}
        return data_r;
      }
}
