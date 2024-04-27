import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './ENTITIES/group.entity';
import { Like, Repository } from 'typeorm';
import { CreateGroupDTO } from './DTO/createGroupDTO';
import { CreatePostDTO } from 'src/post/DTO/createPostDTO';
import { Location, Post } from 'src/post/ENTITIES/post.entity';
import { User } from 'src/user/ENTITIES/user.entity';
import { UUIDDTO } from 'src/user/DTO/IdDTO';
import { UserService } from 'src/user/user.service';
import { PostService } from 'src/post/post.service';

@Injectable()
export class GroupService {
    constructor(
        @InjectRepository(Group) private readonly grouprepository:Repository<Group>,
        private readonly userservice:UserService,
        private readonly postservice:PostService
){}

    //create new group
    //user should be authonticated
    //user who created the group will be the owner of the group
    //new group has no post, and only one member which is the owner
    async createOne(group:CreateGroupDTO,userParamsUUID:UUIDDTO):Promise<Group>{
        //find the owner
        const owner:User= await this.userservice.getOneUser(userParamsUUID)
        const createdAt = new Date()
        const updatedAt = new Date()
        //// to tssociate the post with the user, we should add property user
        const group_data = this.grouprepository.create({...group,createdAt,updatedAt,admin:owner,members:[owner],postes:[]})
        return this.grouprepository.save(group_data);
    }
    //delete an existing group
    async deleteOne(params:UUIDDTO){
        const groupId:string=params.uuid
        //check first if group is exist
        const group:Group=await this.grouprepository.findOneBy({id:groupId})
        if(!group){
            throw new HttpException(`Group you want to delete not found`,HttpStatus.NOT_ACCEPTABLE)
        }
        //remove the group
        return await this.grouprepository.remove(group)

    }
    //list a group
    async listOne(params:UUIDDTO):Promise<Group>{
        const groupId:string=params.uuid
        //check first if group is exist
        //relation : relations:{owner:true,postes:true,members:true}
        //selecting only fullname from owner and id
        const group:Group=await this.grouprepository.findOne({where:{id:groupId},relations:{admin:true,postes:true,members:true},select:{admin:{fullname:true,id:true}}})
        if(!group){
            throw new HttpException(`Group not found`,HttpStatus.NOT_FOUND)
        }
        return group
    }

    async listAllGroups():Promise<Group[]>{
        const groups_data = await this.grouprepository.find({relations:{admin:true,postes:true,members:true}})
        return groups_data
    }
    async listOwnedGroupsByUser(userParamsUUID:UUIDDTO):Promise<Group[]>{
        //find user
        const user:User= await this.userservice.getOneUser(userParamsUUID)
        //find list of groups that match user
        const groups_data = await this.grouprepository.find({
            where:{admin:user},
            relations:{admin:true,members:true,postes:true}
            })
        return groups_data
    }


    //create a post inside a group 
    async createPost(userParamsUUID:UUIDDTO,groupParamsUUID:UUIDDTO,post:CreatePostDTO){
        //find the group
        const group:Group=await this.listOne(groupParamsUUID)
        const post_data:Post=await this.postservice.createOnePost(userParamsUUID,post,Location.Group)
        console.log(group)
        group.postes.push(post_data)
        return this.grouprepository.save(group);
    }

    async addUser(userParamsUUID:UUIDDTO,groupParamsUUID:UUIDDTO){
        const groupId:string=groupParamsUUID.uuid
        //find group
        const group:Group= await this.grouprepository.findOne({relations:{members:true},where:{id:groupId}})
        //find user
        const user:User = await this.userservice.getOneUser(userParamsUUID)
        //before adding a user to a group we should verify there is no user with the same id
        const isThere = group.members.find((user) => user.id == userParamsUUID.uuid);
        if(isThere){
            throw new HttpException(`User Already Exist`,HttpStatus.NOT_ACCEPTABLE)
        }
        //add user to group
        group.members.push(user)
        //update group on database
        return await this.grouprepository.save(group)


    }

    async deleteUser(groupId:string,userId:string):Promise<Group>{
        //find group
        //this will return the entire group information
        const group:Group= await this.grouprepository.findOne({relations:{members:true},where:{id:groupId}})

        //this will return group with one member that match the userId
        //i would like to use this to  check the user that i want to delete it exist in the group or not 
        //if count is greater than 0 (entity found)
        
        //before deleting a user from a group we should verify is that user is a member of this group
        const ifMemberFoundInTheGroup= await this.grouprepository.count({relations:{members:true},where:{members:{id:userId}}})
        if (ifMemberFoundInTheGroup==0){
            throw new HttpException(`User is not a member of the group`,HttpStatus.NOT_ACCEPTABLE)
        }

        //deletin user
        group.members=group.members.filter((user) => user.id !== userId);
        
        return await this.grouprepository.save(group)

    }
}

