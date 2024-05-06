import { AppDataSource } from '../database/dataSource';
import { OrderItem } from '../entities/orderItem.entity';
import { Product } from '../entities/product.entity';
import { Rating } from '../entities/rating.entity';
import { User } from '../entities/user.entity';

const ratingRepository = AppDataSource.getRepository(Rating);
const orderItemRepository = AppDataSource.getRepository(OrderItem);
const productRepository = AppDataSource.getRepository(Product);

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

export const calculateRatingAvg = async (product: Product) => {
  const ratings = await ratingRepository.find({
    where: {
      product: {
        id: product.id,
      },
    },
  });

  if (ratings.length === 0) {
    product.ratingAvg = 5;
    return await productRepository.save(product);
  } else {
    const sum = ratings.reduce((acc, rating) => acc + rating.ratingPoint, 0);
    const avg = sum / ratings.length;
    product.ratingAvg = Math.round(avg);
    return await productRepository.save(product);
  }
};

export const createRating = async (user: User, orderItem: OrderItem, data: any) => {
  const product: Product = orderItem.product;
  
  const rating = ratingRepository.create({
    product,
    user: user,
    comment: data.comment,
    ratingPoint: data.ratingPoint,
  });

  const result = await ratingRepository.save(rating);

  await calculateRatingAvg(product);

  orderItem.isReviewed = true;

  await orderItemRepository.save(orderItem);

  return result;
};
