import { AppDataSource } from '../database/dataSource';
import { Rating } from '../entities/rating.entity';
import { User } from '../entities/user.entity';
import * as ratingService from '../services/rating.service';

let connection;

beforeAll(async () => {
  connection = await AppDataSource.initialize();
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
