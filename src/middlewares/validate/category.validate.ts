import { NextFunction, Request, Response } from 'express';
import { CreateCategoryDTO } from '../../dto/category/createCategory.dto';
import { validate } from 'class-validator';
import { getTranslatedMessage } from '../../utils/i18n';

export const validateCreateCategory = async (req: Request, res: Response, next: NextFunction) => {
  const userDTO = new CreateCategoryDTO(req.body);

  const errors = await validate(userDTO);

  if (errors.length > 0) {
    const errorMessages = errors.map(error => ({
      path: error.property,
      msg: getTranslatedMessage(Object.values(error.constraints)[0], req.query.lng),
    }));
    return res.send(errorMessages[0]);
  }

  next();
};
