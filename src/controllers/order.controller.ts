import asyncHandler from 'express-async-handler';
import { NextFunction, Response } from 'express';
import { ErrorCode, OrderStatus, PaymentMethod, Status } from '../constants';
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
import { OrderItem } from '../entities/orderItem.entity';
import * as ratingService from '../services/rating.service';
import config from '../config';

export interface IOrderRequest extends IAuthRequest {
  errors?: Array<{path: string, msg: string}>;
  file?: any;
  order: Order;
}

export const getCheckout = [
  checkLoggedIn,
  asyncHandler (async (req: IAuthRequest, res: Response) => {
    const { items, subtotal } = await cartService.getCartItems(req.user);

    let coupon: Coupon = null;
    let total = subtotal;
    if (req.query.coupon) {
      coupon = await couponService.findCouponByName(req.query.coupon as string || null);
      total = subtotal * (100 - coupon.percentage) / 100;
    }

    return res.render('checkout/index', {subtotal, total, paymentMethods: Object.keys(PaymentMethod), coupon, items, bank: {
      name: config.bankName,
      number: config.bankNumber,
    }});
  }),
];

class ProcessOrder {
  @Transactional()
  static async processOrder(req: IOrderRequest, res: Response) {
    const { items, subtotal } = await cartService.getCartItems(req.user);

    if (items.length === 0) {
      return res.redirect('/order/checkout');
    } 

    let coupon: Coupon = null;
    let total = subtotal;
    if (req.query.coupon) {
      coupon = await couponService.findCouponByName(req.query.coupon as string || null);
      total = subtotal * (100 - coupon.percentage) / 100;
    }

    if (req.errors) {
      return res.render('checkout/index', {subtotal, total, paymentMethods: Object.keys(PaymentMethod), coupon, errors: req.errors, items, bank: {
        name: config.bankName,
        number: config.bankNumber,
      }});
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
      subject: getTranslatedMessage('email.order.subject', req.query.lng),
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
        email: getTranslatedMessage('email.order.email', req.query.lng),
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

export const checkExistsOrder = async (req: IOrderRequest, res: Response, next: NextFunction) => {
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

export const cancelOrder = [
  checkLoggedIn,
  checkValidId,
  checkExistsOrder,
  asyncHandler (async (req: IOrderRequest, res: Response) => {
    let data = {
      status: Status.SUCCESS,
      message: getTranslatedMessage('order.cancelOrderSuccess', req.query.lng),
    };
    
    if (req.order.status !== OrderStatus.PENDING) {
      data = {
        status: Status.FAIL,
        message: getTranslatedMessage('error.cancelOrderFail', req.query.lng),
      }; 
    }

    if (data.status === Status.SUCCESS) {
      await orderService.changeStatusOrder(req.order, OrderStatus.CANCELLED);
    }

    res.send(data);
    return;
  }),
];

export const getRating = [
  checkLoggedIn,
  checkValidId,
  checkExistsOrder,
  asyncHandler (async (req: IOrderRequest, res: Response) => {
    if (req.order.status !== OrderStatus.COMPLETED) {
      return res.redirect('/order');
    }

    const orderItems = await orderService.getOrderItems(req.order);

    return res.render('rating/index', {orderItems});
  }),
];

export const postRating = [
  checkLoggedIn,
  checkValidId,
  checkExistsOrder,
  asyncHandler (async (req: IOrderRequest, res: Response) => {
    if (req.order.status !== OrderStatus.COMPLETED) {
      return res.redirect('/order');
    }

    const orderItem: OrderItem = await orderService.getOrderItemById(req.body.orderItemId);

    if (!orderItem) {
      res.send({
        status: Status.FAIL,
        message: getTranslatedMessage('error.orderItemNotFound', req.query.lng),
      });
      return;
    }

    if (orderItem.isReviewed) {
      res.send({
        status: Status.FAIL,
        message: getTranslatedMessage('error.orderItemAlreadyReviewed', req.query.lng),
      });
      return;
    }

    await ratingService.createRating(req.user, orderItem, req.body);

    res.send({
      status: Status.SUCCESS,
      message: getTranslatedMessage('order.ratingSuccess', req.query.lng),
    });
    return;
  }),
];
