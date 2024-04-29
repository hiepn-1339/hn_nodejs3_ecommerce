import { getTranslatedMessage } from './../utils/i18n';
import asyncHandler from 'express-async-handler';
import * as cartService from '../services/cart.service';
import { checkLoggedIn } from '../utils/auth';
import { Request, Response } from 'express';
import { Status } from '../constants';
import { validateUpdateCartItem } from '../middlewares/validate/cart.validate';
import { checkValidId } from '../middlewares';

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const user = checkLoggedIn(req, res);

  const {items, subtotal} = await cartService.getCartItems(user);
  res.render('cart/index', {items, subtotal});
});

export const postAddItemToCart = [
  validateUpdateCartItem,
  asyncHandler(async (req: Request, res: Response) => {
    const user = checkLoggedIn(req, res);
    const item = await cartService.updateItemToCart(user, req.body);

  if (!item) {
    res.send({
      status: Status.FAIL,
      message: getTranslatedMessage('error.addItemToCartFail', req.query.lng),
    });
  } else {
    res.send({
      status: Status.SUCCESS,
      message: getTranslatedMessage('error.addItemToCartSuccess', req.query.lng),
    });
  }
})];

export const deleteCartItem = [
  checkValidId,
  asyncHandler(async(req: Request, res: Response) => {
    checkLoggedIn(req, res);
    await cartService.deleteCartItem(parseInt(req.params.id));
    res.send(Status.SUCCESS);
  }),
];
