import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards ,} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './DTO/createUserDTO';
import { GetQueryDTO } from './DTO/getQueryDTO';
import { AuthGuard } from 'src/auth/auth.guard';
import { UUIDDTO } from './DTO/IdDTO';
import { PartialUpdateUserDTO } from './DTO/partialUpdateUserDTO';
import { Roles } from 'src/auth/DECORATORS/role/role.decorator';
import { Role } from 'src/auth/DECORATORS/role/interface';

@Controller('user')
export class UserController {
    constructor (private readonly userservice:UserService){};


    @Post()
    createOneUser(@Body() user:CreateUserDTO){
        return this.userservice.createOneUser(user)
    }

    @UseGuards(AuthGuard)
    @Get(':uuid')
    getOneUser(@Param() params: UUIDDTO,@Req() req:Request){
        console.log(req["params_custom"])
        return this.userservice.getOneUser(params)
    }

    @UseGuards(AuthGuard)
    @Patch(':uuid')
    updateUserById(@Param() params: UUIDDTO,@Body() partialUser:PartialUpdateUserDTO){
        return this.userservice.updateUserById(params,partialUser)
    }

    //user should be authenticated
    @UseGuards(AuthGuard)
    @Get()  
    getAllUsers(){
        return this.userservice.getAllUsers();
    }







    @UseGuards(AuthGuard)
    @Delete(':uuid')
    deleteUserById(@Param() params: UUIDDTO){
        return this.userservice.deleteUserById(params)
    }

}
