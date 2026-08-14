import { Router } from 'express';
import {
  getPrompts,
  createPrompt,
  updatePrompt,
  deletePrompt,
  reorderPrompts,
  seedPrompts,
  importPrompts,
} from '../controllers/promptController';

const router = Router();

router.get('/', getPrompts);
router.post('/', createPrompt);
router.put('/:id', updatePrompt);
router.delete('/:id', deletePrompt);
router.patch('/reorder', reorderPrompts);
router.post('/seed', seedPrompts);
router.post('/import', importPrompts);

export default router;
