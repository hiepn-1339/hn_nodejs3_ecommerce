import express from 'express';
const router = express.Router();
import * as adminOrderController from '../../controllers/admin.order.controller';

router.post('/:id/approve', adminOrderController.approveOrder);
router.post('/:id/complete', adminOrderController.completeOrder);
router.post('/:id/reject', adminOrderController.rejectOrder);
router.get('/', adminOrderController.getOrders);
export default router;
