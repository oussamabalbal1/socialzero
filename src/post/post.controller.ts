import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDTO } from './DTO/createPostDTO';
import { UserService } from 'src/user/user.service';
import { UUIDDTO } from 'src/user/DTO/IdDTO';

@Controller('post')
export class PostController {

    constructor (private readonly postservice:PostService,private readonly userservice:UserService){};
    //using middleware to extract id from headers by decoding it and pass it back inside req
    @Post("create")  
    async createPost(@Body() post:CreatePostDTO,@Req() req:Request){
        const userId:string=req["idFromToken"]  
        return this.postservice.createOnePost(userId,post);
    }


    //get all post
    @Get()
    getAllPosts(){
        return this.postservice.listAllPostes()
        }
    //listing one post by post UUID
    @Get(':uuid')
    getPostById(@Param() params: UUIDDTO){
        return this.postservice.listOnePostById(params)
    }

    @Get('user/posts')
    getPostesByUserId(@Req() req:Request){
        const id:string=req["idFromToken"] 
        return this.postservice.listPostsByUserId(id)
    }

    @Delete(':uuid')
    deleteOnePostByPostId(@Param() params: UUIDDTO){
        return this.postservice.deleteOnePostByPostId(params)
    }

}
