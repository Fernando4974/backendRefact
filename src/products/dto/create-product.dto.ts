import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";
import { BeforeInsert } from "typeorm";

export class CreateProductDto {


        @IsString()
        @MinLength(1)
     title: string;

        @IsNumber()
        @IsPositive()
        @IsOptional()
     price?: number;

        @IsString()
        @IsOptional()
     description?: string;

        @IsString()
        @IsOptional()
     slug?: string;

        @IsInt()
        @IsOptional()
     stock?: number;

        @IsString({ each: true })
        @IsArray()
        @IsOptional()
     sizes: string[];

        @IsString()
        @IsIn(['male', 'female', 'unisex'])
     gender: string;


         @IsString({ each: true })
         @IsArray()
         @IsOptional()
     tags?: string[];


}
