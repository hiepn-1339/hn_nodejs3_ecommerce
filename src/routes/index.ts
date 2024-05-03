import express from 'express';
import userRouter from './user.route';
import authRouter from './auth.route';
import productRouter from './product.route';
import cartRouter from './cart.route';
import orderRouter from './order.route';
import adminRouter from './admin/admin.route';

const router = express.Router();

router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/cart', cartRouter);
router.use('/order', orderRouter);
router.use('/admin', adminRouter);
router.use('/', productRouter);

export default router;
