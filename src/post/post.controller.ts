import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDTO } from './DTO/createPostDTO';
import { UserService } from 'src/user/user.service';
import { UUIDDTO } from 'src/user/DTO/IdDTO';
import { PartialUpdatePostDTO } from './DTO/partialUpdatePostDTO';
import { AuthGuard } from 'src/auth/auth.guard';
import { Location } from './ENTITIES/post.entity';
import { AuthRoleGuard } from 'src/auth/auth.role.guard';
import { Roles } from 'src/auth/DECORATORS/role/role.decorator';
import { Role } from 'src/auth/DECORATORS/role/interface';

@Controller('post')
export class PostController {

    constructor (private readonly postservice:PostService){};

    //create new post inside user
    //using authGuard to make sure user is authenticated and extract UUID : req["params_custom"]
    @UseGuards(AuthGuard)
    @Post()
    async createOnePost(@Body() post:CreatePostDTO,@Req() req:Request){
        const params:UUIDDTO=req["params_custom"]
        return this.postservice.createOnePost(params,post,Location.Profile);
    }


    //ONLY ADMIN CAN DO THIS
    @Roles(Role.Admin)
    @UseGuards(AuthRoleGuard)
    @Get()
    getAllPosts(){
        return this.postservice.listAllPostes()
    }


    //listing one post by post UUID
    //using authGuard to make sure user is authenticated and extract UUID
    //
    @UseGuards(AuthGuard)
    @Get(':uuid')
    getPostById(@Param() params: UUIDDTO){
        return this.postservice.listOnePostById(params)
    }

    @Get('user/posts')
    getPostesByUserId(@Req() req:Request){
        const params:UUIDDTO=req["params_custom"]
        return this.postservice.listPostsByUserId(params)
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
