



import {IsOptional, IsString, MinLength, } from "class-validator";


export class PartialUpdatePostDTO {

    @IsOptional()
    @IsString()
    @MinLength(15)
    readonly description: string;

}
