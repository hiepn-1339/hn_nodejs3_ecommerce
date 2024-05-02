import { AppDataSource } from '../database/dataSource';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cartItem.entity';
import { User } from '../entities/user.entity';
import * as productService from '../services/product.service';

const cartRepository = AppDataSource.getRepository(Cart);
const userRepository = AppDataSource.getRepository(User);
const cartItemRepository = AppDataSource.getRepository(CartItem);

export const createCart = async (user: User) => {
  const cart = new Cart();
  cart.user = user;

  user.cart = cart;
  await userRepository.save(user);

  return await cartRepository.save(cart);
};

export const updateItemToCart = async (user: User, data: any) => {
  data.quantity = data.quantity || 1;

  const items = await cartItemRepository.find({
    where: {
      cart: {
        id: user.cart.id,
      },
    },
    relations: ['product'],
  });

  const existsCartItem = items.find(item => item.product.id == data.productId);

  let item: CartItem;
  
  if (existsCartItem) {
    const product = existsCartItem.product;
    if (product.quantity < (existsCartItem.quantity + data.quantity)) return null;
    existsCartItem.quantity += data.quantity;
    if (existsCartItem.quantity < 1) return null;
    item = await cartItemRepository.save(existsCartItem);
  } else {
    const product = await productService.getProductById(data.productId);
    if (!product || product.quantity < data.quantity) return null;
    if (data.quantity < 1) return null;
    
    const cartItem = cartItemRepository.create({
      product: product,
      cart: user.cart,
      quantity: data.quantity,
    });

    item = await cartItemRepository.save(cartItem);
  }

  return item;
};

export const getCartItems = async (user: User) => {
  const items = await cartItemRepository.find({
    where: {
      cart: {
        id: user.cart.id,
      },
    },
    relations: ['product', 'product.images'],
    order: {
      createdAt: 'DESC',
    },
  });

  let subtotal = 0;

  items.forEach(item => {
    subtotal += item.product.price * item.quantity;
  });

  return { items, subtotal };
};

export const deleteCartItem = async (id: number) => {
  await cartItemRepository.delete(id);
};

export const deleteAllCartItems = async (user: User) => {
  const items = await cartItemRepository.find({
    where: {
      cart: {
        id: user.cart.id,
      },
    },
  });

  await cartItemRepository.remove(items);
};
