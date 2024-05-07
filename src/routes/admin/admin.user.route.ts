import express from 'express';
const router = express.Router();
import * as adminUserControllers from '../../controllers/admin.user.controller';

router.get('/create', adminUserControllers.getCreateUser);
router.post('/create', adminUserControllers.postCreateUser);
router.get('/', adminUserControllers.getUsers);
export default router;
