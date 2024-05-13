import asyncHandler from 'express-async-handler';
import { checkIsAdmin, checkLoggedIn } from '../middlewares';
import * as couponService from '../services/coupon.service';
import { NextFunction, Request, Response } from 'express';
import { getTranslatedMessage } from '../utils/i18n';
import { Status } from '../constants';
import { validateCreateCoupon } from '../middlewares/validate/coupon.validate';

interface IAdminCouponRequest extends Request {
  coupon?: any;
  errors?: any[];
}

export const getCoupons = [
  checkLoggedIn,
  checkIsAdmin,
  asyncHandler(async(req: Request, res: Response) => {
    const {coupons, count} = await couponService.getCoupons(req.query);

    const pages = Math.ceil(count / parseInt(req.query.limit as string));

    return res.render('admin/couponManagement/index', {coupons, pages, page: req.query.page, query: req.query});
  }),
];

const checkExistsCouponByName = async(req: IAdminCouponRequest, res: Response, next: NextFunction) => {
  const coupon = await couponService.getCouponByName(req.body.name);

  if (coupon) {
    res.send({
      status: Status.FAIL,
      errors: [
        {
          path: 'name',
          msg: getTranslatedMessage('error.nameExists', req.query.lng),
        },
      ],
    });
    return;
  }

  next();
};

export const postCreateCoupon = [
  checkLoggedIn,
  checkIsAdmin,
  validateCreateCoupon,
  checkExistsCouponByName,
  asyncHandler(async(req: IAdminCouponRequest, res: Response) => {
    await couponService.createCoupon(req.body);

    res.send({
      status: Status.SUCCESS,
      message: getTranslatedMessage('admin.coupon.createSuccess', req.query.lng),
    });

    return;
  }),
];
