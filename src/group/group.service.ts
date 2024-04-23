import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './ENTITIES/group.entity';
import { Like, Repository } from 'typeorm';
import { CreateGroupDTO } from './DTO/createGroupDTO';
import { CreatePostDTO } from 'src/post/DTO/createPostDTO';
import { Location, Post } from 'src/post/ENTITIES/post.entity';
import { User } from 'src/user/ENTITIES/user.entity';

@Injectable()
export class GroupService {
    constructor(
        @InjectRepository(Group) private readonly grouprepository:Repository<Group>,
        @InjectRepository(Post) private readonly postrepository:Repository<Post>,
        @InjectRepository(User) private readonly userrepository:Repository<User>
){}
    async create(group:CreateGroupDTO,ownerId:string):Promise<Group>{
        //find the owner
        const owner:User= await this.userrepository.findOneBy({id:ownerId})
        const createdAt = new Date()
        const updatedAt = new Date()
        //// to tssociate the post with the user, we should add property user
        const group_data = this.grouprepository.create({...group,createdAt,updatedAt,owner:owner,members:[owner],postes:[]})
        return this.grouprepository.save(group_data);
    }
    async listAllGroups():Promise<Group[]>{
        const groups_data = await this.grouprepository.find({relations:{owner:true,postes:true,members:true}})
        return groups_data
    }
    async listOwnedGroupsByUser(ownerId:string):Promise<Group[]>{
        //find user
        const user:User= await this.userrepository.findOneBy({id:ownerId})
        //find list of groups that match user
        const groups_data = await this.grouprepository.find({
            where:{owner:user},
            relations:{owner:true,members:true,postes:true}
            })
        return groups_data
    }

    async createPost(userId:string,groupId:string,post:CreatePostDTO){
        const createdAt = new Date()
        const updatedAt = new Date()
        //find the user
        const user:User=await this.userrepository.findOneBy({id:userId})
        //find the group
        const group:Group=await this.grouprepository.findOneBy({id:groupId})
        
        const post_data = await this.postrepository.create({...post,createdAt,updatedAt,user:user,group:group,source:Location.Group})
        return this.postrepository.save(post_data);
    }
    async addUser(userId:string,groupId:string){
        //find group
        const group:Group= await this.grouprepository.findOne({relations:{members:true},where:{id:groupId}})
        //find user
        const user:User = await this.userrepository.findOneBy({id:userId})
        //before adding a user to a group we should verify there is no user with the same id
        const isThere = group.members.find((user) => user.id == userId);
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
