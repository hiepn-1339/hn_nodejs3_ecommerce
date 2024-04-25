import { Brackets } from 'typeorm';
import { Query } from '../constants';
import { AppDataSource } from '../database/dataSource';
import { Product } from '../entities/product.entity';

const productRepository = AppDataSource.getRepository(Product);

export const getProducts = async (data: any) => {
  const page = data.page || Query.PAGE_DEFAULT;
  const limit = data.limit || Query.LIMIT_DEFAULT;

  const query = productRepository.createQueryBuilder('product');

  if (data.keyword) {
    query.andWhere(new Brackets(qb => {
      qb.where('MATCH(product.name) AGAINST (:keyword IN BOOLEAN MODE)', { keyword: data.keyword })
        .orWhere('MATCH(product.description) AGAINST (:keyword IN BOOLEAN MODE)', { keyword: data.keyword });
    }));
  }

  if (data.minPrice || data.maxPrice) {
    query.andWhere('(product.price >= :minPrice AND product.price <= :maxPrice)', {
      minPrice: data.minPrice || 0,
      maxPrice: data.maxPrice || Number.MAX_VALUE,
    });
  }

  if (data.category) {
    query.andWhere('product.category_id = :categoryId', { categoryId: data.category });
  }

  query.leftJoinAndSelect('product.category', 'category')
       .leftJoinAndSelect('product.images', 'product_image')
       .leftJoinAndSelect('product.ratings', 'rating');

  const count = await query.getCount();

  const products = await query
    .orderBy('product.created_at', 'DESC')
    .limit(limit)
    .offset((page - 1) * limit)
    .getMany();

  return { count, products };
};
