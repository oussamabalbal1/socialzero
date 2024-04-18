import { HttpException, HttpStatus, Injectable, Query } from '@nestjs/common';
import { CreateUserDTO } from './DTO/createUserDTO';
import { User } from './ENTITIES/user.entity';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDTO } from './DTO/updateUserDTO';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userrepository:Repository<User>){}

    //Get one user By id - input:ID output:User
    //example : http://localhost:3000/user/4
    async getOneUser(id:number){
        const user_data= await this.userrepository.findOneBy({id})
        return user_data;
    }

    //Get range of users based on query provided by client- input:query object output:Array of Users
    //example : localhost:3000/user?query_data={us=13}
    async getRangeOfUsers(start:number,end:number):Promise<User[]>{
        //find range of users where id is between start and end 
        const user_data=await this.userrepository.find({
            where:{
                id: Between(start, end)
            }})
        return user_data

    }

    //Get all users - input:nothing output:Array of Users
    async getAllUsers():Promise<User[]>{
        return await this.userrepository.find();
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
            throw new HttpException(`${user.fullname} already exist`,HttpStatus.FOUND)
        }
        const user_data = this.userrepository.create(user)
        return this,this.userrepository.save(user_data);
    }

    //Update a user infromation based in his id - input:id of user you want to update + User(without id) output:old User + new User (with id)
    //hash password before storing it in database
    async updateUserById(id:number,user:UpdateUserDTO){
        //first we need to find user that match with the ID that provide by client
        const user_if_exist= await this.userrepository.findOneBy({id})
        //if not find user by id throw and exception
        if(!user_if_exist){
            throw new HttpException(`User not found`,HttpStatus.NOT_FOUND)
        }
        //create an object of a user with his id
        const user_to_update:User={id,...user}
        //if old information of that user = new information client want to update throw and exception
        //else update the user information
        if(user_if_exist.email==user_to_update.email && user_if_exist.fullname==user_to_update.fullname){
            throw new HttpException(`User Already updated`,HttpStatus.NOT_ACCEPTABLE)
        }
        const user_data=this.userrepository.update(id,user)
    
        const data ={
            oldUserData:user_if_exist,
            newUserData:{id,...user}
        }
        return data

    }
    async deleteUserById(id:number){
        //first check if the id provided by client match any user
        const user_if_exist= await this.userrepository.findOneBy({id})
        //if not exist thrwo an exception
        if(!user_if_exist){
            throw new HttpException(`User not found`,HttpStatus.NOT_FOUND)
        }
        //else delete the user information
        return await this.userrepository.delete(id)


    }


}
