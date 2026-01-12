import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';


@Injectable()
export class FilesService {
  
   holaMundo() {
     
  }

  getProductImage(imageName: string) {

    const filePath = join(__dirname, '../../static/products/', imageName);


    if (!existsSync(filePath)) {
      throw new BadRequestException(`Image ${imageName} not found`);
    }

    return filePath;
  }
}
