import { HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Location, Post } from './ENTITIES/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDTO } from './DTO/createPostDTO';
import { User } from 'src/user/ENTITIES/user.entity';
import { UUIDDTO } from 'src/user/DTO/IdDTO';
import { PartialUpdatePostDTO } from './DTO/partialUpdatePostDTO';
import { UserService } from 'src/user/user.service';
import { Role } from 'src/auth/DECORATORS/role/interface';

@Injectable()
export class PostService {
    constructor(
        private readonly userservice:UserService,
        @InjectRepository(Post) private readonly postrepository:Repository<Post>
){}
    


    // create one post
    async createOnePost(params:UUIDDTO,post:CreatePostDTO,location:Location):Promise<Post>{
        //creating new post associated to userId
        console.log(params)
        const user:User=await this.userservice.getOneUser(params,{postes:false,adminIn:false,memberIn:false})
        const createdAt = new Date()
        const updatedAt = new Date()
        //// to tssociate the post with the user, we should add property user
        const post_data = this.postrepository.create({...post,createdAt,updatedAt,user:user,source:location})
        console.log(post_data)
        return this.postrepository.save(post_data);
    }

    //list all postes
    async listAllPostes(){
        return await this.postrepository.find({relations:{user:true,group:true},select:{user:{fullname:true,id:true}}})
    }


    async listOnePostById(params:UUIDDTO,userId:UUIDDTO,userRole){
        console.log(`user id ${userId.uuid}`)
        console.log(`post id ${params.uuid}`)
        console.log(`user role : ${userRole}`)
            if(userRole=='user'){
                const user_data= await this.postrepository.findOneBy({id:params.uuid,user:{id:userId.uuid}})
                if (!user_data){
                    throw new HttpException(`Invalid id. Please provide a valid id.`,HttpStatus.NOT_FOUND)
                }
                return user_data;
            }
            if(userRole=='admin'){
                const user_data= await this.postrepository.findOneBy({id:params.uuid})
                if (!user_data){
                    throw new HttpException(`Invalid id. Please provide a valid id.`,HttpStatus.NOT_FOUND)
                }
                return user_data;
            }
            
     
    }

    async listPostsByUserId(params:UUIDDTO){
        const user:User=await this.userservice.getOneUser(params)
        try {
            const user_data= await this.postrepository.find({where:{user:user}})
            return user_data;
        } catch (error) {
            throw new HttpException(`Invalide ID`,HttpStatus.NOT_FOUND)
        }
    }

    async deleteOnePostByPostId(postParamsUUID:UUIDDTO,userParamsUUID:UUIDDTO,userRole:Role):Promise<Post>{
        const postId:string=postParamsUUID.uuid
        const userID:string=userParamsUUID.uuid

        //This method is more suitable for scenarios where you want to delete entities based on certain conditions without loading them into memory.
            //repository.delete(entityId);


        //This method is more suitable for scenarios where you need to manipulate or perform additional operations on the entity before deleting it.
            // entityToRemove = await repository.findOne(entityId);
            // repository.remove(entityToRemove);
        if(userRole=='user'){
            const post:Post=await this.postrepository.findOneBy({id:postId,user:{id:userID}})
            if(!post){
                throw new HttpException(`Post not found, Or you do not have permission to delete this post.`,HttpStatus.NOT_FOUND)
            }
            await this.postrepository.remove(post)
            return post
        }
        if (userRole=='admin'){
            const post:Post=await this.postrepository.findOneBy({id:postId})
            if(!post){
                throw new HttpException(`Post not found.`,HttpStatus.NOT_FOUND)
            }
            await this.postrepository.remove(post)
            return post
        }
        //fisrt check the post is exist or not 

    }

    async updatePostById(postParamsUUID:UUIDDTO,partialPost:PartialUpdatePostDTO,userParamsUUID:UUIDDTO,userRole:Role):Promise<Post>{
        const postId:string=postParamsUUID.uuid
        const userID:string=userParamsUUID.uuid

        if (userRole=='admin'){
                    //first we need to find post that match with the ID that provided by client
        const post:Post= await this.postrepository.findOneBy({id:postId})
        if(!post){
            throw new HttpException(`Post not found. Please provide a valid id.`,HttpStatus.NOT_FOUND)
        }
        if(partialPost.description==undefined){
            throw new HttpException(`Nothing to update.`,HttpStatus.NOT_ACCEPTABLE)
        }
        //update only provided properties
        Object.assign(post, partialPost);
        post.updatedAt=new Date()
  
        return this.postrepository.save(post)
        }
        if(userRole=='user'){
                               //first we need to find post that match with the ID that provided by client
        const post:Post= await this.postrepository.findOneBy({id:postId,user:{id:userID}})
        if(!post){
            throw new HttpException(`Post not found, Or you do not have permission to patch this post.`,HttpStatus.NOT_FOUND)
        }
        if(partialPost.description==undefined){
            throw new HttpException(`Nothing to update.`,HttpStatus.NOT_ACCEPTABLE)
        }
        //update only provided properties
        Object.assign(post, partialPost);
        post.updatedAt=new Date()
  
        return this.postrepository.save(post)
        }
        


    }
}
