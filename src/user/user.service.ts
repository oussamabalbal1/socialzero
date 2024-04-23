import { HttpException, HttpStatus, Injectable, Query, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from './DTO/createUserDTO';
import { User } from './ENTITIES/user.entity';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UUIDDTO } from './DTO/IdDTO';
import { PartialUpdateUserDTO } from './DTO/partialUpdateUserDTO';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userrepository:Repository<User>){}

    //Get one user By id - input:ID output:User
    //example : http://localhost:3000/user/4
    async getOneUser(params:UUIDDTO): Promise<User>{
        const userId:string=params.uuid
        const user_data= await this.userrepository.findOneBy({id:userId})
        console.log(user_data)
        if(!user_data){
            throw new HttpException(`No user with this ID`,HttpStatus.NOT_FOUND)
        }
        return user_data;
    
    }

    //Get all users - input:nothing output:Array of Users
    async getAllUsers():Promise<User[]>{
        return await this.userrepository.find(
            //use relations so will return another -postes- property with user object
            {relations:{postes:true,groups:true,memberIn:true}
        });
    }

    

    //Create new user - input:User(without id) output:User(with id)
    //hash password before storing it in database
    async createUser(user:CreateUserDTO):Promise<User>{
        //before adding a user first check if exist another user with the same email
        const email:string=user.email
        //try to find user by email
        const user_if_exist= await this.userrepository.findOneBy({email})
        //if there is a user with the email throw an exception
        //else store the user in the data base the return it
        if (user_if_exist){
            throw new HttpException(`${user.email} already exist`,HttpStatus.FOUND)
        }
        const createdAt = new Date()
        const updatedAt = new Date()
        //storing password in hashing format instead of plain text
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(user.password,salt)

        const user_data = this.userrepository.create({...user,password:hashedPassword,createdAt,updatedAt})
        return this.userrepository.save(user_data);
    }

    //Update a user infromation based in his id - input:id of user you want to update + User(without id) output:old User + new User (with id)
    //hash password before storing it in database
    async updateUserById(params:UUIDDTO,partialUser:PartialUpdateUserDTO):Promise<User>{
        const userId:string=params.uuid
        //first we need to find user that match with the ID that provide by client
        const user:User= await this.userrepository.findOneBy({id:userId})
        //update only provided properties
        Object.assign(user, partialUser);
        const updatedAt = new Date()
        user.updatedAt=updatedAt
        const salt = await bcrypt.genSalt()
        if(partialUser.password!==undefined){
            //hashing the password before save the object in database
            user.password=await bcrypt.hash(user.password,salt)
        }
        return this.userrepository.save(user)

    }
    async deleteUserById(params:UUIDDTO){
        const userId:string=params.uuid
        //first check if the id provided by client match any user
        const user_if_exist= await this.userrepository.findOneBy({id:userId})
        //if not exist thrwo an exception
        if(!user_if_exist){
            throw new HttpException(`User not found`,HttpStatus.NOT_FOUND)
        }
        //else delete the user information

        return await this.userrepository.remove(user_if_exist)
        //return await this.userrepository.delete({id:userId})


    }


}
