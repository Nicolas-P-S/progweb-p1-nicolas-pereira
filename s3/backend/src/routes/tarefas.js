import { Router } from 'express';
import { tarefaController } from '../controllers/tarefaController.js';

const router = Router();

router.get('/', tarefaController.listar);
router.get('/:id', tarefaController.buscarPorId);
router.post('/', tarefaController.criar);
router.put('/:id', tarefaController.atualizar);
router.delete('/:id', tarefaController.remover);

export default router;