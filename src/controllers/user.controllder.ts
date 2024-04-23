import { Request, Response } from 'express';
import { Gender } from '../constants';
import { uploadImage } from '../middlewares/multer.middleware';
import { User } from '../entities/user.entity';
import * as userService from '../services/user.service';
import * as cartService from '../services/cart.service';
import { t } from 'i18next';
import { sendEmail } from '../utils/mail';
import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import { getTranslatedMessage } from '../utils/i18n';
import { validateRegisterUser } from '../middlewares/validate/user.validate';

interface IUserRequest extends Request {
  user?: User;
  file?: any;
}

export const getRegister = (req: Request, res: Response) => {
  return res.render('register/index', {genders: Object.keys(Gender)});
};

export const postRegister = [
  validateRegisterUser,
  uploadImage.single('avatar'),
  asyncHandler(async (req: IUserRequest, res: Response) => {
    const existsUser = await userService.getUserByEmail(req.body.email);

    if (existsUser) {
      res.render('register', {
        errors: [{
          path: 'email',
          msg: getTranslatedMessage('error.emailAlreadyExists', req.query.lng),
        }],
        genders: Object.keys(Gender),
      });
    }
    
    if (req.file) {
      req.body.avatar = req.file.location;
      const {user, tokenActive} = await userService.createAccount(req.body);
      const activeURL = `${req.protocol}://${req.get(
        'host',
      )}/user/active/${tokenActive}`;

      const emailData = {
        subject: t('email.active.subject'),
        email: user.email,
        content: {
          activeURL,
          welcome: getTranslatedMessage('email.active.welcome', req.query.lng),
          text: getTranslatedMessage('email.active.text', req.query.lng),
          autoGenerate: getTranslatedMessage('email.active.autoGenerate', req.query.lng),
          cheers: getTranslatedMessage('email.active.cheers', req.query.lng),
          fruitablesTeam: getTranslatedMessage('email.active.fruitablesTeam', req.query.lng),
          confirmAccount: getTranslatedMessage('email.active.confirmAccount', req.query.lng),
        },
      };

      await sendEmail(emailData, 'activeAccount');

      await cartService.createCart(user);
      return res.render('emailConfirm/index', {email: user.email});
    } else {
      res.render('register', {
        avatarError: getTranslatedMessage('error.cantUploadAvatar', req.query.lng),
        genders: Object.keys(Gender),
      });
    }
  }),
];

export const getActive = [
  asyncHandler(async (req: IUserRequest, res: Response) => {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.tokenActive)
      .digest('hex');

    const user = await userService.checkValidTokenActive(hashedToken);

    if (!user) {
      throw new Error(t('error.activeTokenIsInvalidOrHasExpired'));
    }

    await userService.activeUser(user);

    return res.render('successConfirm/index');
  }),
];
