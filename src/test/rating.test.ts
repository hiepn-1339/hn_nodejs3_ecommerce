import { AppDataSource } from '../database/dataSource';
import { OrderItem } from '../entities/orderItem.entity';
import { Rating } from '../entities/rating.entity';
import { User } from '../entities/user.entity';
import * as ratingService from '../services/rating.service';

let connection;
let userRepository;
let orderItemRepository;

beforeAll(async () => {
  connection = await AppDataSource.initialize();
  userRepository = AppDataSource.getRepository(User);
  orderItemRepository = AppDataSource.getRepository(OrderItem);
});

afterAll(async () => {
  await connection.destroy();
});

describe('getRatingsByProduct', () => {
  it('should return ratings and total count for given product', async () => {
    const id = 1;
    const query = { page: '1', limit: '10' };
    const { ratings, total } = await ratingService.getRatingsByProduct(id, query);

    ratings.forEach(rating => {
      expect(rating).toBeInstanceOf(Rating);
      expect(rating.product.id).toEqual(id);
      expect(rating.user).toBeInstanceOf(User);
    });

    expect(typeof total).toBe('number');
  });

  it('should return empty array if no ratings found for given product', async () => {
    const id = -1;
    const query = { page: '1', limit: '10' };
    const { ratings, total } = await ratingService.getRatingsByProduct(id, query);

    expect(ratings).toEqual([]);
    expect(total).toBe(0);
  });
});

describe('createRating', () => {
  it('should create a rating and mark order item as reviewed', async () => {
    const userId = 1;
    
    const user = await userRepository.findOne({
      where: {
        id: userId,
      },
    });

    const orderItem = await orderItemRepository.findOne({
      where: {
        order: {
          user: userId,
        },
        isReviewed: false,
      },
    });

    const data = {
      comment: 'test comment',
      ratingPoint: 5,
      orderItemId: 1,
    };

    const rating = await ratingService.createRating(user, orderItem, data);

    const updatedOrderItem = await orderItemRepository.findOne({
      where: {
        id: orderItem.id,
      },
    });

    expect(rating).toBeInstanceOf(Rating);
    expect(rating.ratingPoint).toEqual(data.ratingPoint);
    expect(rating.comment).toEqual(data.comment);
    expect(updatedOrderItem.isReviewed).toEqual(true);
  });
});
