import express from 'express';
import userRouter from './user.route';
import authRouter from './auth.route';

const router = express.Router();

router.use('/user', userRouter);
router.use('/auth', authRouter);

export default router;
