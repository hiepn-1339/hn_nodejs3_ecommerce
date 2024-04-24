import express from 'express';
import userRouter from './user.route';
import authRouter from './auth.route';
import productRouter from './product.route';

const router = express.Router();

router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/', productRouter);

export default router;
