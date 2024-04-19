import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class OrderItem extends BaseEntity{
  @Column({ nullable: false })
  quantity: number | undefined;

  @ManyToOne(() => Product, (product) => product.orderItems)
  @JoinColumn({ name: 'product_id' })
  product: Product | undefined;

  @Column({ nullable: false })
  price: number | undefined;

  @ManyToOne(() => Order, (order) => order.items)
  @JoinColumn({ name: 'order_id' })
  order: Order | undefined;
}
