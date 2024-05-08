import { faker } from '@faker-js/faker';
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

describe('adminGetCategories', () => {
  it('should return array of category', async () => {
    const query = {
      keyword: 'vegetable',
      page: 1,
      limit: 10,
    };
    
    const words = query.keyword.toLocaleLowerCase().split(' ');

    const {categories, count} = await categoryService.adminGetCategories(query);

    expect(count).toBeGreaterThanOrEqual(0);

    categories.forEach(category => {
      expect(category).toBeInstanceOf(Category);

      const nameContainsKeyword = words.some(word => category.name.toLocaleLowerCase().includes(word));
      expect(nameContainsKeyword).toBe(true);
    });
  });
});

describe('getCategoryByName', () => {
  it('should return a category', async () => {
    const name = 'category1';
    
    const category = await categoryService.getCategoryByName(name);
    
    expect(category).toBeInstanceOf(Category);
    expect(category.name).toEqual(name);
  });
});

describe('addCategory', () => {
  it('should return a new category', async () => {
    const name = faker.internet.displayName();
    
    const category = await categoryService.addCategory({name});
    
    expect(category).toBeInstanceOf(Category);
    expect(category.name).toEqual(name);
  });
});
