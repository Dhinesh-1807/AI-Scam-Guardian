import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    product: 'AI Scam Guardian',
    tagline: 'Detect the scam before you take the bait.',
    version: '1.0.0',
    provider: process.env.AI_PROVIDER || 'local',
    timestamp: new Date().toISOString(),
  });
});

export default router;
