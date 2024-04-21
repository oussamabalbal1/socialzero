import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './ENTITIES/group.entity';
import { Repository } from 'typeorm';
import { CreateGroupDTO } from './DTO/createGroupDTO';

@Injectable()
export class GroupService {
    constructor(
        @InjectRepository(Group) private readonly grouprepository:Repository<Group>,
){}
    async createOneGroup(group:CreateGroupDTO,ownerId:string){
        const createdAt = new Date()
        const updatedAt = new Date()
        //// to tssociate the post with the user, we should add property user
        const owner_data = this.grouprepository.create({...group,createdAt,updatedAt,ownerId})
        return this.grouprepository.save(owner_data);
    }
    async listAllGroups(){
        const groups_data = this.grouprepository.find({relations:{owner:true}})
        return groups_data
    }
    async listGroupsThatOwnedByaUser(ownerId:string){
        const groups_data = this.grouprepository.find({where:{ownerId},relations:{owner:true}})
        return groups_data
    }
}
