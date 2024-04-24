import { Query } from '../constants';
import { AppDataSource } from '../database/dataSource';
import { Product } from '../entities/product.entity';

const productRepository = AppDataSource.getRepository(Product);

export const countProduct = async() => {
  return await productRepository.count();
}; 

export const getProducts = async (query: any) => {
  const page = query.page || Query.PAGE_DEFAULT;
  const limit = query.limit || Query.LIMIT_DEFAULT;

  return await productRepository.find({
    relations: ['category', 'images', 'ratings'],
    order: {
      createdAt: 'DESC',
    },
    take: limit,
    skip: (page - 1) * limit,
  });
};
