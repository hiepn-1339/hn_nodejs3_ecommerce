import { OrderStatus } from '../constants';
import { AppDataSource } from '../database/dataSource';
import { CartItem } from '../entities/cartItem.entity';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/orderItem.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';

const orderRepository = AppDataSource.getRepository(Order);
const orderItemRepository = AppDataSource.getRepository(OrderItem);
const productRepository = AppDataSource.getRepository(Product);

export const createOrder = async (data: any) => {
  const order = orderRepository.create({
    user: data.user,
    coupon: data.coupon,
    total: data.total,
    name: data.name,
    phone: data.phone,
    email: data.email,
    paymentMethod: data.paymentMethod,
    address: data.address,
    note: data.note,
    proof: data.proof,
  });

  return await orderRepository.save(order);
}; 

export const createOrderItems = async (items: CartItem[], order: Order) => {
  const orderItemsPromises = items.map(async item => {
    if (item.product.quantity < item.quantity) throw new Error(`${item.product.name} is not enough quantity`);

    item.product.quantity -= item.quantity;
    await productRepository.save(item.product);
    
    const orderItem = orderItemRepository.create({
      quantity: item.quantity,
      product: item.product,
      price: item.product.price,
      order: order,
    });
    return await orderItemRepository.save(orderItem);
  });

  return await Promise.all(orderItemsPromises);
};

export const getOrders = async (user: User, data: any) => {
  const query = orderRepository.createQueryBuilder('order');

  if (data.startDate) {
    query.andWhere('(order.created_at >= :startDate)', {
      startDate: data.startDate,
    });
  }

  if (data.endDate) {
    query.andWhere('(order.created_at <= :endDate)', {
      endDate: data.endDate,
    });
  }

  if (data.status) {
    query.andWhere('order.status = :status', {
      status: data.status,
    });
  }

  if (data.paymentMethod) {
    query.andWhere('order.payment_method = :paymentMethod', {
      paymentMethod: data.paymentMethod,
    });
  }

  query.andWhere('order.user_id = :userId', {
    userId: user.id,
  });

  const count = await query.getCount();

  const orders = await query
    .orderBy('order.created_at', 'DESC')
    .limit(data.limit)
    .offset((data.page - 1) * data.limit)
    .getMany();

  return {orders, count};
};

export const getOrderById = async (id: number) => {
  return await orderRepository.findOne({
    where: {
      id: id,
    },
    relations: ['coupon'],
  });
};

export const getOrderItems = async (order: Order) => {
  return await orderItemRepository.find({
    where: {
      order: {
        id: order.id,
      },
    },
    relations: ['product', 'product.images'],
    order: {
      createdAt: 'DESC',
    },
  });
};

export const cancelOrder = async (order: Order) => {
  order.status = OrderStatus.CANCELLED;
  return await orderRepository.save(order);
};

export const getOrderItemById = async (id: number) => {
  return await orderItemRepository.findOne({
    where: {
      id,
    },
    relations: ['product'],
  });
};
