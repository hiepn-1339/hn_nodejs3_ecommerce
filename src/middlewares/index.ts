import { Request, Response, NextFunction } from 'express';
import { t } from 'i18next';
import { ErrorCode, Query } from '../constants';
import { User } from '../entities/user.entity';

export const checkValidId = (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.render('error/index', { code: ErrorCode.BAD_REQUEST, title: t('error.invalidId'), message: t('error.idMustBeANumber') });
    return;
  }

  next();
};

export const setPaginateQuery = (req: Request, res: Response, next: NextFunction) => {
  const page = req.query.page || Query.PAGE_DEFAULT;
  const limit = req.query.limit || Query.LIMIT_DEFAULT;

  req.query.page = page as string;
  req.query.limit = limit as string;

  next();
};

export interface IAuthRequest extends Request {
  session?: any;
  user?: User;
}

export const checkLoggedIn = (req: IAuthRequest, res: Response, next: NextFunction) => {
  const user = req.session.user;
  if (!user) {
    res.redirect('/auth/login');
    return;
  }

  req.user = user;

  next();
};
