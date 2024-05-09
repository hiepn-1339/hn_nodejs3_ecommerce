import { Response, NextFunction } from 'express';
import { getTranslatedMessage } from '../../utils/i18n';
import { validate } from 'class-validator';
import { CreateProductDTO } from '../../dto/product/createProduct.dto';
import { IAdminProductRequest } from '../../controllers/admin.product.controller';

export const validateCreateProduct = async (req: IAdminProductRequest, res: Response, next: NextFunction) => {
  const createProductDTO = new CreateProductDTO(req.body);

  const errors = await validate(createProductDTO);

  if (errors.length > 0) {
    const errorMessages = errors.map(error => ({
      path: error.property,
      msg: getTranslatedMessage(Object.values(error.constraints)[0], req.query.lng),
    }));

    req.errors = errorMessages;
  }

  next();
};
