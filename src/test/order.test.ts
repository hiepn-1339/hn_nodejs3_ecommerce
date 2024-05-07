import { Order } from './../entities/order.entity';
import { AppDataSource } from '../database/dataSource';
import { CartItem } from '../entities/cartItem.entity';
import { OrderItem } from '../entities/orderItem.entity';
import * as orderService from '../services/order.service';
import { User } from '../entities/user.entity';
import { OrderStatus } from '../constants';

let connection;

beforeAll(async () => {
  connection = await AppDataSource.initialize();
});

afterAll(async () => {
  await connection.destroy();
});

describe('createOrder', () => {
  it('should create an order successfully', async () => {
    const orderData = {
      user: 1,
      coupon: 1,
      total: 100,
      name: 'John Doe',
      phone: '123456789',
      email: 'john@example.com',
      paymentMethod: 'BANK_TRANSFER',
      address: '123 Street, City',
      note: 'Please deliver as soon as possible',
      proof: 'payment_proof.jpg',
    };
    
    const order = await orderService.createOrder(orderData);

    expect(order).toBeInstanceOf(Order);
    expect(order.total).toEqual(orderData.total);
    expect(order.name).toEqual(orderData.name);
    expect(order.phone).toEqual(orderData.phone);
    expect(order.email).toEqual(orderData.email);
    expect(order.paymentMethod).toEqual(orderData.paymentMethod);
    expect(order.address).toEqual(orderData.address);
    expect(order.note).toEqual(orderData.note);
    expect(order.proof).toEqual(orderData.proof);
  });
});

describe('createOrderItems', () => {
  it('should create order items successfully', async () => {
    const items = [
      { product: { id: 1, name: 'Product 1', quantity: 10, price: 20, description: '' }, quantity: 2 },
      { product: { id: 2, name: 'Product 2', quantity: 5, price: 30, description: '' }, quantity: 1 },
    ];
    const order = { id: 1 };

    const createdItems = await orderService.createOrderItems(items as CartItem[], order as Order);

    createdItems.forEach(createdItem => {
      expect(createdItem).toBeInstanceOf(OrderItem);
      expect(createdItem.quantity).toEqual(items.find(item => item.product.id === createdItem.product.id)?.quantity);
      expect(createdItem.price).toEqual(items.find(item => item.product.id === createdItem.product.id)?.product.price);
    });
    expect(createdItems).toHaveLength(items.length);
  });
});

describe('getOrders', () => {
  it('should return a list of orders', async () => {
    const user = {
      id: 1,
    };

    const data = {
      page: 1,
      limit: 10,
    };

    const result = await orderService.getOrders(user as User, data);

    result.orders.forEach((order) => {
      expect(order).toBeInstanceOf(Order);
    });
  });
});

describe('getOrder', () => {
  it('should return order with specified id', async () => {
    const id = 1;

    const order = await orderService.getOrderById(id);

    expect(order).toBeInstanceOf(Order);
    expect(order.id).toEqual(id);
  });

  it('should return null if order does not exist', async () => {
    const id = -1;

    const order = await orderService.getOrderById(id);

    expect(order).toBeNull();
  });
});

describe('getOrderItems', () => {
  it('should return order items of specified order', async () => {
    const orderId = 1;
    const order = { id: orderId };
    const orderItems = await orderService.getOrderItems(order as Order);
    expect(orderItems).toBeInstanceOf(Array);
    orderItems.forEach(item => {
      expect(item).toBeInstanceOf(OrderItem);
    });
  });

  it('should return empty array if order has no items', async () => {
    const order = { id: -1 }; 
    const orderItems = await orderService.getOrderItems(order as Order);
    expect(orderItems).toBeInstanceOf(Array);
    expect(orderItems.length).toBe(0);
  });
});

describe('cancelOrder', () => {
  it('should return order items has status CANCELLED', async () => {
    const id = 1;
    
    const order = await orderService.getOrderById(id);

    const updatedOrder = await orderService.changeStatusOrder(order, OrderStatus.CANCELLED);

    expect(updatedOrder).toBeInstanceOf(Order);
    expect(updatedOrder.status).toEqual(OrderStatus.CANCELLED);
  });
});

describe('getOrderItemByID', () => {
  it('should return order item with specified id', async () => {
    const id = 1;
    const orderItem = await orderService.getOrderItemById(id);
    expect(orderItem).toBeInstanceOf(OrderItem);
    expect(orderItem.id).toEqual(id);
  });

  it('should return null if order item does not exist', async () => {
    const id = -1;
    const orderItem = await orderService.getOrderItemById(id);
    expect(orderItem).toBeNull();
  });
});
