import { getTranslatedMessage } from './../utils/i18n';
import asyncHandler from 'express-async-handler';
import * as cartService from '../services/cart.service';
import { checkLoggedIn } from '../utils/auth';
import { Response } from 'express';
import { Status } from '../constants';

export const postAddItemToCart = asyncHandler(async (req: any, res: Response) => {
  const user = checkLoggedIn(req, res);
  const item = await cartService.addItemToCart(user, req.body);

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
});
