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

export const addItemToCart = async (user: User, data: any) => {
  data.quantity = data.quantity || 1;

  const cart = await cartRepository.findOne({
    where: {
      user: {
        id: user.id,
      },
    },
    relations: ['items', 'items.product'],
  });
  
  const cartItems = cart.items;
  const existsCartItem = cartItems.find(item => item.product.id == data.productId);
  
  const product = await productService.getProductById(data.productId);
  if (!product) return null;

  let item: CartItem;

  if (existsCartItem) {
    if (product.quantity < (existsCartItem.quantity + data.quantity)) return null;
    existsCartItem.quantity += data.quantity;
    item = await cartItemRepository.save(existsCartItem);
  } else {
    if (product.quantity < data.quantity) return null;
    
    const cartItem = cartItemRepository.create({
      product: product,
      cart: cart,
      quantity: data.quantity,
    });

    item = await cartItemRepository.save(cartItem);
  }

  return item;
};
