

import { IsUUID, } from "class-validator";

export class IdDTO {

    @IsUUID(undefined)
    readonly Id: string

}
