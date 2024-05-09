import { faker } from '@faker-js/faker';
import { AppDataSource } from '../database/dataSource';
import { Product } from '../entities/product.entity';
import * as productService from '../services/product.service';
import * as categoryService from '../services/category.service';
import { ProductImage } from '../entities/productImage.entity';

let connection;

beforeAll(async () => {
  connection = await AppDataSource.initialize();
});

afterAll(async () => {
  await connection.destroy();
});

describe('getProducts', () => {
  it('should filter products by keyword, minPrice, maxPrice, and category', async () => {
    const query = {
      keyword: 'Cynictis canadensis',
      minPrice: 10,
      maxPrice: 100,
      category: 1,
    };
    
    const result = await productService.getProducts(query);

    const words = query.keyword.toLocaleLowerCase().split(' ');
    
    expect(typeof result.count).toBe('number');
    result.products.forEach(product => {
      expect(product.price).toBeGreaterThanOrEqual(query.minPrice);
      expect(product.price).toBeLessThanOrEqual(query.maxPrice);

      expect(product.category.id).toBe(query.category);

      const nameContainsKeyword = words.some(word => product.name.toLocaleLowerCase().includes(word));
      const descriptionContainsKeyword = words.some(word => product.description.toLocaleLowerCase().includes(word));
      expect(nameContainsKeyword || descriptionContainsKeyword).toBe(true);
    });
  });
});

describe('getProductById', () => {
  it('should return product with given id', async () => {
    const id = 1; 
    const product = await productService.getProductById(id);
    expect(product.id).toEqual(id);
  });

  it('should return null if no product found with given id', async () => {
    const id = -1;
    const product = await productService.getProductById(id);
    expect(product).toBeNull();
  });
});

describe('getFeaturedProduct', () => {
  it('should return an array of featured products', async () => {
    const featuredProducts = await productService.getFeaturedProduct();
    featuredProducts.forEach(product => {
      expect(product).toBeInstanceOf(Product);
    });
  });
});

describe('getProductByName', () => {
  it('should return product with given name', async () => {
    const name = 'Product 1'; 
    const product = await productService.getProductByName(name);
    expect(product.name).toEqual(name);
  });

  it('should return null if no product found with given name', async () => {
    const name = 'Product -1'; 
    const product = await productService.getProductByName(name);
    expect(product).toBeNull();
  });
});


describe('createProduct', () => {
  it('should return a new product', async () => {
    const categoryId = faker.number.int({min: 1, max: 5});

    const category = await categoryService.getCategoryById(categoryId);

    const data = {
      name: faker.internet.displayName(),
      category: category,
      price: faker.number.int({min: 10, max: 100}),
      description: faker.lorem.paragraph(),
      quantity: faker.number.int({min: 1, max: 100}),
      isActive: faker.datatype.boolean(),
    };

    const product = await productService.createProduct(data);

    expect(product).toBeInstanceOf(Product);
    expect(product.name).toEqual(data.name);
    expect(product.price).toEqual(data.price);
    expect(product.description).toEqual(data.description);
    expect(product.quantity).toEqual(data.quantity);
    expect(product.isActive).toEqual(data.isActive);
  });
});

const createFile = () => {
  return {
    location: faker.image.url(),
  };
};

describe('createProductImages', () => {
  it('should return array product images', async () => {
    const random = faker.number.int({min: 1, max: 5});

    const files = faker.helpers.multiple(createFile, { count: random });
    const product = await productService.getProductById(random);

    const productImages = await productService.createProductImages(product, files);

    const urls = files.map(file => file.location);
    productImages.forEach((productImage) => {
      expect(productImage).toBeInstanceOf(ProductImage);
      expect(urls.includes(productImage.url)).toEqual(true);
    });
  });
});
