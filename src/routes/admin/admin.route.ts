import express from 'express';
import adminOrderRoute from './admin.order.route';
import adminUserRoute from './admin.user.route';
import adminCategoryRoute from './admin.category.route';
import adminProductRoute from './admin.product.route';
import adminCouponRoute from './admin.coupon.route';
import adminOverviewRoute from './admin.overview.route';

const router = express.Router();

router.use('/order', adminOrderRoute);
router.use('/user', adminUserRoute);
router.use('/category', adminCategoryRoute);
router.use('/product', adminProductRoute);
router.use('/coupon', adminCouponRoute);
router.use('/overview', adminOverviewRoute);

export default router;
