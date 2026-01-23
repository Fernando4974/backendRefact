import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetRawHeaders = createParamDecorator(

    (data, ctx : ExecutionContext)=>{

     const req = ctx.switchToHttp().getRequest();
     //console.log(req)
     const rawHeaders = req.rawHeaders;
     if(!rawHeaders){
        throw new InternalServerErrorException('Headers is not found')
     }

     return rawHeaders

    }
)