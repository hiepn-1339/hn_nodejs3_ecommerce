import express from 'express';
import adminOrderRoute from './admin.order.route';
import adminUserRoute from './admin.user.route';
import adminCategoryRoute from './admin.category.route';

const router = express.Router();

router.use('/order', adminOrderRoute);
router.use('/user', adminUserRoute);
router.use('/category', adminCategoryRoute);

export default router;
