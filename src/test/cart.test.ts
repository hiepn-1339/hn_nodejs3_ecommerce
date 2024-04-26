import { AppDataSource } from '../database/dataSource';
import { Cart } from '../entities/cart.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import * as cartService from '../services/cart.service';
import { CartItem } from '../entities/cartItem.entity';

let connection;
let userRepository;
let productRepository;
let cartRepository;

beforeAll(async () => {
  connection = await AppDataSource.initialize();
  userRepository = AppDataSource.getRepository(User);
  productRepository = AppDataSource.getRepository(Product);
  cartRepository = AppDataSource.getRepository(Cart);
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

    const cartItem = await cartService.addItemToCart(user, data);

    expect(cartItem).toBeInstanceOf(CartItem);
    expect(cartItem.product.id).toEqual(product.id);
    expect(cartItem.quantity).toBeGreaterThanOrEqual(data.quantity);
  });

  it('should return null if no product found with given id', async() => {
    const data = {
      productId: -1,
      quantity: 3,
    };

    const cartItem = await cartService.addItemToCart(user, data);

    expect(cartItem).toBeNull();
  });
});
