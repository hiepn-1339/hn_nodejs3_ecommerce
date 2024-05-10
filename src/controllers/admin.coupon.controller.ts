import asyncHandler from 'express-async-handler';
import { checkIsAdmin, checkLoggedIn } from '../middlewares';
import * as couponService from '../services/coupon.service';
import { Request, Response } from 'express';

export const getCoupons = [
  checkLoggedIn,
  checkIsAdmin,
  asyncHandler(async(req: Request, res: Response) => {
    const {coupons, count} = await couponService.getCoupons(req.query);

    const pages = Math.ceil(count / parseInt(req.query.limit as string));

    return res.render('admin/couponManagement/index', {coupons, pages, page: req.query.page, query: req.query});
  }),
];
