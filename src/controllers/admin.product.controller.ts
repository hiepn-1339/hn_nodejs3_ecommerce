import asyncHandler from 'express-async-handler';
import { checkIsAdmin, checkLoggedIn } from '../middlewares';
import * as productService from '../services/product.service';
import { Request, Response } from 'express';
import { EntityStatus } from '../constants';
import * as categoryService from '../services/category.service';

export const getProducts = [
  checkLoggedIn,
  checkIsAdmin,
  asyncHandler(async(req: Request, res: Response) => {
    const { count, products } = await productService.getProducts(req.query);

    const pages = Math.ceil(count / parseInt(req.query.limit as string));

    const categories = await categoryService.getCategories();

    return res.render('admin/productManagement/index', {products, EntityStatus, categories, page: req.query.page, pages, query: req.query});
  }),
];
