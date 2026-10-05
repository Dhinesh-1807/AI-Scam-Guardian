import { Request, Response, NextFunction } from 'express';
import { storageService } from '../services/storageService.js';

export async function getAnalyticsController(req: Request, res: Response, next: NextFunction) {
  try {
    const analytics = await storageService.getAnalytics();

    return res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (err) {
    return next(err);
  }
}
