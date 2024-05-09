import asyncHandler from 'express-async-handler';
import { checkIsAdmin, checkLoggedIn } from '../middlewares';
import * as productService from '../services/product.service';
import { NextFunction, Request, Response } from 'express';
import { EntityStatus } from '../constants';
import * as categoryService from '../services/category.service';
import { uploadImage } from '../middlewares/multer.middleware';
import { validateCreateProduct } from '../middlewares/validate/product.validate';
import { getTranslatedMessage } from '../utils/i18n';

export interface IAdminProductRequest extends Request {
  product?: any;
  files?: any[];
  errors?: any[];
}

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

export const getCreateProduct = [
  checkLoggedIn,
  checkIsAdmin,
  asyncHandler(async(req: Request, res: Response) => {
    const categories = await categoryService.getCategories();
    return res.render('admin/productManagement/form', {categories, EntityStatus});
  }),
];

export const checkExistsProductByName = async(req: IAdminProductRequest, res: Response, next: NextFunction) => {
  const product = await productService.getProductByName(req.body.name);
  if (product) {
    req.errors = [{
      path: 'name',
      msg: getTranslatedMessage('error.nameExists', req.query.lng),
    }];
    const categories = await categoryService.getCategories(); 
    return res.render('admin/productManagement/form', {categories, EntityStatus, errors: req.errors});
  }

  next();
};

export const postCreateProduct = [
  checkLoggedIn,
  checkIsAdmin,
  uploadImage.array('images'),
  validateCreateProduct,
  checkExistsProductByName,
  asyncHandler(async (req: IAdminProductRequest, res: Response) => {
    if (req.files) {
      req.body.status = req.body.status === EntityStatus.ACTIVE ? true : false;
      req.body.category = await categoryService.getCategoryByName(req.body.category);
      const product = await productService.createProduct(req.body);
      await productService.createProductImages(product, req.files);
      return res.redirect('/admin/product');
    } else {
      const categories = await categoryService.getCategories(); 
      return res.render('admin/productManagement/form', {categories, EntityStatus, errors: [
        {
          path: 'images',
          msg: getTranslatedMessage('error.cantUploadImages', req.query.lng),
        },
      ]});
    }
  }),
];
