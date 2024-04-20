import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards ,} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './DTO/createUserDTO';
import { GetQueryDTO } from './DTO/getQueryDTO';
import { UpdateUserDTO } from './DTO/updateUserDTO';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
    constructor (private readonly userservice:UserService){};
    //user should have token on his header so he can access to this route
    @UseGuards(AuthGuard)
    @Get()  
    getUsers(){
        return this.userservice.getAllUsers();
    }




    //Get range of users based on query provided by client- input:query object output:Array of Users
    //example : localhost:3000/user/range?start=2&end=4
    

    //to implement this function id should be a number not uuid
    // @Get('range')
    // //using GetQueryDTO to validate inpute data sent by client
    // getRangeOfUsers(@Query() query_data:GetQueryDTO){
    //     //query_data will be an object has start and end
    //     const {start,end}=query_data
    //     return this.userservice.getRangeOfUsers(start,end)
 
    // }

    @Get(':id')
    //using ParseIntPipe pipe to transform input data from string to number
    //we do not use pipes due to id is uuid
    getOneUserById(@Param('id') id: string){
        return this.userservice.getOneUser(id)
    }


    @Post()
    //using CreateUserDTO to validate inpute data sent by client
    createOneUser(@Body() user:CreateUserDTO){
        return this.userservice.createUser(user)
    }


    @Patch(':id')
    //using UpdateUserDTO to validate inpute data sent by client
    updateUserById(@Param('id') id:string,@Body() user:UpdateUserDTO){
        return this.userservice.updateUserById(id,user)
    }

    @Delete(':id')
    deleteUserById(@Param('id') id:string){
        return this.userservice.deleteUserById(id)
    }

}
