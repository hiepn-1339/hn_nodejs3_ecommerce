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
