import asyncHandler from 'express-async-handler';
import { IAuthRequest, checkIsAdmin, checkLoggedIn } from '../middlewares';
import * as orderService from '../services/order.service';
import { Response } from 'express';
import { OrderStatus, PaymentMethod } from '../constants';

export const getOrders = [
  checkLoggedIn,
  checkIsAdmin,
  asyncHandler(async(req: IAuthRequest, res: Response) => {
    const {orders, count} = await orderService.getOrders(req.user, req.query);

    const pages = Math.ceil(count / parseInt(req.query.limit as string));

    return res.render('admin/orderManagement/index', {orders, paymentMethods: Object.keys(PaymentMethod), OrderStatus, pages, page: req.query.page});
  }),
];
