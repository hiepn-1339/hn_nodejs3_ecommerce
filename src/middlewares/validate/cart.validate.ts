import { NextFunction, Request, Response } from 'express';
import { validate } from 'class-validator';
import { getTranslatedMessage } from '../../utils/i18n';
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
  }

  next();
};
