import { AppDataSource } from '../database/dataSource';
import { Category } from '../entities/category.entity';
import * as categoryService from '../services/category.service';

let connection;

beforeAll(async () => {
  connection = await AppDataSource.initialize();
});

afterAll(async () => {
  await connection.destroy();
});

describe('getCategories', () => {
  it('should return array of category', async () => {
    const categories = await categoryService.getCategories();

    categories.forEach(category => {
      expect(category).toBeInstanceOf(Category);
    });
  });
});
