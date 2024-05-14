import express from 'express';
const router = express.Router();
import * as adminOverviewController from '../../controllers/admin.overview.controller';

router.get('/', adminOverviewController.getOverview);
export default router;
