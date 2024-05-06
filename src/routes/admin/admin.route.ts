import express from 'express';
import adminOrderRoute from './admin.order.route';
import adminUserRoute from './admin.user.route';

const router = express.Router();

router.use('/order', adminOrderRoute);
router.use('/user', adminUserRoute);

export default router;
