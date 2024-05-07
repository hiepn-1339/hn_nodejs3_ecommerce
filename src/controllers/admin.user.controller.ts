import asyncHandler from 'express-async-handler';
import { checkIsAdmin, checkLoggedIn } from '../middlewares';
import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { Gender, Role, UserStatus } from '../constants';
import { uploadImage } from '../middlewares/multer.middleware';
import { validateCreateUser } from '../middlewares/validate/user.validate';
import { getTranslatedMessage } from '../utils/i18n';
import * as cartService from '../services/cart.service';

interface IAdminUserRequest extends Request {
  file?: any;
}

export const getUsers = [
  checkLoggedIn,
  checkIsAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const {users, count} = await userService.getUsers(req.query);

    const pages = Math.ceil(count / parseInt(req.query.limit as string));

    return res.render('admin/userManagement/index', {users, genders: Object.keys(Gender), statuses: Object.keys(UserStatus), pages, page: req.query.page});
  }),
];

export const getCreateUser = [
  checkLoggedIn,
  checkIsAdmin,
  (req: Request, res: Response) => {
    return res.render('admin/userManagement/form', {genders: Object.keys(Gender), userStatus: Object.keys(UserStatus), roles: Object.keys(Role), isUpdate: false});
  },
];

export const postCreateUser = [
  checkLoggedIn,
  checkIsAdmin,
  uploadImage.single('avatar'),
  validateCreateUser,
  asyncHandler(async (req: IAdminUserRequest, res: Response) => {
    const existsUser = await userService.getUserByEmail(req.body.email);

    if (existsUser) {
      return res.render('admin/userManagement/form', {
        errors: [{
          path: 'email',
          msg: getTranslatedMessage('error.emailAlreadyExists', req.query.lng),
        }],
        genders: Object.keys(Gender), userStatus: Object.keys(UserStatus), roles: Object.keys(Role), isUpdate: false,
      });
    }

    if (req.file) {
      req.body.avatar = req.file.location;
      req.body.isActive = req.body.isActive === UserStatus.ACTIVE ? true : false;
      const user = await userService.adminCreateAccount(req.body);

      await cartService.createCart(user);
      return res.redirect('/admin/user');
    } else {
      res.render('admin/userManagement/form', {
        avatarError: getTranslatedMessage('error.cantUploadAvatar', req.query.lng),
        genders: Object.keys(Gender), userStatus: Object.keys(UserStatus), roles: Object.keys(Role), isUpdate: false,
      });
    }
  }),
];
