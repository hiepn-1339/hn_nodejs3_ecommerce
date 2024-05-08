import { AppDataSource } from '../database/dataSource';
import { Category } from '../entities/category.entity';

const categoryRepository = AppDataSource.getRepository(Category);

export const getCategories = async () => {
  return await categoryRepository.find({
    relations: ['products'],
    order: {
      createdAt: 'DESC',
    },
  });
};

export const adminGetCategories = async (data: any) => {
  const query = categoryRepository.createQueryBuilder('category');
  
  if (data.keyword) {
    query.where('MATCH(category.name) AGAINST (:keyword IN BOOLEAN MODE)', { keyword: data.keyword });
  }

  const count = await query.getCount();

  const categories = await query
    .orderBy('category.created_at', 'DESC')
    .limit(data.limit)
    .offset((data.page - 1) * data.limit)
    .getMany();

  return {categories, count};
};
