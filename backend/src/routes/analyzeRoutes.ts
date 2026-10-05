import { Router } from 'express';
import { analyzeMessageController, analyzeUrlController } from '../controllers/analyzeController.js';

const router = Router();

router.post('/message', analyzeMessageController);
router.post('/url', analyzeUrlController);

export default router;
