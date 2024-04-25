import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import * as productService from '../services/product.service';
import * as categoryService from '../services/category.service';
import { Query } from '../constants';

export const getHome = asyncHandler(async(req: Request, res: Response) => {
  const page = req.query.page || Query.PAGE_DEFAULT;
  const limit = req.query.limit || Query.LIMIT_DEFAULT;
  const { count, products } = await productService.getProducts(req.query);
  const pages = count / parseInt(limit as string);
  const categories = await categoryService.getCategories();
  return res.render('home/index', {products, categories, page, pages});
});
