import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDTO } from './DTO/createPostDTO';
import { UserService } from 'src/user/user.service';
import { UUIDDTO } from 'src/user/DTO/IdDTO';
import { PartialUpdatePostDTO } from './DTO/partialUpdatePostDTO';

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
    @Patch(':uuid')
    //using UpdateUserDTO to validate inpute data sent by client
    updateUserById(@Param() params: UUIDDTO,@Body() partialPost:PartialUpdatePostDTO){
        return this.postservice.updatePostById(params,partialPost)
    }

}
