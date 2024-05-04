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
import { Role } from 'src/auth/DECORATORS/role/interface';

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
    async deleteOne(groupParamsUUID:UUIDDTO,userParamsUUID:UUIDDTO,userRole:Role){
        const groupId:string=groupParamsUUID.uuid
        const userId:string=userParamsUUID.uuid
        //this case: role user but admin of the group can delete the group
        if(userRole=='user'){
            const group:Group=await this.grouprepository.findOne({where:{id:groupId,admin:{id:userId}}})
            if(!group){
                throw new HttpException('Group do not found or you do not have permission to delete this group',HttpStatus.UNAUTHORIZED)
            }
            return await this.grouprepository.remove(group)
        }
        //this case: role admin can delete the group 
        if(userRole=='admin'){
            const group:Group=await this.grouprepository.findOneBy({id:groupId})
            if(!group){
                throw new HttpException(`Group not found`,HttpStatus.NOT_ACCEPTABLE)
            }
            //remove the group
            return await this.grouprepository.remove(group)
        }


    }
    //list a group
    async listOne(groupParamsUUID:UUIDDTO):Promise<Group>{
        const groupId:string=groupParamsUUID.uuid
        const group:Group=await this.grouprepository.findOne({where:{id:groupId},relations:{admin:true,postes:true,members:true},select:{admin:{fullname:true,id:true}}})
        if(!group){
            throw new HttpException(`Group not found`,HttpStatus.NOT_FOUND)
        }
        return group
    }

    async listAllGroups():Promise<Group[]>{
        const groups_data = await this.grouprepository.find({relations:{admin:true,postes:true,members:true},select:{admin:{email:true,fullname:true},members:{fullname:true,email:true}}})
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
        if(!group){
            throw new HttpException(`Group not found.`,HttpStatus.NOT_FOUND)
        }
        //find user
        const user:User = await this.userservice.getOneUser(userParamsUUID)
        //before adding a user to a group we should verify there is no user with the same id
        const isThere = group.members.find((user) => user.id == userParamsUUID.uuid);
        if(isThere){
            throw new HttpException(`User is a mumber of this group.`,HttpStatus.NOT_ACCEPTABLE)
        }
        //add user to group
        group.members.push(user)
        //update group on database
        return await this.grouprepository.save(group)


    }
    //not implemented yet ..
    //it removing evry thing not only one user
    //the problem is in findone function it return only the member that match the search option 
    async deleteUser(groupParamsUUID:UUIDDTO,userParamsUUID:UUIDDTO):Promise<Group>{
        //find group
        //this will return the entire group information

        console.log('run this route..')
        const groupId:string=groupParamsUUID.uuid
        const userId:string=userParamsUUID.uuid
        const group= await this.grouprepository.findOne({where:{id:groupId,members:{id:userId}},relations:{members:true}})
        if(!group){
            throw new HttpException('Group not found or user is not a member of this group.',HttpStatus.NOT_FOUND)
        }
        //deletin user
        console.log(group.id)
        // group.members=group.members.filter(
        //     (user) => {return user.id != userParamsUUID.uuid}
        // );

        // console.log(group.members)

        return 
        // return await this.grouprepository.save(group)

    }
}

