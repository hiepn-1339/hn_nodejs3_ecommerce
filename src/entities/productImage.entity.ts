import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class ProductImage extends BaseEntity {
  @ManyToOne(() => Product, (product) => product.images)
  @JoinColumn({ name: 'product_id' })
  product: Product | undefined;

  @Column({ nullable: false })
  url: string | undefined;
}
