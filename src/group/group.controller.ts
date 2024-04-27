import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDTO } from './DTO/createGroupDTO';
import { UUIDDTO } from 'src/user/DTO/IdDTO';
import { CreatePostDTO } from 'src/post/DTO/createPostDTO';
import { constants } from 'buffer';
import { stringify } from 'querystring';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('group')
export class GroupController {
    constructor (private readonly groupservice:GroupService){};


    //create a group and be owner of it 
    //user should be authenticated - I am using middleware to extract user ID from token
    @Post()
    createGroup(@Body() group:CreateGroupDTO,@Req() req:Request){
        const userParamsUUID:UUIDDTO=req["params_custom"]
        const userId:string=req["idFromToken"]
        return this.groupservice.createOne(group,userParamsUUID)
    }
    //delete an existing group using group id
    @Delete(':uuid')
    deleteGroup(@Param() params: UUIDDTO){
        return this.groupservice.deleteOne(params)
    }
    //list one group using group id
    @Get(':uuid')
    listGroup(@Param() params: UUIDDTO){
        return this.groupservice.listOne(params)
    }
    @Get()
    listAllGroups(){
        const groups= this.groupservice.listAllGroups()
        return groups
    }

    @UseGuards(AuthGuard)
    @Post(':uuid/post')
    createPost(@Body() post:CreatePostDTO,@Param() params: UUIDDTO,@Req() req:Request){
        const userParamsUUID:UUIDDTO=req["params_custom"]
        const groupId:string=params.uuid;
        return this.groupservice.createPost(userParamsUUID,groupId,post)
    }
    //this route will add new user to the group(should provide group id in the link )
    @Post(':uuid/user')
    addUser(@Param() params: UUIDDTO,@Req() req:Request){
        const groupId:string=params.uuid;
        const userParamsUUID:UUIDDTO=req["params_custom"]
        return this.groupservice.addUser(userParamsUUID,groupId)
    }
    //this function will delete an existing user into the group (should provide group id the link)
    @Delete(':uuid/user')
        deleteUser(@Param() params:UUIDDTO,@Req() req:Request ){
            const groupId:string=params.uuid;
            const userParamsUUID:UUIDDTO=req["params_custom"]
            return this.groupservice.deleteUser(groupId,userParamsUUID.uuid)

        }
    
    @Get('user')
    listOwnedGroupsByUser(@Req() req:Request){
        const userParamsUUID:UUIDDTO=req["params_custom"]
        const groupsData= this.groupservice.listOwnedGroupsByUser(userParamsUUID)
        return groupsData
    }




}
