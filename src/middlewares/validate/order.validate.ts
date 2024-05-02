import { Response, NextFunction } from 'express';
import { CreateOrderDTO } from '../../dto/order/createOrder.dto';
import { getTranslatedMessage } from '../../utils/i18n';
import { validate } from 'class-validator';
import { IOrderRequest } from '../../controllers/order.controller';

export const validateCreateOrder = async (req: IOrderRequest, res: Response, next: NextFunction) => {
  const createOrderDTO = new CreateOrderDTO(req.body);

  const errors = await validate(createOrderDTO);

  if (errors.length > 0) {
    const errorMessages = errors.map(error => ({
      path: error.property,
      msg: getTranslatedMessage(Object.values(error.constraints)[0], req.query.lng),
    }));

    req.errors = errorMessages;
  }

  next();
};
