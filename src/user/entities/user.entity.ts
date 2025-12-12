import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text',{ nullable: false })
  name: string;
  @Column('text')
  lastname: string;
  @Column('text', { unique: true })
  email: string;
  @Column('text')
  password: string;

  // @BeforeInsert()
  // checkUserName() {
  //   this.name = this.name.toLowerCase();
  //   this.name = this.name.replaceAll(" ","");
  // }
}
