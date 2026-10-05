import { LLMScamAnalyzer } from './llmAnalyzer.js';
import { LocalScamAnalyzer } from './localAnalyzer.js';
import { ScamAnalyzer } from './types.js';

export function getScamAnalyzer(): ScamAnalyzer {
  const provider = (process.env.AI_PROVIDER || 'local').toLowerCase();

  if (provider === 'llm' && process.env.LLM_API_KEY) {
    console.log('🤖 Initializing External LLM AI Provider (with Local Fallback)');
    return new LLMScamAnalyzer();
  }

  console.log('🛡️ Initializing Local Deterministic AI Scam Engine (Explainable Rules)');
  return new LocalScamAnalyzer();
}
