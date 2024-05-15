import asyncHandler from 'express-async-handler';
import { IAuthRequest, checkIsAdmin, checkLoggedIn, checkValidId } from '../middlewares';
import * as orderService from '../services/order.service';
import { Response } from 'express';
import { OrderStatus, PaymentMethod, Status } from '../constants';
import { IOrderRequest, checkExistsOrder } from './order.controller';
import { getTranslatedMessage } from '../utils/i18n';
import { sendMailDataToQueue } from '../utils/mail';
import { t } from 'i18next';

export const getOrders = [
  checkLoggedIn,
  checkIsAdmin,
  asyncHandler(async(req: IAuthRequest, res: Response) => {
    const {orders, count} = await orderService.getOrders(req.user, req.query);

    const pages = Math.ceil(count / parseInt(req.query.limit as string));

    return res.render('admin/orderManagement/index', {orders, paymentMethods: Object.keys(PaymentMethod), OrderStatus, pages, page: req.query.page, query: req.query});
  }),
];

export const approveOrder = [
  checkLoggedIn,
  checkIsAdmin,
  checkValidId,
  checkExistsOrder,
  asyncHandler(async(req: IOrderRequest, res: Response) => {
    let data = {
      status: Status.SUCCESS,
      message: getTranslatedMessage('order.approveOrderSuccess', req.query.lng),
    };
    
    if (req.order.status !== OrderStatus.PENDING) {
      data = {
        status: Status.FAIL,
        message: getTranslatedMessage('error.approveOrderFail', req.query.lng),
      }; 
    }

    let order;

    if (data.status === Status.SUCCESS) {
      try {
        order = await orderService.approveOrder(req.order);
      } catch (error) {
        data = {
          status: Status.FAIL,
          message: getTranslatedMessage('error.approveOrderFail', req.query.lng),
        }; 
      }

      const emailData = {
        template: 'approveOrder',
        subject: t('email.order.subject'),
        email: req.order.user.email,
        order,
        content: {
          title: getTranslatedMessage('email.order.approveOrder', req.query.lng),
          message: getTranslatedMessage('email.order.approveOrderMessage', req.query.lng),
          orderId: getTranslatedMessage('email.order.orderId', req.query.lng),
        },
      };
      
      await sendMailDataToQueue(emailData);
    }
    res.send(data);

    return;
  }),
];

export const rejectOrder = [
  checkLoggedIn,
  checkIsAdmin,
  checkValidId,
  checkExistsOrder,
  asyncHandler(async(req: IOrderRequest, res: Response) => {
    let data = {
      status: Status.SUCCESS,
      message: getTranslatedMessage('order.rejectOrderSuccess', req.query.lng),
    };
    
    if (req.order.status !== OrderStatus.PENDING) {
      data = {
        status: Status.FAIL,
        message: getTranslatedMessage('error.rejectOrderFail', req.query.lng),
      }; 
    }

    req.order.reasonReject = req.body.reasonReject;
    
    if (data.status === Status.SUCCESS) {
      const order = await orderService.changeStatusOrder(req.order, OrderStatus.REJECTED);
      const emailData = {
        template: 'rejectOrder',
        subject: t('email.order.subject'),
        email: req.order.user.email,
        order,
        content: {
          title: getTranslatedMessage('email.order.rejectOrder', req.query.lng),
          message: getTranslatedMessage('email.order.rejectOrderMessage', req.query.lng),
          orderId: getTranslatedMessage('email.order.orderId', req.query.lng),
          reasonReject: getTranslatedMessage('email.order.reasonReject', req.query.lng),
        },
      };
  
      await sendMailDataToQueue(emailData);
    }

    res.send(data);
    return;
  }),
];

export const completeOrder = [
  checkLoggedIn,
  checkIsAdmin,
  checkValidId,
  checkExistsOrder,
  asyncHandler(async(req: IOrderRequest, res: Response) => {
    let data = {
      status: Status.SUCCESS,
      message: getTranslatedMessage('order.completeOrderSuccess', req.query.lng),
    };
    
    if (req.order.status !== OrderStatus.APPROVED) {
      data = {
        status: Status.FAIL,
        message: getTranslatedMessage('error.completeOrderFail', req.query.lng),
      }; 
    }
    
    if (data.status === Status.SUCCESS) {
      const order = await orderService.changeStatusOrder(req.order, OrderStatus.COMPLETED);
      const emailData = {
        template: 'rejectOrder',
        subject: t('email.order.subject'),
        email: req.order.user.email,
        order,
        content: {
          title: getTranslatedMessage('email.order.completeOrder', req.query.lng),
          message: getTranslatedMessage('email.order.completeOrderMessage', req.query.lng),
          orderId: getTranslatedMessage('email.order.orderId', req.query.lng),
        },
      };
  
      await sendMailDataToQueue(emailData);
    }

    res.send(data);
    return;
  }),
];
