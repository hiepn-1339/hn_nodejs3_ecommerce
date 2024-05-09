import express from 'express';
const router = express.Router();
import * as adminProductController from '../../controllers/admin.product.controller';

router.get('/create', adminProductController.getCreateProduct);
router.post('/create', adminProductController.postCreateProduct);
router.get('/', adminProductController.getProducts);
export default router;
