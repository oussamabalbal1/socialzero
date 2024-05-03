import { HttpException, HttpStatus, Injectable, Query, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from './DTO/createUserDTO';
import { User } from './ENTITIES/user.entity';
import { Between, FindOptionsRelations, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UUIDDTO } from './DTO/IdDTO';
import { PartialUpdateUserDTO } from './DTO/partialUpdateUserDTO';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userrepository:Repository<User>){}

    //Create new user
    async createOneUser(user:CreateUserDTO):Promise<User>{
        //before adding a user first check if exist another user with the same email
        const email:string=user.email
        //try to find user by email
        const user_if_exist= await this.userrepository.findOneBy({email})
        //if there is a user with the email throw an exception
        //else store the user in the data base the return it
        if (user_if_exist){
            throw new HttpException(`User already exists.`,HttpStatus.FOUND)
        }
        const createdAt = new Date()
        const updatedAt = new Date()
        //storing password in hashing format instead of plain text
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(user.password,salt)
        const user_data = this.userrepository.create({...user,password:hashedPassword,createdAt,updatedAt})
        return this.userrepository.save(user_data);
    }


    //get one user by id
    async getOneUser(params:UUIDDTO,userRelations?:FindOptionsRelations<User>): Promise<User>{
        //userRelations is optional
        //if a client provided a value for userRelations use it, if not use : {postes:true,adminIn:true,memberIn:true}
        //params = { uuid: 'f6e4b01d-745a-4cda-8d32-1385a255fe1e' }
        const userId:string=params.uuid
        const user_data= await this.userrepository.findOne({where:{id:userId},relations:userRelations?userRelations:{postes:true,adminIn:true,memberIn:true}})
        if(!user_data){
            throw new HttpException(`User not found.`,HttpStatus.NOT_FOUND)
        }
        return user_data;
    
    }

    //use this method on AuthService
    async getOneUserByEmail(email:string): Promise<User>{
        const user_data= await this.userrepository.findOne({where:{email},relations:{postes:false,adminIn:false,memberIn:false}})
        if(!user_data){
            throw new HttpException(`User not found.`,HttpStatus.NOT_FOUND)
        }
        return user_data;
    }


    async getAllUsers():Promise<User[]>{
        return await this.userrepository.find(
            {relations:{postes:false,adminIn:false,memberIn:false}
        });
    }

    



    //Update a user infromation
    async updateUserById(params:UUIDDTO,partialUser:PartialUpdateUserDTO):Promise<User>{

        //first we need to find user that match with the ID that provide by client
        const user:User=await this.getOneUser(params)
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
    
    async deleteUserById(userParamsUUID:UUIDDTO){
        const user:User=await this.getOneUser(userParamsUUID)
        return await this.userrepository.remove(user)
        //return await this.userrepository.delete({id:userId})

    }


}
