import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDTO } from './DTO/createPostDTO';
import { PostGetTokenCustomDeco } from 'src/DECORATORS/post.get-token-custom-deco.decorator';
import { UserService } from 'src/user/user.service';

@Controller('post')
export class PostController {

    constructor (private readonly postservice:PostService,private readonly userservice:UserService){};
    //user should have token on his headers so he can access to this route
    //using @Req() decorator to extract token from header (better for security) or you can provide id of users as a param
    @Post("create/:id")  
    async createPost(@Body() post:CreatePostDTO,@Param('id') id: string){
        //we should check the ID if it related to any user
        const user = await this.userservice.getOneUser(id)

        console.log(user)
        //extractiing tocken from headers
        // const token:string=req.headers['authorization'].replace('Bearer ', '')
         // should write this -@Req() req :Request- inside createPost as an argument 
   
        return this.postservice.createOnePost(id,post);
    }

    //get all post
    @Get()
    getAllPosts(){
        return this.postservice.listAllPostes()
        }
    @Get(":id")
    getPostById(@Param('id') id: string){
        return this.postservice.listOnePostById(id)
        }

    @Get('user/:id')
    getPostesByUserId(@Param('id') id: string){
        return this.postservice.listPostsByUserId(id)
    }

}
