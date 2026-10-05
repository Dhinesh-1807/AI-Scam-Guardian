export type RiskLevel = 'SAFE' | 'SUSPICIOUS' | 'HIGH';

export type ScamCategory =
  | 'Prize / Reward Scam'
  | 'Banking Scam'
  | 'OTP / Credential Scam'
  | 'Job / Recruitment Scam'
  | 'Investment / Crypto Scam'
  | 'Delivery / Courier Scam'
  | 'Impersonation Scam'
  | 'Phishing Attack'
  | 'Online Shopping Scam'
  | 'Safe Communication'
  | 'Suspicious Communication';

export interface ScamIndicators {
  urgency: boolean;
  financialRequest: boolean;
  credentialRequest: boolean;
  suspiciousLink: boolean;
  impersonation: boolean;
  unrealisticPromise: boolean;
}

export interface ScoreFactor {
  factor: string;
  points: number;
  description: string;
  detected: boolean;
}

export interface SuspiciousPhrase {
  phrase: string;
  category: string;
  riskWeight: number;
}

export interface AnalysisResult {
  riskScore: number;
  riskLevel: RiskLevel;
  category: string;
  confidence: number;
  redFlags: string[];
  suspiciousPhrases: SuspiciousPhrase[];
  recommendations: string[];
  explanation: string;
  indicators: ScamIndicators;
  scamPattern: string;
  saferAlternative: string;
  scoreBreakdown: ScoreFactor[];
  analyzedAt: string;
  urlsFound: string[];
  scanId?: string;
}

export interface UrlAnalysisResult {
  url: string;
  riskScore: number;
  riskLevel: RiskLevel;
  domain: string;
  isHttps: boolean;
  hasIpAddress: boolean;
  suspiciousKeywords: string[];
  suspiciousTld: boolean;
  isShortener: boolean;
  excessiveSubdomains: boolean;
  redirectRisk: boolean;
  recommendations: string[];
  explanation: string;
  characteristics: string[];
  analyzedAt: string;
  scanId?: string;
}

export interface ScanRecord {
  id: string;
  userId?: string | null;
  scanType: 'message' | 'url';
  inputText: string;
  riskScore: number;
  riskLevel: RiskLevel;
  category: string;
  confidence: number;
  explanation: string;
  scamPattern?: string;
  saferAlternative?: string;
  indicators?: ScamIndicators;
  redFlags?: string[];
  suspiciousPhrases?: SuspiciousPhrase[];
  recommendations?: string[];
  scoreBreakdown?: ScoreFactor[];
  urlDetails?: Partial<UrlAnalysisResult>;
  createdAt: string;
}

export interface AnalyticsSummary {
  totalScans: number;
  highRiskCount: number;
  suspiciousCount: number;
  safeCount: number;
  averageRiskScore: number;
  highRiskPercentage: number;
  mostCommonCategory: string;
  scansOverTime: { date: string; count: number; highRisk: number }[];
  categoryDistribution: { category: string; count: number; color: string }[];
  riskDistribution: { name: string; value: number; color: string }[];
}

export interface EducationArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  whatItIs: string;
  warningSigns: string[];
  exampleMessage: string;
  attackerGoals: string;
  safetySteps: string[];
  icon: string;
  readTime: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: string;
}
