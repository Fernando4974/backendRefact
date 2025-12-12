import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService');
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  ////////////////////////////------------------------------------------------------------------------------------ Crear Ususario
  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      return user;
    } catch (error) {
    this.handleDBErrors(error);
    }
  }
  ////////////////////////////------------------------------------------------------------------------------------Listar Todos los Ususarios
  async findAll() {
    const users = await this.userRepository.find({});
    return users;
  }
  ////////////////////////////------------------------------------------------------------------------------------Listar un Ususario

  async findOne(id: string) {

    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

   
 ////////////////////////////------------------------------------------------------------------------------------Actualizar un Ususario
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  ///////////////////////////------------------------------------------------------------------------------------Eliminar un Ususario

  async remove(id: string) {

   const user = this.findOne(id);
   await this.userRepository.remove(await user);

    return `This action removes a #${id} user`;
  }
 /////////////////////////////------------------------------------------------------------------------------------Manejo de errores de la base de datos
  private handleDBErrors(error: any) {
    if (error.code === '23505') {
      throw new InternalServerErrorException('Duplicate entry found');
    }
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
