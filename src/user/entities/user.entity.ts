import { IsEmail, IsPassportNumber, Min, MinLength } from 'class-validator';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @MinLength(1)
  @Column('text',{ nullable: false })
  name: string;

  @MinLength(1)
  @Column('text')
  lastname: string;

  @MinLength(1)
  @IsEmail()
  @Column('text', { unique: true })
  email: string;

  @IsPassportNumber('any')
  @Column('text')
  password: string;

  // @BeforeInsert()
  // checkUserName() {
  //   this.name = this.name.toLowerCase();
  //   this.name = this.name.replaceAll(" ","");
  // }
}
