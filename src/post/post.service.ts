import { HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Location, Post } from './ENTITIES/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDTO } from './DTO/createPostDTO';
import { User } from 'src/user/ENTITIES/user.entity';
import { UUIDDTO } from 'src/user/DTO/IdDTO';

@Injectable()
export class PostService {
    //note: Post is entity not decorator from @nestjs/common
    constructor(
        @InjectRepository(Post) private readonly postrepository:Repository<Post>,
        @InjectRepository(User) private readonly userrepository:Repository<User>
){}
    


    // create one post
    async createOnePost(userId:string,post:CreatePostDTO):Promise<Post>{
        //creating new post associated to userId
        const user:User=await this.userrepository.findOneBy({id:userId})
        const createdAt = new Date()
        const updatedAt = new Date()
        //// to tssociate the post with the user, we should add property user
        const post_data = this.postrepository.create({...post,createdAt,updatedAt,user:user,source:Location.Profile})
        console.log(post_data)
        return this.postrepository.save(post_data);
    }
    //list all postes
    async listAllPostes(){
        return await this.postrepository.find({relations:{user:true,group:true}})
    }


    async listOnePostById(params:UUIDDTO){
        
            const user_data= await this.postrepository.findOneBy({id:params.uuid})
            if (!user_data){
                throw new HttpException(`Invalid id. Please provide a valid id.`,HttpStatus.NOT_FOUND)
            }
            return user_data;
     
    }

    async listPostsByUserId(id:string){
        const user:User=await this.userrepository.findOneBy({id:id})
        try {
            const user_data= await this.postrepository.find({where:{user:user}})
            return user_data;
        } catch (error) {
            throw new HttpException(`Invalide ID`,HttpStatus.NOT_FOUND)
        }
    }

    async deleteOnePostByPostId(params:UUIDDTO):Promise<Post>{
        const postId:string=params.uuid
        //fisrt check the post is exist or not 
        const post:Post=await this.postrepository.findOneBy({id:postId})
        if(!post){
            throw new HttpException(`Post not found. Please provide a valid id.`,HttpStatus.NOT_FOUND)
        }
        await this.postrepository.delete({id:postId})
        return post
    }
}
