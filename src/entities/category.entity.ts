import { Entity, Column, OneToMany, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Product } from './product.entity';

@Entity()
export class Category extends BaseEntity {
  @Column({ nullable: false })
  @Index({ fulltext: true })
  name: string | undefined;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[] | undefined;
}
