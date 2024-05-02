import express from 'express';
const router = express.Router();
import * as orderController from '../controllers/order.controller';

router.get('/', orderController.getCheckout);
router.post('/', orderController.postCheckout);
export default router;
