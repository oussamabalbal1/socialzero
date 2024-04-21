import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDTO } from './DTO/createGroupDTO';

@Controller('group')
export class GroupController {
    constructor (private readonly groupservice:GroupService){};

    @Post('create')
    createOneGroupAndBeOwner(@Body() group:CreateGroupDTO,@Req() req:Request){
        //using middleware to extract user id from token
        const userId:string=req["idFromToken"]
        this.groupservice.createOneGroup(group,userId)
    }
    @Get()
    listAllGroups(){
        const groupsData= this.groupservice.listAllGroups()
        return groupsData
    }
    @Get('user')
    listGroupsThatOwnedByaUser(@Req() req:Request){
        //using middleware to extract user id from token
        const userId:string=req["idFromToken"]
        const groupsData= this.groupservice.listGroupsThatOwnedByaUser(userId)
        return groupsData
    }


}
