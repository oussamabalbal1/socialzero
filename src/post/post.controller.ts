import { Body, Controller, Get, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDTO } from './DTO/createPostDTO';

@Controller('post')
export class PostController {

    constructor (private readonly postservice:PostService){};
    //user should have token on his header so he can access to this route
    @Post()  
    createPost(@Body() post:CreatePostDTO){
        return this.postservice.createOnePost("miral@gmail.com",post);
    }

    //get all post
    @Get()
    getAllPosts(){
        return this.postservice.listAllPostes()
        }

}
