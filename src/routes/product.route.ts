import express from 'express';
const router = express.Router();
import * as productController from '../controllers/product.controller';

router.get('/product/:id', productController.getDetailProduct);
router.get('/', productController.getHome);

export default router;
