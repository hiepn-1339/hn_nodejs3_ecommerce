import asyncHandler from 'express-async-handler';
import { checkIsAdmin, checkLoggedIn } from '../middlewares';
import * as orderService from '../services/order.service';
import { Request, Response } from 'express';
import { OrderStatus, PaymentMethod } from '../constants';

export const getOrders = [
  checkLoggedIn,
  checkIsAdmin,
  asyncHandler(async(req: Request, res: Response) => {
    const {orders, count} = await orderService.getAllOrders(req.query);

    const pages = Math.ceil(count / parseInt(req.query.limit as string));

    return res.render('admin/orderManagement/index', {orders, paymentMethods: Object.keys(PaymentMethod), OrderStatus, pages, page: req.query.page});
  }),
];
