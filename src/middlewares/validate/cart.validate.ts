import { Request, Response, NextFunction } from 'express';
import { ApplyCouponDTO } from '../../dto/cart/applyCoupon.dto';
import { getTranslatedMessage } from '../../utils/i18n';
import { validate } from 'class-validator';
import { ICartRequest } from '../../controllers/cart.controller';
import { UpdateCartItemDTO } from '../../dto/cart/updateCartItem.dto';
import { Status } from '../../constants';

export const validateUpdateCartItem = async (req: Request, res: Response, next: NextFunction) => {
  const updateCartItemDTO = new UpdateCartItemDTO(req.body);

  const errors = await validate(updateCartItemDTO);

  if (errors.length > 0) {
    res.send({
      status: Status.FAIL,
      message: getTranslatedMessage('error.addItemToCartFail', req.query.lng),
    });
    return;
  }

  next();
};


export const validateApplyCoupon = async (req: ICartRequest, res: Response, next: NextFunction) => {
  const applyCouponDTO = new ApplyCouponDTO(req.body);

  const errors = await validate(applyCouponDTO);

  if (errors.length > 0) {
    const errorMessages = errors.map(error => ({
      path: error.property,
      msg: getTranslatedMessage(Object.values(error.constraints)[0], req.query.lng),
    }));

    req.errors = errorMessages;
  }

  next();
};
