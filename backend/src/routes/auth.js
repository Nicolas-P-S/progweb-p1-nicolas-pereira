import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { autenticar } from '../middleware/autenticar.js';

const router = Router();

router.post('/registrar', authController.registrar);
router.post('/login', authController.login);
router.get('/me', autenticar, authController.eu);

export default router;