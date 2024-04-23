import { AppDataSource } from '../database/dataSource';
import { Cart } from '../entities/cart.entity';
import { User } from '../entities/user.entity';

const cartRepository = AppDataSource.getRepository(Cart);

export const createCart = async (user: User) => {
  const cart = new Cart();
  cart.user = user;

  return await cartRepository.save(cart);
};
