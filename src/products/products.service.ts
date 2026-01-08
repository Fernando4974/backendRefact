import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';


@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,


  ){}


  async create(createProductDto: CreateProductDto) {

    try {

      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;

    }catch (error) {
      console.log(error);
      this.handleDBExceptions( error );

}
  }

  findAll(pagination : PaginationDto) {

    const { limit =10, offset =0 } = pagination;

    return this.productRepository.find({
      take: limit,
      skip: offset,
    });
   
  }

  async findOne(term: string) {
    try {
      const product = await this.productRepository.findOneBy({ id: term });
       return product
    } catch (error) {

      this.handleDBExceptions( error );

    }
   
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
  

      const product = await this.findOne(id);

      if (product) {
          await this.productRepository.remove(product); 
          return `The product with id #${id} has been removed`;
      }else{
        throw new NotFoundException(`Product with id ${id} not found`);
      }
    
   
  }


  private handleDBExceptions( error:any ){
    const logger = new Logger('ProductsService');
    if( error.code === '23505' ){
      throw new InternalServerErrorException('Product already exists in DB');
    }
    if( error.code === '23503' ){
      throw new InternalServerErrorException('Product has relations, cannot be removed');
    }
    if( error.code === '22P02' ){
      throw new InternalServerErrorException('Invalid UUID format');
    }
    logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
