import express from 'express';
const router = express.Router();
import * as cartController from '../controllers/cart.controller';

router.post('/apply-coupon', cartController.postApplyCoupon);
router.delete('/:id', cartController.deleteCartItem);
router.post('/update', cartController.postAddItemToCart);
router.get('/', cartController.getCart);

export default router;
