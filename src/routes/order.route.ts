import express from 'express';
const router = express.Router();
import * as orderController from '../controllers/order.controller';

router.get('/checkout', orderController.getCheckout);
router.post('/checkout', orderController.postCheckout);
router.post('/:id/cancel', orderController.cancelOrder);
router.get('/:id/rating', orderController.getRating);
router.post('/:id/rating', orderController.postRating);
router.get('/:id', orderController.getOrder);
router.get('/', orderController.getOrders);
export default router;
