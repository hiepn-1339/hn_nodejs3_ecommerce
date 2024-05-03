import { getTranslatedMessage } from './../utils/i18n';
import asyncHandler from 'express-async-handler';
import * as cartService from '../services/cart.service';
import { Request, Response } from 'express';
import { Status } from '../constants';
import { validateUpdateCartItem } from '../middlewares/validate/cart.validate';
import { IAuthRequest, checkLoggedIn, checkValidId } from '../middlewares';
import * as couponService from '../services/coupon.service';
import { Coupon } from '../entities/coupon.entity';
import { validateApplyCoupon } from '../middlewares/validate/cart.validate';

export interface ICartRequest extends IAuthRequest {
  errors?: Array<{path: string, msg: string}>;
}

export const getCart = [
  checkLoggedIn,
  asyncHandler(async (req: IAuthRequest, res: Response) => {
  const {items, subtotal} = await cartService.getCartItems(req.user);

  res.render('cart/index', {items, subtotal, total: subtotal});
}),
];

export const postAddItemToCart = [
  checkLoggedIn,
  validateUpdateCartItem,
  asyncHandler(async (req: IAuthRequest, res: Response) => {
    const item = await cartService.updateItemToCart(req.user, req.body);

    let data = {
      status: Status.SUCCESS,
      message: getTranslatedMessage('error.addItemToCartSuccess', req.query.lng),
    };

    if (!item) {
      data = {
        status: Status.FAIL,
        message: getTranslatedMessage('error.addItemToCartFail', req.query.lng),
      };
    }

    res.send(data);

    return;
  }),
];

export const deleteCartItem = [
  checkLoggedIn,
  checkValidId,
  asyncHandler(async(req: Request, res: Response) => {
    await cartService.deleteCartItem(parseInt(req.params.id));
    res.send(Status.SUCCESS);
  }),
];

export const postApplyCoupon = [
  checkLoggedIn,
  validateApplyCoupon,
  asyncHandler(async(req: ICartRequest, res: Response) => {
    const {items, subtotal} = await cartService.getCartItems(req.user);

    let total = subtotal;

    if (req.errors) {
      res.render('cart/index', {
        items,
        subtotal,
        total,
        errors: req.errors,
      });
      return;
    }

    const coupon: Coupon = await couponService.findCouponByName(req.body.name);

    if (!coupon) {
      const error = {
        path: 'name',
        msg: getTranslatedMessage('error.couponNotFound', req.query.lng),
      };
      return res.render('cart/index', {items, subtotal, total, errors: [error]});
    }

    total = subtotal * (100 - coupon.percentage) / 100;

    return res.render('cart/index', {items, subtotal, total, coupon});
  }),
];
