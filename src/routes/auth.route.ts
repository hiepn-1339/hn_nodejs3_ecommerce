import express from 'express';
const router = express.Router();
import * as authController from '../controllers/auth.controller';

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

export default router;
