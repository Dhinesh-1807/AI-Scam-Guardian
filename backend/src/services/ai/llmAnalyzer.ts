import { AnalysisResult, UrlAnalysisResult } from '../../types/scam.js';
import { LocalScamAnalyzer } from './localAnalyzer.js';
import { ScamAnalyzer } from './types.js';

export class LLMScamAnalyzer implements ScamAnalyzer {
  public name = 'External LLM Analysis Provider';
  private localFallback = new LocalScamAnalyzer();

  private apiKey: string;
  private apiBase: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.LLM_API_KEY || '';
    this.apiBase = process.env.LLM_API_BASE || 'https://api.openai.com/v1';
    this.model = process.env.LLM_MODEL || 'gpt-4o-mini';
  }

  public async analyzeMessage(message: string): Promise<AnalysisResult> {
    // If no API key configured, use transparent local analyzer fallback
    if (!this.apiKey) {
      console.log('ℹ️ LLM_API_KEY not configured. Falling back seamlessly to local AI analyzer.');
      return this.localFallback.analyzeMessage(message);
    }

    try {
      const systemPrompt = `You are AI Scam Guardian, an expert cybersecurity assistant.
Analyze the user's message for scam indicators, social engineering, urgency, credential harvesting, financial fraud, and phishing.
Return ONLY valid JSON matching this exact structure:
{
  "riskScore": number (0-100),
  "riskLevel": "SAFE" | "SUSPICIOUS" | "HIGH",
  "category": string (e.g. "Prize / Reward Scam", "Banking Scam", "Job / Recruitment Scam", "Safe Communication"),
  "confidence": number (e.g. 0.95),
  "redFlags": string[],
  "suspiciousPhrases": [{"phrase": string, "category": string, "riskWeight": number}],
  "recommendations": string[],
  "explanation": string (simple language, non-technical, responsible language),
  "indicators": {
    "urgency": boolean,
    "financialRequest": boolean,
    "credentialRequest": boolean,
    "suspiciousLink": boolean,
    "impersonation": boolean,
    "unrealisticPromise": boolean
  },
  "scamPattern": string (e.g. "Urgency + Reward + Payment Request"),
  "saferAlternative": string (practical safe alternative action),
  "scoreBreakdown": [
    {"factor": string, "points": number, "description": string, "detected": boolean}
  ]
}
Important: Never state "This message is definitely a scam". Use responsible phrases like "High-risk message detected", "Suspicious indicators found".`;

      const response = await fetch(`${this.apiBase}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message },
          ],
          temperature: 0.1,
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        throw new Error(`LLM API returned status ${response.status}`);
      }

      const data = (await response.json()) as any;
      const parsed = JSON.parse(data.choices[0].message.content);

      // Sanitize and ensure valid fields
      const result: AnalysisResult = {
        riskScore: Math.min(100, Math.max(0, parsed.riskScore || 0)),
        riskLevel: parsed.riskScore >= 60 ? 'HIGH' : parsed.riskScore >= 30 ? 'SUSPICIOUS' : 'SAFE',
        category: parsed.category || 'Potential Scam',
        confidence: parsed.confidence || 0.92,
        redFlags: Array.isArray(parsed.redFlags) ? parsed.redFlags : [],
        suspiciousPhrases: Array.isArray(parsed.suspiciousPhrases) ? parsed.suspiciousPhrases : [],
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
        explanation: parsed.explanation || 'Analysis completed with AI assessment.',
        indicators: parsed.indicators || {
          urgency: false,
          financialRequest: false,
          credentialRequest: false,
          suspiciousLink: false,
          impersonation: false,
          unrealisticPromise: false,
        },
        scamPattern: parsed.scamPattern || 'Pattern Detected',
        saferAlternative: parsed.saferAlternative || 'Verify with official entity directly.',
        scoreBreakdown: Array.isArray(parsed.scoreBreakdown) ? parsed.scoreBreakdown : [],
        analyzedAt: new Date().toISOString(),
        urlsFound: [],
      };

      return result;
    } catch (err) {
      console.warn('⚠️ Error calling external LLM API, falling back to local analyzer:', err);
      return this.localFallback.analyzeMessage(message);
    }
  }

  public async analyzeUrl(url: string): Promise<UrlAnalysisResult> {
    // For URL safety, use heuristic analyzer with threat intelligence checks
    return this.localFallback.analyzeUrl(url);
  }
}
