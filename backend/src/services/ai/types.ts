import { AnalysisResult, UrlAnalysisResult } from '../../types/scam.js';

export interface ScamAnalyzer {
  name: string;
  analyzeMessage(message: string): Promise<AnalysisResult>;
  analyzeUrl(url: string): Promise<UrlAnalysisResult>;
}
