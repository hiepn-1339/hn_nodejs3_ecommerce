import { AppDataSource } from '../database/dataSource';
import { Rating } from '../entities/rating.entity';

const ratingRepository = AppDataSource.getRepository(Rating);

export const getRatingsByProduct = async (id: number, query) => {
  const page = parseInt(query.page as string);
  const limit = parseInt(query.limit as string);

  const [ratings, total] = await ratingRepository.findAndCount({
    where: {
      product: {
        id,
      },
    },
    relations: ['user'],
    take: limit,
    skip: (page - 1) * limit,
    order: {
      createdAt: 'DESC',
    },
  });

  return { ratings, total };
};
