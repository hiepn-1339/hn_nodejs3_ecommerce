import express from 'express';
const router = express.Router();
import * as productController from '../controllers/product.controller';

router.get('/', productController.getHome);

export default router;
