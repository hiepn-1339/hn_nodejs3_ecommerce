import { NextFunction, Request, Response } from 'express';
import { validate } from 'class-validator';
import { getTranslatedMessage } from '../../utils/i18n';
import { LoginDTO } from '../../dto/auth/login.dto';

export const validateLoginUser = async (req: Request, res: Response, next: NextFunction) => {
  const userDTO = new LoginDTO(req.body);

  const errors = await validate(userDTO);

  if (errors.length > 0) {
    const errorMessages = errors.map(error => ({
      path: error.property,
      msg: getTranslatedMessage(Object.values(error.constraints)[0], req.query.lng),
    }));
    res.render('login/index', {
      errors: errorMessages,
    });
  }

  next();
};
