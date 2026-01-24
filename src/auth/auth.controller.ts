import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { GetUser } from './decorators/get-user.decorator';
import { GetRawHeaders } from './decorators/get-rawHeaders.decorator';
import { ok } from 'assert';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { validRoles } from './interfaces/valid-roles';
import { Auth} from './decorators/auth.decorator';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }
  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req()
    request:Express.Request,

    @GetUser()
    user: User,

    @GetUser('email')
    userEmail : string,


    @GetRawHeaders()
    rawHeaders : string[]
  ) {
    //console.log(request)
    
    return {
      ok: true,
      message: 'You have accessed a private route',
      user,
      userEmail,
      rawHeaders
    }
  }


  @Get('private2')
  @RoleProtected(validRoles.admin, validRoles.superUser)
  //@SetMetadata('roles',['admin','super-user'])
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(
    @GetUser()
    user:User
  ){

    return{
      ok: true,
      user
    }
  }
  @Get('private3')
  @Auth(validRoles.superUser)
  privateRoute(
    @GetUser() 
    user: User
  ){
      return{
        ok: true,
        user
      }
    }
  


 

}
