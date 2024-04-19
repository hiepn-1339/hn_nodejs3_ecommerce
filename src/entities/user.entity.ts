import { Entity, Column, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Rating } from './rating.entity';
import { Cart } from './cart.entity';
import { Order } from './order.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ nullable: false })
  name: string | undefined;

  @Column({ nullable: false, unique: true })
  email: string | undefined;

  @Column({ nullable: false })
  password: string | undefined;

  @Column({ nullable: false })
  role: string | undefined;

  @Column({ nullable: false })
  phone: string | undefined;

  @Column({ nullable: true })
  gender: boolean | undefined;

  @Column({ type: 'date', nullable: true, name: 'date_of_birth' })
  dateOfBirth: Date | undefined;

  @Column({ nullable: true })
  avatar: string | undefined;

  @Column({ nullable: false })
  address: string | undefined;

  @Column({ nullable: false, name: 'is_active', default: false })
  isActive: boolean | undefined;

  @Column({nullable: true, name: 'token_active'})
  tokenActive: string | undefined;

  @Column({nullable: true, name: 'token_reset_password'})
  tokenResetPassword: string | undefined;

  @OneToMany(() => Rating, (rating) => rating.product)
  ratings: Rating[] | undefined;

  @OneToOne(() => Cart)
  @JoinColumn({ name: 'cart_id' })
  cart: Cart | undefined;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[] | undefined;
}
