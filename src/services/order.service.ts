import { AppDataSource } from '../database/dataSource';
import { CartItem } from '../entities/cartItem.entity';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/orderItem.entity';
import { Product } from '../entities/product.entity';

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
