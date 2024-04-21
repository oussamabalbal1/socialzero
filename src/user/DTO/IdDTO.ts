

import { IsUUID, } from "class-validator";

export class UUIDDTO  {

    @IsUUID('4', { message: 'Invalid UUID format' })
    readonly uuid: string

}
