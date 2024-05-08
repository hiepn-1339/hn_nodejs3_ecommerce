import express from 'express';
const router = express.Router();
import * as adminProductController from '../../controllers/admin.product.controller';

router.get('/', adminProductController.getProducts);
export default router;
