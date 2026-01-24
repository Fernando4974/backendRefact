import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isIn } from 'class-validator';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    const valideRoles: string[] = this.reflector.get(META_ROLES, context.getHandler())

    if (!valideRoles || valideRoles.length===0) {
      console.log('Warning: Roles is undefined by Guards')
      return true
      
    }

    const req = context.switchToHttp().getRequest()
    const user = req.user

    if(!user){
      throw new BadRequestException('User is not exist')
    }
for(const role of user.role){
  if (valideRoles.includes(role)) {

    return true
    
  }
}
    throw new ForbiddenException(`User ${user.name} nees a valid role . Valid Roles: [ ${valideRoles}]`)
  }
}
