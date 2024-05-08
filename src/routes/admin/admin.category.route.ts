import express from 'express';
const router = express.Router();
import * as adminCategoryController from '../../controllers/admin.category.controller';

router.post('/create', adminCategoryController.createCategory);
router.get('/', adminCategoryController.getCategories);
export default router;
