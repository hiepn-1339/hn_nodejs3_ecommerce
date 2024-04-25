import asyncHandler from 'express-async-handler';
import { NextFunction, Request, Response } from 'express';
import * as productService from '../services/product.service';
import * as categoryService from '../services/category.service';
import * as ratingService from '../services/rating.service';
import { ErrorCode } from '../constants';
import { Product } from '../entities/product.entity';
import { t } from 'i18next';
import { checkValidId } from '../middlewares';

interface IProductRequest extends Request {
  product?: Product;
}

const checkExistsProduct = async (req: IProductRequest, res: Response, next: NextFunction) => {
  const product = await productService.getProductById(parseInt(req.params.id));
  if (product === null) {
    res.render('error', { code: ErrorCode.NOT_FOUND, title: t('error.notFound'), message: t('error.noProductFoundWithId', {id: req.params.id}) });
  }

  req.product = product;
  next();
};

export const getHome = asyncHandler(async(req: Request, res: Response) => {
  const { count, products } = await productService.getProducts(req.query);
  const pages = count / parseInt(req.query.limit as string);
  const categories = await categoryService.getCategories();
  return res.render('home/index', {products, categories, page: req.query.page, pages});
});

export const getDetailProduct = [
  checkValidId,
  checkExistsProduct,
  asyncHandler(async(req: IProductRequest, res: Response) => {
    const product = await productService.getProductById(parseInt(req.params.id));
    const { ratings, total } = await ratingService.getRatingsByProduct(product.id, req.query);
    const pages = total / parseInt(req.query.limit as string);
    const featuredProducts = await productService.getFeaturedProduct();
    return res.render('product/index', {product, ratings, featuredProducts, pages, page: req.query.page});
  }),
];
