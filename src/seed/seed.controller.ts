import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { validRoles } from 'src/auth/interfaces/valid-roles';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';


@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}
 
  @Get('products')
  @Auth(validRoles.admin)
  executeSeed(
    @GetUser() user:User
  ) {
    return this.seedService.runSeed(user);
  }

  @Get('users')
  @Auth(validRoles.admin)
  executeSeedProducts(
    @GetUser()user:User
  ){

    return this.seedService.runSeed(user)
    

  }
}
