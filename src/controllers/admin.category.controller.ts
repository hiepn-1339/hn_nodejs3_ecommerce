import { checkIsAdmin, checkLoggedIn } from '../middlewares';
import { Request, Response } from 'express';
import * as categoryService from '../services/category.service';
import asyncHandler from 'express-async-handler';

export const getCategories = [
  checkLoggedIn,
  checkIsAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const {categories, count} = await categoryService.adminGetCategories(req.query);

    const pages = Math.ceil(count / parseInt(req.query.limit as string));

    return res.render('admin/categoryManagement/index', {categories, pages, page: req.query.page, query: req.query});
  }),
];
