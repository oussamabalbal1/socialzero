import { HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './ENTITIES/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDTO } from './DTO/createPostDTO';
import { User } from 'src/user/ENTITIES/user.entity';
import { PostGetTokenCustomDeco } from 'src/DECORATORS/post.get-token-custom-deco.decorator';
import { UUIDDTO } from 'src/user/DTO/IdDTO';

@Injectable()
export class PostService {
    //note: Post is entity not decorator from @nestjs/common
    constructor(
        @InjectRepository(Post) private readonly postrepository:Repository<Post>,
        @InjectRepository(User) private readonly userrepository:Repository<User>
){}
    


    // create one post
    async createOnePost(userId:string,post:CreatePostDTO){


            //method one : fisrt find user, then create new post related to it 
                //const user = await this.userrepository.findOneBy({email})
                //const user_data = this.postrepository.create({...post,createdAt,updatedAt,user})
            //method two : using userId directly (you need to rewrite userId collumn on post entity first)

        //using method two (you can use both methods in our case)
        //creating new post associated to userId
        const createdAt = new Date()
        const updatedAt = new Date()
        //// to tssociate the post with the user, we should add property user
        const user_data = this.postrepository.create({...post,createdAt,updatedAt,userId})
        return this.postrepository.save(user_data);
    }
    //list all postes
    async listAllPostes(){
        return await this.postrepository.find({relations:{user:true}})
    }

    async listOnePostById(params:UUIDDTO){
        
            const user_data= await this.postrepository.findOneBy({id:params.uuid})
            if (!user_data){
                throw new HttpException(`Invalid id. Please provide a valid id.`,HttpStatus.NOT_FOUND)
            }
            return user_data;
     
    }

    async listPostsByUserId(id:string){
        const userId=id
        try {
            const user_data= await this.postrepository.find({where:{userId}})
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
