import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData, SeedProduct } from './data/seed-data';
import { CreateProductDto } from 'src/products/dto/create-product.dto';
import { promises } from 'dns';



@Injectable()
export class SeedService {
  
  constructor( private readonly productsService: ProductsService) {}

   async runSeed() {
    try {
      
    await this.insertProducts();

    return 'Seed executed successfully [Products deleted and re-inserted]';

    } catch (error) {

      console.log(error);
      throw new Error('Failed to execute seed');
      
    }
   
  }
  
  private async insertProducts() {
     await this.productsService.deleteAllProducts();

     const products = initialData.products;

     const insertPromises: Promise<any>[] = [];

  products.forEach( product => {
    insertPromises.push( this.productsService.create(product) );
    } );

    await Promise.all( insertPromises );



     return true;
    }
}
