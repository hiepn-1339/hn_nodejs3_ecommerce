import { Entity, Column, OneToMany, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Order } from './order.entity';

@Entity()
export class Coupon extends BaseEntity {
  @Column({ nullable: false })
  @Index({ fulltext: true })
  name: string | undefined;

  @Column({ nullable: false })
  percentage: number | undefined;

  @Column({ nullable: false, type: 'timestamp', name: 'start_date' })
  startDate: Date | undefined;

  @Column({ nullable: false, type: 'timestamp', name: 'end_date' })
  endDate: Date | undefined;

  @OneToMany(() => Order, (order) => order.coupon)
  orders: Order[] | undefined;
}
