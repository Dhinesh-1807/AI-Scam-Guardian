import { Request, Response, NextFunction } from 'express';
import { storageService } from '../services/storageService.js';

export async function getScansController(req: Request, res: Response, next: NextFunction) {
  try {
    const { riskLevel, search, scanType } = req.query;

    const scans = await storageService.getScans({
      riskLevel: riskLevel as string,
      search: search as string,
      scanType: scanType as string,
    });

    return res.status(200).json({
      success: true,
      count: scans.length,
      data: scans,
    });
  } catch (err) {
    return next(err);
  }
}

export async function getScanByIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : (req.params.id as string);
    const scan = await storageService.getScanById(id);

    if (!scan) {
      return res.status(404).json({
        success: false,
        error: 'Scan record not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: scan,
    });
  } catch (err) {
    return next(err);
  }
}

export async function deleteScanController(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : (req.params.id as string);
    const deleted = await storageService.deleteScan(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Scan record could not be found or was already deleted',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Scan record deleted successfully',
    });
  } catch (err) {
    return next(err);
  }
}
