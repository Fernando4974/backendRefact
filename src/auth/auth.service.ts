import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {

      const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });


      if (existingUser) {
        throw new InternalServerErrorException('Email already in use');
      }
      const password = createUserDto.password;
      const passwordHash = await bcrypt.hash(password, 10);
      createUserDto.password = passwordHash;
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      const { password: _, ...userWithoutPassword } = user;
      return {userWithoutPassword,
        token: this.getJwtConfig({id:user.id})
      };

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {

    try {

      const userExists = await this.userRepository.findOne({ 
        where: { email: loginUserDto.email },
        select: { id: true, email: true, password: true }
      });

      if (!userExists) {
        this.handleDBExceptions(new UnauthorizedException('Invalid credentials'));
      }
      if (userExists) {
        
        const isPasswordValid = await bcrypt.compare(loginUserDto.password, userExists.password);
        if (!isPasswordValid) {
          throw new UnauthorizedException('Password incorrect');
        };
        const { password: _, ...userWithoutPassword } = userExists;
        return { 
          ...userWithoutPassword,
          token: this.getJwtConfig({ id: userExists.id }) };
      }
      
    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateAuthDto: any) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

 private getJwtConfig(payload: JwtPayload) {
  const token = this.jwtService.sign(payload);

  return token;
 }


  private handleDBExceptions(error: any): never {
    if (error.code === '23505') {
      throw new InternalServerErrorException('Duplicate entry: ' + error.detail);
    }
    if (error.code === '23503') {
      throw new InternalServerErrorException('Foreign key violation: ' + error.detail);
    }
    if (error.code === '22P02') {
      throw new InternalServerErrorException('Invalid input syntax: ' + error.detail);
    }
    console.log(error);
    throw new InternalServerErrorException('Database error: ' + error.message);
  }
}
