import express from 'express';
import adminOrderRoute from './admin.order.route';

const router = express.Router();

router.use('/order', adminOrderRoute);

export default router;
