import express from 'express';
const router = express.Router();
import * as adminCouponController from '../../controllers/admin.coupon.controller';

router.post('/create', adminCouponController.postCreateCoupon);
router.get('/', adminCouponController.getCoupons);
export default router;
