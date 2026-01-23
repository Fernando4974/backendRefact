import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { GetUser } from './decorators/get-user.decorator';
import { GetRawHeaders } from './decorators/get-rawHeaders.decorator';
import { ok } from 'assert';


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
  @UseGuards(AuthGuard())
  privateRoute2(
    @GetUser()
    user:User
  ){

    return{
      ok: true,
      user
    }
  }


 

}
