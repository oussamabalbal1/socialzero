
import { Reflector } from "@nestjs/core";
import { Role } from "./interface";




export const Roles =Reflector.createDecorator<Role>();