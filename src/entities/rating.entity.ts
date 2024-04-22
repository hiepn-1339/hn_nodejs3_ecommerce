import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class Rating extends BaseEntity {
  @ManyToOne(() => Product, (product) => product.ratings)
  @JoinColumn({ name: 'product_id' })
  product: Product | undefined;

  @ManyToOne(() => User, (user) => user.ratings)
  @JoinColumn({ name: 'user_id' })
  user: User | undefined;

  @Column({ nullable: true })
  comment: string | undefined;

  @Column({ nullable: false, name: 'rating_point' })
  ratingPoint: number | undefined;
}
