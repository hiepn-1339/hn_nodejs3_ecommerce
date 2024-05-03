import { AppDataSource } from '../database/dataSource';
import { OrderItem } from '../entities/orderItem.entity';
import { Rating } from '../entities/rating.entity';
import { User } from '../entities/user.entity';

const ratingRepository = AppDataSource.getRepository(Rating);
const orderItemRepository = AppDataSource.getRepository(OrderItem);

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

export const createRating = async (user: User, orderItem: OrderItem, data: any) => {
  const rating = ratingRepository.create({
    product: orderItem.product,
    user: user,
    comment: data.comment,
    ratingPoint: data.ratingPoint,
  });

  orderItem.isReviewed = true;

  await orderItemRepository.save(orderItem);

  return await ratingRepository.save(rating);
};
