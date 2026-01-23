import { IsArray, IsEmail, IsOptional, IsPassportNumber, Min, MinLength } from 'class-validator';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsEmail()
  @Column('text', { unique: true, nullable: false })
  email: string;

  @MinLength(6)
  @Column('text', { nullable: false , select: false })
  password: string;

  @Column('text', { nullable: false })
  fullName: string;

  @IsOptional()
  @Column('bool', { nullable: true, default: true })
  isActive?: boolean;

  @IsArray()
  @Column('text', { nullable: true , array: true , default: ['user'] })
  role: string[];


@BeforeInsert()
normalizeEmail() {
    this.email = this.email.toLowerCase().trim();
  }
}