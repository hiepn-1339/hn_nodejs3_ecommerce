import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Coupon } from './coupon.entity';
import { OrderStatus, PaymentMethod } from '../constants';
import { BaseEntity } from './base.entity';
import { OrderItem } from './orderItem.entity';

@Entity()
export class Order extends BaseEntity {
  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User | undefined;

  @ManyToOne(() => Coupon, (coupon) => coupon.orders, { nullable: true })
  @JoinColumn({ name: 'coupon_id' })
  coupon: Coupon | undefined;

  @Column({ nullable: false })
  total: number | undefined;

  @Column({ nullable: false })
  name: string | undefined;

  @Column({ nullable: false })
  phone: string | undefined;

  @Column({ nullable: false })
  email: string | undefined;

  @Column({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.CASH_ON_DELIVERY, name: 'payment_method'})
  paymentMethod: string | undefined;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus | undefined;

  @Column({ nullable: false })
  address: string | undefined;

  @Column({ type: 'text', nullable: true })
  note: string | undefined;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items: OrderItem[] | undefined;
}
