import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards ,} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './DTO/createUserDTO';
import { GetQueryDTO } from './DTO/getQueryDTO';
import { AuthGuard } from 'src/auth/auth.guard';
import { UUIDDTO } from './DTO/IdDTO';
import { PartialUpdateUserDTO } from './DTO/partialUpdateUserDTO';
import { Roles } from 'src/auth/DECORATORS/role/role.decorator';
import { Role } from 'src/auth/DECORATORS/role/interface';
import { AuthRoleGuard } from 'src/auth/auth.role.guard';

@Controller('user')
export class UserController {
    constructor (private readonly userservice:UserService){};

    //create a new user
    @Post()
    createOneUser(@Body() user:CreateUserDTO){
        return this.userservice.createOneUser(user)
    }
    //ANY USER CAN GET/PATCH/DELETE HIS INFORMATION
    //NA= NOT AN ADMIN
    @UseGuards(AuthGuard)
    @Get()
    getOneUserNA(@Req() req:Request){
        const userParamsUUID:UUIDDTO=req["params_custom"]
        return this.userservice.getOneUser(userParamsUUID)
    }

    @UseGuards(AuthGuard)
    @Patch()
    updateUserByIdNA(@Body() partialUser:PartialUpdateUserDTO,@Req() req:Request){
        const userParamsUUID:UUIDDTO=req["params_custom"]
        return this.userservice.updateUserById(userParamsUUID,partialUser)
    }

    @UseGuards(AuthGuard)
    @Delete()
    deleteUserByIdNA(@Req() req:Request){
        const userParamsUUID:UUIDDTO=req["params_custom"]
        return this.userservice.deleteUserById(userParamsUUID)
    }




    //ONLY ADMIN CAN ACCESS TO THIS ROUTES
    //ONLY ADMIN CAN GET/PATCH/DELETE ANY USER JUST BY ID
    @UseGuards(AuthRoleGuard)
    @Roles(Role.Admin)
    @Get('admin/:uuid')
    getOneUser(@Param() userParamsUUID: UUIDDTO){
        return this.userservice.getOneUser(userParamsUUID)
    }
    @UseGuards(AuthRoleGuard)
    @Roles(Role.Admin)
    @Patch('admin/:uuid')
    updateUserById(@Param() userParamsUUID: UUIDDTO,@Body() partialUser:PartialUpdateUserDTO){
        return this.userservice.updateUserById(userParamsUUID,partialUser)
    }
    @UseGuards(AuthRoleGuard)
    @Roles(Role.Admin)
    @Delete('admin/:uuid')
    deleteUserById(@Param() userParamsUUID: UUIDDTO){
        return this.userservice.deleteUserById(userParamsUUID)
    }

    @UseGuards(AuthGuard,AuthRoleGuard)
    @Roles(Role.Admin)
    @Get('admin/')  
    getAllUsers(){
        console.log('inside user/admin route')
        return this.userservice.getAllUsers();
    }









}
