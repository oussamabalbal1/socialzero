import {createParamDecorator } from '@nestjs/common';

//data is that data provided by decorator
//request object
//by searching : i found that i can not access to headers by createParamDecorator
//createParamDecorator is designed for parameter-level decorators, not for accessing request headers within route handlers.
//is butter to use @Req() decorator
export const PostGetTokenCustomDeco = createParamDecorator ((data,req:Request) =>{
    console.log(req.headers)
});
