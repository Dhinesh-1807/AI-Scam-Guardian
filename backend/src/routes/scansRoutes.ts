import { Router } from 'express';
import {
  deleteScanController,
  getScanByIdController,
  getScansController,
} from '../controllers/scansController.js';

const router = Router();

router.get('/', getScansController);
router.get('/:id', getScanByIdController);
router.delete('/:id', deleteScanController);

export default router;
