import asyncHandler from 'express-async-handler';
import { NextFunction, Response } from 'express';
import { ErrorCode, OrderStatus, PaymentMethod } from '../constants';
import * as couponService from '../services/coupon.service';
import { Coupon } from '../entities/coupon.entity';
import { IAuthRequest, checkLoggedIn, checkValidId } from '../middlewares';
import { Transactional } from 'typeorm-transactional';
import { Order } from '../entities/order.entity';
import * as orderService from '../services/order.service';
import * as cartService from '../services/cart.service';
import { uploadImage } from '../middlewares/multer.middleware';
import { getTranslatedMessage } from '../utils/i18n';
import { validateCreateOrder } from '../middlewares/validate/order.validate';
import { sendEmail } from '../utils/mail';
import { t } from 'i18next';

export interface IOrderRequest extends IAuthRequest {
  errors?: Array<{path: string, msg: string}>;
  file?: any;
  order: Order;
}

export const getCheckout = [
  checkLoggedIn,
  asyncHandler (async (req: IAuthRequest, res: Response) => {
    const { items, subtotal } = await cartService.getCartItems(req.user);

    const coupon: Coupon = await couponService.findCouponByName(req.query.coupon as string);

    const total = subtotal * (100 - coupon.percentage) / 100;

    return res.render('checkout/index', {subtotal, total, paymentMethods: Object.keys(PaymentMethod), coupon, items });
  }),
];

class ProcessOrder {
  @Transactional()
  static async processOrder(req: IOrderRequest, res: Response) {
    const { items, subtotal } = await cartService.getCartItems(req.user);

    const coupon: Coupon = await couponService.findCouponByName(req.query.coupon as string);

    const total = subtotal * (100 - coupon.percentage) / 100;

    if (req.errors) {
      return res.render('checkout/index', {subtotal, total, paymentMethods: Object.keys(PaymentMethod), coupon, errors: req.errors, items });
    }
    
    const data = {
      user: req.user,
      coupon,
      total,
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      paymentMethod: req.body.paymentMethod,
      address: req.body.address,
      note: req.body.note,
      proof: req.body.proof,
    };
    
    const order: Order = await orderService.createOrder(data);

    const orderItems = await orderService.createOrderItems(items, order);

    await cartService.deleteAllCartItems(req.user);

    const emailData = {
      subject: t('email.order.subject'),
      email: req.user.email,
      order,
      orderItems, 
      coupon,
      subtotal,
      total,
      content: {
        title: getTranslatedMessage('email.order.thankyou', req.query.lng),
        message: getTranslatedMessage('email.order.message', req.query.lng),
        orderId: getTranslatedMessage('email.order.orderId', req.query.lng),
        product: getTranslatedMessage('email.order.product', req.query.lng),
        quantity: getTranslatedMessage('email.order.quantity', req.query.lng),
        price: getTranslatedMessage('email.order.price', req.query.lng),
        coupon: getTranslatedMessage('email.order.coupon', req.query.lng),
        total: getTranslatedMessage('email.order.total', req.query.lng),
        subtotal: getTranslatedMessage('email.order.subtotal', req.query.lng),
        name: getTranslatedMessage('email.order.name', req.query.lng),
        phone: getTranslatedMessage('email.order.phone', req.query.lng),
        address: getTranslatedMessage('email.order.address', req.query.lng),
        thanks: getTranslatedMessage('email.order.thanks', req.query.lng),
        fruitablesTeam: getTranslatedMessage('email.active.fruitablesTeam', req.query.lng),
      },
    };

    await sendEmail(emailData, 'order');

    return res.render('order/success');
  }
}

export const postCheckout = [
  checkLoggedIn,
  uploadImage.single('proof'),
  validateCreateOrder,
  asyncHandler (async (req: IOrderRequest, res: Response) => {
    if (req.file) {
      req.body.proof = req.file.location;
    } else {
      if (req.body.paymentMethod === PaymentMethod.BANK_TRANSFER) {
        res.send({
          path: 'proof',
          msg: getTranslatedMessage('error.proofRequired', req.query.lng),
        });
        return;
      }
    }

    return await ProcessOrder.processOrder(req, res);
  }),
];

export const getOrders = [
  checkLoggedIn,
  asyncHandler (async (req: IAuthRequest, res: Response) => {
    const {orders, count} = await orderService.getOrders(req.user, req.query);

    const pages = Math.ceil(count / parseInt(req.query.limit as string));

    return res.render('order/index', {orders, paymentMethods: Object.keys(PaymentMethod), OrderStatus, pages, page: req.query.page});
  }),
];

const checkExistsOrder = async (req: IOrderRequest, res: Response, next: NextFunction) => {
  const order = await orderService.getOrderById(parseInt(req.params.id));
  if (order === null) {
    res.render('error', { code: ErrorCode.NOT_FOUND, title: t('error.notFound'), message: t('error.notFound') });
  }

  req.order = order;
  next();
};

export const getOrder = [
  checkLoggedIn,
  checkValidId,
  checkExistsOrder,
  asyncHandler (async (req: IOrderRequest, res: Response) => {
    const orderItems = await orderService.getOrderItems(req.order);

    let subtotal = 0;

    orderItems.forEach((item) => {
      subtotal += item.price * item.quantity;
    });

    return res.render('order/detail', {subtotal, coupon: req.order.coupon, items: orderItems, order: req.order });
  }),
];
