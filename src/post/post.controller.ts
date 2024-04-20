import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDTO } from './DTO/createPostDTO';
import { PostGetTokenCustomDeco } from 'src/DECORATORS/post.get-token-custom-deco.decorator';
import { UserService } from 'src/user/user.service';

@Controller('post')
export class PostController {

    constructor (private readonly postservice:PostService,private readonly userservice:UserService){};
    //using middleware to extract id from headers by decoding it and pass it back inside req
    @Post("create")  
    async createPost(@Body() post:CreatePostDTO,@Req() req:Request){
        const id:string=req["idFromToken"]  
        return this.postservice.createOnePost(id,post);
    }


    //get all post
    @Get()
    getAllPosts(){
        return this.postservice.listAllPostes()
        }
    //listing one post by post id
    @Get(":id")
    getPostById(@Param('id') id: string){
        return this.postservice.listOnePostById(id)
    }

    @Get('user/posts')
    getPostesByUserId(@Req() req:Request){
        const id:string=req["idFromToken"] 
        return this.postservice.listPostsByUserId(id)
    }

}
