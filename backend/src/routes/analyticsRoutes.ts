import { Router } from 'express';
import { getAnalyticsController } from '../controllers/analyticsController.js';

const router = Router();

router.get('/', getAnalyticsController);

export default router;
