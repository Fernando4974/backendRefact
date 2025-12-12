import { IsEmail, IsString, IsUUID } from "class-validator";


export class FinUserDto {
    @IsUUID()
  id?: string;
    @IsString()
  name?: string;
    @IsString()
  lastName?: string;
    @IsEmail()
  email?: string;
}   