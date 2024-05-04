import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDTO } from './DTO/createGroupDTO';
import { UUIDDTO } from 'src/user/DTO/IdDTO';
import { CreatePostDTO } from 'src/post/DTO/createPostDTO';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthRoleGuard } from 'src/auth/auth.role.guard';
import { Role } from 'src/auth/DECORATORS/role/interface';
import { Roles } from 'src/auth/DECORATORS/role/role.decorator';

@Controller('group')
export class GroupController {
    constructor (private readonly groupservice:GroupService){};


    //create a group and be owner of it 
    //tested..
    @UseGuards(AuthGuard)
    @Post()
    createGroup(@Body() groupParamsUUID:CreateGroupDTO,@Req() req:Request){
        const userParamsUUID:UUIDDTO=req["params_custom"]
        return this.groupservice.createOne(groupParamsUUID,userParamsUUID)
    }
    //delete an existing group using group id
    //only user that own that group can delete that gourp 
    //only admin can delete any group
    @UseGuards(AuthGuard)
    @Delete(':uuid')
    deleteGroup(@Param() groupParamsUUID: UUIDDTO,@Req() req:Request){
        const userParamsUUID:UUIDDTO=req["params_custom"]
        const userRole=req["params_role"].role
        return this.groupservice.deleteOne(groupParamsUUID,userParamsUUID,userRole)
    }

    //list one group using group id
    @UseGuards(AuthGuard)
    @Get(':uuid')
    listGroup(@Param() groupParamsUUID: UUIDDTO){
        return this.groupservice.listOne(groupParamsUUID)
    }
    @UseGuards(AuthGuard)
    @Get()
    listAllGroups(){
        const groups= this.groupservice.listAllGroups()
        return groups
    }

    @UseGuards(AuthGuard)
    @Post(':uuid/post')
    createPost(@Body() post:CreatePostDTO,@Param() groupParamsUUID: UUIDDTO,@Req() req:Request){
        const userParamsUUID:UUIDDTO=req["params_custom"]
        return this.groupservice.createPost(userParamsUUID,groupParamsUUID,post)
    }
    //this route will add new user to the group(should provide group id in the link )
    @UseGuards(AuthGuard)
    @Post(':uuid/user')
    addUser(@Param() groupParamsUUID: UUIDDTO,@Req() req:Request){
        const userParamsUUID:UUIDDTO=req["params_custom"]
        return this.groupservice.addUser(userParamsUUID,groupParamsUUID)
    }
    //this function will delete an existing user into the group (should provide group id the link)
    @UseGuards(AuthGuard)
    @Delete(':uuid/user')
        deleteUser(@Param() groupParamsUUID:UUIDDTO,@Req() req:Request ){
            const userParamsUUID:UUIDDTO=req["params_custom"]
            return this.groupservice.deleteUser(groupParamsUUID,userParamsUUID)

        }
    @UseGuards(AuthGuard)
    @Get('user')
    listOwnedGroupsByUser(@Req() req:Request){
        const userParamsUUID:UUIDDTO=req["params_custom"]
        const groupsData= this.groupservice.listOwnedGroupsByUser(userParamsUUID)
        return groupsData
    }




}
