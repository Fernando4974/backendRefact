import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import {validate as isUUID} from 'uuid'
import { title } from 'process';
import { ProductImage } from './entities';
import { DataSource } from 'typeorm';   
import { User } from 'src/auth/entities/user.entity';
import { use } from 'passport';


@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource


  ){}


  async create(createProductDto: CreateProductDto, user: User) {


    const {  images = [], ...productDetails} = createProductDto;
  
    try {

      const product = this.productRepository.create({
        ...productDetails,
      user,
      images:images.map( imageUrl => this.productImageRepository.create({url: imageUrl}),
     
    )
     
      });
      await this.productRepository.save(product);
      return {...product, images};

    }catch (error) {
      console.log(error);
      this.handleDBExceptions( error );

}
  }

  async findAll(pagination : PaginationDto) {

    const { limit =10, offset =0 } = pagination;

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      }
    });
///OPCION 1
//   return products.map( product => ({
//   id: product.id,
//   title: product.title,
//   images: product.images ? product.images.map( img => img.url ) : [] 
// }));

///OPCION 2

    // return products.map( product => ({
    //   ...product,
    //   images: product.images? product.images.map( img => img.url ) : [] 
        
    // }) );

///OPCION 3
    return products.map( ({ images, ...rest }) => ({
  ...rest,
  images: images ? images.map( img => img.url ) : []
}));
   
  }

  async findOne(term: string) {

    let product: Product | null;
    
      
      if( isUUID(term) ){
           product = await this.productRepository.findOneBy({ id: term });
      }else{
          const queryBuilder = this.productRepository.createQueryBuilder('product');
          product = await queryBuilder.where('UPPER(title) =:title or slug =:slug',{
            title: term.toLocaleUpperCase(),
            slug: term.toLocaleLowerCase(),
          })
          .leftJoinAndSelect('product.images','productImages')
          .getOne();
      }
      if(!product)
        throw new NotFoundException(`Product with id or slug "${term}" not found`);
   
       return product


    }
    
  
  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map( images => images.url )
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {


    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productRepository.preload({
      
      id: id,
      ...toUpdate
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    //create query runner
   const queryRunner = this.dataSource.createQueryRunner();
   await queryRunner.connect();
   await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id: id } });
        product.images = images.map(
          imageUrl => this.productImageRepository.create({ url: imageUrl })
        );
      }
      else{
        product.images = await this.productImageRepository.findBy({ product: { id: id } });
      }
      product.user = user;
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      await this.productRepository.save(product);
      return this.findOnePlain(id);
      
    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleDBExceptions(error);
    }
  }
  
  



  async remove(id: string) {
  

      let product = await this.findOne(id);

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
    console.log(error);
    console.log("error code", error.code);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }



  // only for development purposes
  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');
    try {
      console.log("Deleting all products...");
      return await query
        .delete()
        .where({})
        .execute();
    } catch (error) {
      this.handleDBExceptions(error);
    } 
  }
}

