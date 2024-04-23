import { NextFunction, Request, Response } from 'express';
import RegisterDTO from '../../dto/user/register.dto';
import { validate } from 'class-validator';
import { Gender } from '../../constants';
import { getTranslatedMessage } from '../../utils/i18n';

export const validateRegisterUser = async (req: Request, res: Response, next: NextFunction) => {
  const userDTO = new RegisterDTO(req.body);

  const errors = await validate(userDTO);

  if (errors.length > 0) {
    const errorMessages = errors.map(error => ({
      path: error.property,
      msg: getTranslatedMessage(Object.values(error.constraints)[0], req.query.lng),
    }));
    res.render('register', {
      errors: errorMessages,
      genders: Object.keys(Gender),
    });
  }

  next();
};
