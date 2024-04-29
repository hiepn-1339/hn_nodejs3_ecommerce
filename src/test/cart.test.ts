import { AppDataSource } from '../database/dataSource';
import { Cart } from '../entities/cart.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import * as cartService from '../services/cart.service';
import { CartItem } from '../entities/cartItem.entity';
import { IsNull, Not } from 'typeorm';

let connection;
let userRepository;
let productRepository;
let cartRepository;
let cartItemRepository;

beforeAll(async () => {
  connection = await AppDataSource.initialize();
  userRepository = AppDataSource.getRepository(User);
  productRepository = AppDataSource.getRepository(Product);
  cartRepository = AppDataSource.getRepository(Cart);
  cartItemRepository = AppDataSource.getRepository(CartItem);
});

afterAll(async () => {
  await connection.destroy();
});

describe('addItemToCart', () => {
  let user: User;

  beforeEach(async () => {
    user = await userRepository
      .createQueryBuilder('user')
      .leftJoin('user.cart', 'cart')
      .where('cart.id IS NOT NULL')
      .getOne();

    user.cart = await cartRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  });

  it('should add item to cart', async () => {
    const data = {
      productId: 1,
      quantity: 3,
    };
    
    const product = await productRepository.findOne({
      where: {
        id: data.productId,
      },
    });

    const cartItem = await cartService.updateItemToCart(user, data);

    expect(cartItem).toBeInstanceOf(CartItem);
    expect(cartItem.product.id).toEqual(product.id);
    expect(cartItem.quantity).toBeGreaterThanOrEqual(data.quantity);
  });

  it('should return null if no product found with given id', async() => {
    const data = {
      productId: -1,
      quantity: 3,
    };

    const cartItem = await cartService.updateItemToCart(user, data);

    expect(cartItem).toBeNull();
  });

  it('should return array cart items and subtotal', async() => {
    const user = {
      cart: {
        id: 2,
      },
    };
    let subtotalTest = 0;

    const {items, subtotal} = await cartService.getCartItems(user as User);

    items.forEach(item => {
      expect(item).toBeInstanceOf(CartItem);
      expect(item.cart.id).toEqual(user.cart.id);
      expect(item.quantity).toBeGreaterThanOrEqual(1);
      subtotalTest += item.product.price * item.quantity;
    });

    expect(subtotal).toEqual(subtotalTest);
  });

  it('should return null after delete cart item', async() => {
    const cartItem = await cartItemRepository.findOne({
      where: {
        id: Not(IsNull()),
      },
    });

    await cartService.deleteCartItem(cartItem.id);

    const checkCartItem = await cartItemRepository.findOne({
      where: {
        id: cartItem.id,
      },
    });

    expect(checkCartItem).toBeNull();
  });
});
