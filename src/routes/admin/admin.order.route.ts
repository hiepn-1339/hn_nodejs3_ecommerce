import express from 'express';
const router = express.Router();
import * as adminOrderController from '../../controllers/admin.order.controller';

router.get('/', adminOrderController.getOrders);
export default router;
