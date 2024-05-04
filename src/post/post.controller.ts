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


    @UseGuards(AuthGuard)
    @Post()
    async createOnePost(@Body() post:CreatePostDTO,@Req() req:Request){
        const params:UUIDDTO=req["params_custom"]
        return this.postservice.createOnePost(params,post,Location.Profile);
    }


    //ONLY ADMIN CAN DO THIS
    @UseGuards(AuthGuard,AuthRoleGuard)
    @Roles(Role.Admin)
    @Get()
    getAllPosts(){
        return this.postservice.listAllPostes()
    }


    //listing one post by post UUID
    //using authGuard to make sure user is authenticated and extract UUID
    //
    @UseGuards(AuthGuard)
    @Get(':uuid')
    getPostById(@Param() postParamsUUID: UUIDDTO,@Req() req:Request){
        const userid:UUIDDTO=req["params_custom"]
        const userRole=req["params_role"]
        return this.postservice.listOnePostById(postParamsUUID,userid,userRole.role)
    }

    @Get('user/posts')
    getPostesByUserId(@Req() req:Request){
        const params:UUIDDTO=req["params_custom"]
        return this.postservice.listPostsByUserId(params)
    }

    //normal user can delete his posts only
    //admin can delete any post
    @UseGuards(AuthGuard)
    @Delete(':uuid')
    deleteOnePostByPostId(@Param() postParamsUUID: UUIDDTO,@Req() req:Request){
        const userParamsUUID:UUIDDTO=req["params_custom"]
        const userRole:Role=req["params_role"].role
        return this.postservice.deleteOnePostByPostId(postParamsUUID,userParamsUUID,userRole)
    }


    //normal user can update his posts only
    //admin can update any post based on post id 
    @Patch(':uuid')
    //using UpdateUserDTO to validate inpute data sent by client
    updateUserById(@Param() postParamsUUID: UUIDDTO,@Body() partialPost:PartialUpdatePostDTO,@Req() req:Request){
        const userParamsUUID:UUIDDTO=req["params_custom"]
        const userRole:Role=req["params_role"].role
        return this.postservice.updatePostById(postParamsUUID,partialPost,userParamsUUID,userRole)
    }

}
