import asyncHandler from 'express-async-handler';
import { checkIsAdmin, checkLoggedIn } from '../middlewares';
import { Request, Response } from 'express';
import * as orderService from '../services/order.service';
import { OrderStatus } from '../constants';

interface IAdminOverviewRequest extends Request {
  user?: any;
}

export const getOverview = [
  checkLoggedIn,
  checkIsAdmin,
  asyncHandler(async(req: IAdminOverviewRequest, res: Response) => {
    const currentDate = new Date();

    const month = currentDate.getMonth() + 1;

    const orderData = await orderService.getCountAndTotalRevenueEachMonthInCurrentYear();

    const monthOrder = orderData.find(data => data.month === month);

    const totalOrder = {
      total: 0,
      count: 0,
    };

    orderData.forEach(order => {
      totalOrder.total += order.data.total;
      totalOrder.count += order.data.count;
    });

    const orders = await orderService.getOrders(req.user, req.query);

    return res.render('admin/overview/index', {monthOrder, totalOrder, orders: orders.orders, OrderStatus, orderData});
  }),
];
