import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { validateLoginUser } from '../middlewares/validate/auth.validate';
import { getTranslatedMessage } from '../utils/i18n';
import * as userService from '../services/user.service';
import bcrypt from 'bcrypt';
import { Role } from '../constants';

export const getLogin = (req: Request, res: Response) =>{
  return res.render('login/index');
};

export const postLogin = [
  validateLoginUser,
  asyncHandler(async (req: any, res: Response) => {
    const user = await userService.getUserByEmail(req.body.email);

    if (!user || !await bcrypt.compare(req.body.password, user.password)) {
      res.render('login/index', {
        errors: [{
          path: 'email',
          msg: getTranslatedMessage('error.wrongEmailOrPassword', req.query.lng),
        }],
      });
    }

    req.session.user = user;
    if (user.role === Role.ADMIN) {
      return res.redirect('/admin/order');
    }
    return res.redirect('/');
  }),
];

export const getLogout = (req: any, res: Response) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
};
