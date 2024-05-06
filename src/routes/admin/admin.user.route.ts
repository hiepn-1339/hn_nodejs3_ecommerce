import express from 'express';
const router = express.Router();
import * as adminUserControllers from '../../controllers/admin.user.controller';

router.get('/', adminUserControllers.getUsers);
export default router;
