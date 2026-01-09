import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text',{ nullable: false, unique: true })
    title:string;

    @Column('float',{ nullable: false, default:0 })
    price: number;
    
    @Column('text',{ nullable: true })
    description: string;

    @Column('text',{ nullable: true , unique: true })
    slug: string;

    @Column('int',{ nullable: true, default:0 })
    stock: number;

    @Column('text',{ nullable: true, array:true })
    sizes: string[];

    @Column('text')
    gender: string;

    @Column('text',{ default: [], array:true, nullable: true })
    tags: string[];

    //images
    
     @BeforeInsert()
      generateSlug(){
      if(!this.slug){
         this.slug = this.title;
      }
      this.slug = this.slug
         .toLowerCase()
         .replaceAll(' ', '_')
         .replaceAll("'", '');
     }
     @BeforeUpdate()
        updateSlug(){
            this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
        }
     

}
