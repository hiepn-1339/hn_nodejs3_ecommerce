import { NextFunction, Request, Response } from 'express';
import RegisterDTO from '../../dto/user/register.dto';
import { validate } from 'class-validator';
import { Gender, Role, EntityStatus } from '../../constants';
import { getTranslatedMessage } from '../../utils/i18n';
import { CreateUserDTO } from '../../dto/user/createUser.dto';
import { UpdateUserDTO } from '../../dto/user/updateUser.dto';
import { IAdminUserRequest } from '../../controllers/admin.user.controller';
import { ForgotPasswordDTO } from '../../dto/user/forgotPassword.dto';
import ResetPasswordDTO from '../../dto/user/resetPassword.dto';
import ChangePasswordDTO from '../../dto/user/changePassword.dto';
import UpdateProfileDTO from '../../dto/user/updateProfile.dto';

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
      genders: Object.keys(Gender), EntityStatus, roles: Object.keys(Role), isUpdate: false,
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
      genders: Object.keys(Gender), EntityStatus, roles: Object.keys(Role), isUpdate: true, user: req.user,
    });
  }

  next();
};

export const validateForgotPassword = async (req: IAdminUserRequest, res: Response, next: NextFunction) => {
  const forgotPasswordDTO = new ForgotPasswordDTO(req.body);

  const errors = await validate(forgotPasswordDTO);

  if (errors.length > 0) {
    const errorMessages = errors.map(error => ({
      path: error.property,
      msg: getTranslatedMessage(Object.values(error.constraints)[0], req.query.lng),
    }));
    return res.render('forgotPassword/index', {
      errors: errorMessages,
    });
  }

  next();
};

export const validateResetPassword = async (req: IAdminUserRequest, res: Response, next: NextFunction) => {
  const resetPasswordDTO = new ResetPasswordDTO(req.body);

  const errors = await validate(resetPasswordDTO);

  if (errors.length > 0) {
    const errorMessages = errors.map(error => ({
      path: error.property,
      msg: getTranslatedMessage(Object.values(error.constraints)[0], req.query.lng),
    }));
    return res.render('resetPassword/index', {
      errors: errorMessages,
    });
  }

  next();
};

export const validateChangePassword = async (req: IAdminUserRequest, res: Response, next: NextFunction) => {
  const changePasswordDTO = new ChangePasswordDTO(req.body);

  const errors = await validate(changePasswordDTO);

  if (errors.length > 0) {
    const errorMessages = errors.map(error => ({
      path: error.property,
      msg: getTranslatedMessage(Object.values(error.constraints)[0], req.query.lng),
    }));
    res.render('changePassword/index', {
      errors: errorMessages,
    });
    return;
  }

  next();
};

export const validateUpdateProfile = async (req: IAdminUserRequest, res: Response, next: NextFunction) => {
  const updateProfileDTO = new UpdateProfileDTO(req.body);

  const errors = await validate(updateProfileDTO);

  if (errors.length > 0) {
    const errorMessages = errors.map(error => ({
      path: error.property,
      msg: getTranslatedMessage(Object.values(error.constraints)[0], req.query.lng),
    }));
    res.render('profile/index', {
      errors: errorMessages,
      genders: Object.keys(Gender),
    });
    return;
  }

  next();
};
