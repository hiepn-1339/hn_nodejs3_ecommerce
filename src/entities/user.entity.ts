import { Entity, Column, OneToMany, JoinColumn, OneToOne, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Rating } from './rating.entity';
import { Cart } from './cart.entity';
import { Order } from './order.entity';
import { Gender, Role } from '../constants';

@Entity()
export class User extends BaseEntity {
  @Column({ nullable: false })
  @Index({ fulltext: true })
  name: string | undefined;

  @Column({ nullable: false, unique: true })
  email: string | undefined;

  @Column({ nullable: false })
  password: string | undefined;

  @Column({ nullable: false, type: 'enum', enum: Role, default: Role.USER })
  role: string | undefined;

  @Column({ nullable: false })
  phone: string | undefined;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: string | undefined;

  @Column({ type: 'date', nullable: true, name: 'date_of_birth' })
  dateOfBirth: Date | undefined;

  @Column({ nullable: true })
  avatar: string | undefined;

  @Column({ nullable: false })
  @Index({ fulltext: true })
  address: string | undefined;

  @Column({ nullable: false, name: 'is_active', default: false })
  isActive: boolean | undefined;

  @Column({nullable: true, name: 'token_active'})
  tokenActive: string | undefined;

  @Column({nullable: true, name: 'token_active_expires'})
  tokenActiveExpires: Date | undefined;

  @Column({nullable: true, name: 'token_reset_password'})
  tokenResetPassword: string | undefined;

  @Column({nullable: true, name: 'token_reset_password_expires'})
  tokenResetPasswordExpires: Date | undefined;

  @OneToMany(() => Rating, (rating) => rating.product)
  ratings: Rating[] | undefined;

  @OneToOne(() => Cart)
  @JoinColumn({ name: 'cart_id' })
  cart: Cart | undefined;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[] | undefined;
}
