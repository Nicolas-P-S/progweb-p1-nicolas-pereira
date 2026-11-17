import { Router } from 'express';
import { objetivoController } from '../controllers/objetivoController.js';

const router = Router();

router.get('/', objetivoController.listar);
router.get('/:id', objetivoController.buscarPorId);
router.post('/', objetivoController.criar);
router.put('/:id', objetivoController.atualizar);
router.delete('/:id', objetivoController.remover);

export default router;