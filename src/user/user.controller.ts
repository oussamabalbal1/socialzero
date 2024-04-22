import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards ,} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './DTO/createUserDTO';
import { GetQueryDTO } from './DTO/getQueryDTO';
import { AuthGuard } from 'src/auth/auth.guard';
import { UUIDDTO } from './DTO/IdDTO';
import { PartialUpdateUserDTO } from './DTO/partialUpdateUserDTO';

@Controller('user')
export class UserController {
    constructor (private readonly userservice:UserService){};


    //user should have a valid token on his header so he can access to this route
    @UseGuards(AuthGuard)
    @Get()  
    getUsers(){
        return this.userservice.getAllUsers();
    }

    @Post()
    createOneUser(@Body() user:CreateUserDTO){
        return this.userservice.createUser(user)
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

    //user must be authenticated
    //uuid must matching token that mean user get his data only: NOT HANDLED YET
    @UseGuards(AuthGuard)
    @Get(':uuid')
    //we should validate if user is provided a valid uuid or not by DTO
    getOneUserById(@Param() params: UUIDDTO){
        return this.userservice.getOneUser(params)
    }

    //user must be authenticated
   
    

    //user must be authenticated
    //uuid must matching token that mean user can update his data only: NOT HANDLED YET
    // @UseGuards(AuthGuard)
    @Patch(':uuid')
    //using UpdateUserDTO to validate inpute data sent by client
    updateUserById(@Param() params: UUIDDTO,@Body() partialUser:PartialUpdateUserDTO){
        return this.userservice.updateUserById(params,partialUser)
    }
    //user must be authenticated
    //uuid must matching token that mean user can delete his data only: NOT HANDLED YET
    // @UseGuards(AuthGuard)
    @Delete(':uuid')
    deleteUserById(@Param() params: UUIDDTO){
        return this.userservice.deleteUserById(params)
    }

}
