import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Product } from './product.entity';

@Entity()
export class Category extends BaseEntity {
  @Column({ nullable: false })
  name: string | undefined;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[] | undefined;
}
