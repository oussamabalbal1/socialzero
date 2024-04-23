import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDTO } from './DTO/createGroupDTO';
import { UUIDDTO } from 'src/user/DTO/IdDTO';
import { CreatePostDTO } from 'src/post/DTO/createPostDTO';
import { constants } from 'buffer';
import { stringify } from 'querystring';

@Controller('group')
export class GroupController {
    constructor (private readonly groupservice:GroupService){};


    //create a group and be owner of it 
    //user should be authenticated - I am using middleware to extract user ID from token
    @Post()
    createGroup(@Body() group:CreateGroupDTO,@Req() req:Request){
        const userId:string=req["idFromToken"]
        return this.groupservice.create(group,userId)
    }
    @Get()
    listAllGroups(){
        const groups= this.groupservice.listAllGroups()
        return groups
    }

    @Post(':uuid/post')
    createPost(@Body() post:CreatePostDTO,@Param() params: UUIDDTO,@Req() req:Request){
        //using middleware to extract user id from token
        const userId:string=req["idFromToken"]
        const groupId:string=params.uuid;
        return this.groupservice.createPost(userId,groupId,post)
    }
    //this route will add new user to the group(should provide group id in the link )
    @Post(':uuid/user')
    addUser(@Param() params: UUIDDTO,@Req() req:Request){
        const groupId:string=params.uuid;
        const userId:string=req["idFromToken"]
        return this.groupservice.addUser(userId,groupId)
    }
    //this function will delete an existing user into the group (should provide group id the link)
    @Delete(':uuid/user')
        deleteUser(@Param() params:UUIDDTO,@Req() req:Request ){
            const groupId:string=params.uuid;
            const userId:string=req["idFromToken"]
            return this.groupservice.deleteUser(groupId,userId)

        }
    
    @Get('user')
    listOwnedGroupsByUser(@Req() req:Request){
        const ownerId:string=req["idFromToken"]
        const groupsData= this.groupservice.listOwnedGroupsByUser(ownerId)
        return groupsData
    }




}
