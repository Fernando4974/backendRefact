import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from 'src/auth/entities/user.entity';



@Entity({ name: 'products' })
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

    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage   [];

    @ManyToOne(
    ()=> User,
    (user)=> user.product,
    {eager: true}
    )
    user:User
    
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
