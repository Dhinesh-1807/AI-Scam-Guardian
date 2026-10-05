import { Request, Response, NextFunction } from 'express';
import { getScamAnalyzer } from '../services/ai/provider.js';
import { storageService } from '../services/storageService.js';

const analyzer = getScamAnalyzer();

export async function analyzeMessageController(req: Request, res: Response, next: NextFunction) {
  try {
    const { message, userId } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a message text to analyze.',
      });
    }

    if (message.length > 8000) {
      return res.status(400).json({
        success: false,
        error: 'Message is too long. Please limit your input to 8,000 characters.',
      });
    }

    // Perform analysis
    const result = await analyzer.analyzeMessage(message);

    // Save scan to history
    const savedScan = await storageService.saveScan({
      userId: userId || null,
      scanType: 'message',
      inputText: message,
      riskScore: result.riskScore,
      riskLevel: result.riskLevel,
      category: result.category,
      confidence: result.confidence,
      explanation: result.explanation,
      scamPattern: result.scamPattern,
      saferAlternative: result.saferAlternative,
      indicators: result.indicators,
      redFlags: result.redFlags,
      suspiciousPhrases: result.suspiciousPhrases,
      recommendations: result.recommendations,
      scoreBreakdown: result.scoreBreakdown,
    });

    return res.status(200).json({
      success: true,
      scanId: savedScan.id,
      ...result,
    });
  } catch (err) {
    return next(err);
  }
}

export async function analyzeUrlController(req: Request, res: Response, next: NextFunction) {
  try {
    const { url, userId } = req.body;

    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a web address (URL) to analyze.',
      });
    }

    if (url.length > 2000) {
      return res.status(400).json({
        success: false,
        error: 'URL exceeds maximum allowable length (2,000 characters).',
      });
    }

    const result = await analyzer.analyzeUrl(url);

    // Save scan to history
    const savedScan = await storageService.saveScan({
      userId: userId || null,
      scanType: 'url',
      inputText: url,
      riskScore: result.riskScore,
      riskLevel: result.riskLevel,
      category: result.riskLevel === 'HIGH' ? 'Phishing Attack' : 'Suspicious URL',
      confidence: 0.94,
      explanation: result.explanation,
      scamPattern: result.characteristics.join(' • '),
      saferAlternative: 'Verify domain name authenticity before entering credentials.',
      recommendations: result.recommendations,
      urlDetails: result,
    });

    return res.status(200).json({
      success: true,
      scanId: savedScan.id,
      ...result,
    });
  } catch (err: any) {
    if (err.message === 'Invalid URL format' || err.message === 'URL cannot be empty') {
      return res.status(400).json({ success: false, error: err.message });
    }
    return next(err);
  }
}
