import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from './product.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class CartItem extends BaseEntity {
  @Column({ nullable: false })
  quantity: number | undefined;

  @ManyToOne(() => Product, (product) => product.cartItems)
  @JoinColumn({ name: 'product_id' })
  product: Product | undefined;

  @ManyToOne(() => Cart, (cart) => cart.items)
  @JoinColumn({ name: 'cart_id' })
  cart: Cart | undefined;
}
