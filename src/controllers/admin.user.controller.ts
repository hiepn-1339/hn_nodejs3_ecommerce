import asyncHandler from 'express-async-handler';
import { checkIsAdmin, checkLoggedIn } from '../middlewares';
import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { Gender, UserStatus } from '../constants';

export const getUsers = [
  checkLoggedIn,
  checkIsAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const {users, count} = await userService.getUsers();

    const pages = Math.ceil(count / parseInt(req.query.limit as string));

    return res.render('admin/userManagement/index', {users, genders: Object.keys(Gender), statuses: Object.keys(UserStatus), pages, page: req.query.page});
  }),
];
