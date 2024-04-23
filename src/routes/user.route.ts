import express from 'express';
const router = express.Router();
import * as userController from '../controllers/user.controllder';

router.get('/register', userController.getRegister);
router.post('/register', userController.postRegister);
router.get('/active/:tokenActive', userController.getActive);

export default router;
