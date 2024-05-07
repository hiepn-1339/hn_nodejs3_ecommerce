import { NextFunction, Request, Response } from 'express';
import RegisterDTO from '../../dto/user/register.dto';
import { validate } from 'class-validator';
import { Gender, Role, UserStatus } from '../../constants';
import { getTranslatedMessage } from '../../utils/i18n';
import { CreateUserDTO } from '../../dto/user/createUser.dto';
import { UpdateUserDTO } from '../../dto/user/updateUser.dto';
import { IAdminUserRequest } from '../../controllers/admin.user.controller';

export const validateRegisterUser = async (req: Request, res: Response, next: NextFunction) => {
  const userDTO = new RegisterDTO(req.body);

  const errors = await validate(userDTO);

  if (errors.length > 0) {
    const errorMessages = errors.map(error => ({
      path: error.property,
      msg: getTranslatedMessage(Object.values(error.constraints)[0], req.query.lng),
    }));
    return res.render('register', {
      errors: errorMessages,
      genders: Object.keys(Gender),
    });
  }

  next();
};

export const validateCreateUser = async (req: Request, res: Response, next: NextFunction) => {
  const userDTO = new CreateUserDTO(req.body);

  const errors = await validate(userDTO);

  if (errors.length > 0) {
    const errorMessages = errors.map(error => ({
      path: error.property,
      msg: getTranslatedMessage(Object.values(error.constraints)[0], req.query.lng),
    }));
    return res.render('admin/userManagement/form', {
      errors: errorMessages,
      genders: Object.keys(Gender), UserStatus, roles: Object.keys(Role), isUpdate: false,
    });
  }

  next();
};

export const validateUpdateUser = async (req: IAdminUserRequest, res: Response, next: NextFunction) => {
  const userDTO = new UpdateUserDTO(req.body);

  const errors = await validate(userDTO);

  if (errors.length > 0) {
    const errorMessages = errors.map(error => ({
      path: error.property,
      msg: getTranslatedMessage(Object.values(error.constraints)[0], req.query.lng),
    }));
    return res.render('admin/userManagement/form', {
      errors: errorMessages,
      genders: Object.keys(Gender), UserStatus, roles: Object.keys(Role), isUpdate: true, user: req.user,
    });
  }

  next();
};
