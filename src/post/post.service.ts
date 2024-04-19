import { Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './ENTITIES/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDTO } from './DTO/createPostDTO';
import { User } from 'src/user/ENTITIES/user.entity';

@Injectable()
export class PostService {
    //note: Post is entity not decorator from @nestjs/common
    constructor(
        @InjectRepository(Post) private readonly postrepository:Repository<Post>,
        @InjectRepository(User) private readonly userrepository:Repository<User>
){}
    


    // create one post
    async createOnePost(email:string,post:CreatePostDTO){
        const user = await this.userrepository.findOneBy({email})
        const createdAt = new Date()
        const updatedAt = new Date()
        //// to tssociate the post with the user, we should add property user
        const user_data = this.postrepository.create({...post,createdAt,updatedAt,user})
        return this.postrepository.save(user_data);
    }
    //list all postes
    async listAllPostes(){
        return await this.postrepository.find({relations:{user:true}})
    }
}
