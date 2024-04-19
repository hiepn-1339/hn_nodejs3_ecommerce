import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from './base.entity';
import { CartItem } from './cartItem.entity';

@Entity()
export class Cart extends BaseEntity {
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User | undefined;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  items: CartItem[] | undefined;
}
