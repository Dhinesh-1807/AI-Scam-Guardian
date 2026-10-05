import {
  AnalysisResult,
  RiskLevel,
  ScamCategory,
  ScamIndicators,
  ScoreFactor,
  SuspiciousPhrase,
  UrlAnalysisResult,
} from '../../types/scam.js';
import { ScamAnalyzer } from './types.js';

interface KeywordRule {
  pattern: RegExp;
  category: string;
  phrase: string;
  weight: number;
}

export class LocalScamAnalyzer implements ScamAnalyzer {
  public name = 'Local Rule-Based Analysis Engine';

  private urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(?:com|org|net|info|xyz|top|site|buzz|club|online|tk|ml|ga|cf|gq|cc|app|vip|link)[^\s]*)/gi;

  private urgencyKeywords: KeywordRule[] = [
    { pattern: /\b(act now|take action now)\b/i, category: 'Urgency', phrase: 'act now', weight: 15 },
    { pattern: /\b(immediately|instant(?:ly)?)\b/i, category: 'Urgency', phrase: 'immediately', weight: 15 },
    { pattern: /\burgent(?:ly)?\b/i, category: 'Urgency', phrase: 'urgent', weight: 15 },
    { pattern: /\bwithin\s+\d+\s*(?:hours?|hrs?|minutes?|mins?)\b/i, category: 'Urgency', phrase: 'within 24 hours', weight: 18 },
    { pattern: /\b(account\s+will\s+be\s+(?:blocked|suspended|closed|deactivated|frozen|terminated))\b/i, category: 'Urgency', phrase: 'account will be blocked', weight: 22 },
    { pattern: /\b(last chance|final warning|final notice|immediate attention)\b/i, category: 'Urgency', phrase: 'last chance / final warning', weight: 16 },
    { pattern: /\b(expires?\s+(?:today|soon|within))\b/i, category: 'Urgency', phrase: 'expires soon', weight: 14 },
    { pattern: /\b(failure to claim|will result in cancellation)\b/i, category: 'Urgency', phrase: 'failure to claim', weight: 16 },
  ];

  private financialKeywords: KeywordRule[] = [
    { pattern: /\b(send money|wire money|transfer(?:ring)? funds?)\b/i, category: 'Financial', phrase: 'send money / transfer funds', weight: 20 },
    { pattern: /\b(processing fee|administrative charge|registration fee|activation fee|handling fee|advance fee)\b/i, category: 'Financial', phrase: 'processing fee / advance fee', weight: 25 },
    { pattern: /\b(?:pay|deposit|fee\s+of)\s*(?:₹|\$|rs\.?|inr|usd)?\s*\d+/i, category: 'Financial', phrase: 'fee / payment request', weight: 22 },
    { pattern: /\b(upi(?:\s+id|\s+pin)?|gpay|phonepe|paytm)\b/i, category: 'Financial', phrase: 'UPI / payment gateway reference', weight: 14 },
    { pattern: /\b(bank account|credit card|debit card)\b/i, category: 'Financial', phrase: 'bank account / card reference', weight: 12 },
    { pattern: /\b(pay to join|investment required|initial deposit)\b/i, category: 'Financial', phrase: 'pay to join / deposit required', weight: 22 },
  ];

  private credentialKeywords: KeywordRule[] = [
    { pattern: /\b(otp|one[- ]time[- ]password)\b/i, category: 'Credentials', phrase: 'OTP request', weight: 26 },
    { pattern: /\b(password|passcode|secret pin)\b/i, category: 'Credentials', phrase: 'password / PIN request', weight: 26 },
    { pattern: /\b(cvv|cvv2|card security code|expir(?:y|ation) date)\b/i, category: 'Credentials', phrase: 'CVV / card details', weight: 28 },
    { pattern: /\b(verification code|auth code|security code)\b/i, category: 'Credentials', phrase: 'verification code', weight: 24 },
    { pattern: /\b(login to verify|verify your identity via link|confirm your identity)\b/i, category: 'Credentials', phrase: 'login to verify', weight: 20 },
  ];

  private prizeKeywords: KeywordRule[] = [
    { pattern: /\b(congratulations|congrats)\b/i, category: 'Prize', phrase: 'congratulations', weight: 12 },
    { pattern: /\b(you\s+(?:have\s+)?won|selected to receive|declared winner|lucky draw)\b/i, category: 'Prize', phrase: 'selected to receive reward', weight: 22 },
    { pattern: /\b(cash prize|jackpot|lottery|reward of|claim your prize|claim reward)\b/i, category: 'Prize', phrase: 'cash prize / reward claim', weight: 20 },
    { pattern: /\b(?:₹|\$|rs\.?)\s*[\d,]+(?:\s*(?:reward|prize|cash|gift|voucher))?\b/i, category: 'Prize', phrase: 'monetary prize figure', weight: 16 },
  ];

  private jobKeywords: KeywordRule[] = [
    { pattern: /\b(work from home|part[- ]time job|earn from home)\b/i, category: 'Job', phrase: 'work from home offer', weight: 14 },
    { pattern: /\b(guaranteed (?:salary|income|daily payout))\b/i, category: 'Job', phrase: 'guaranteed salary', weight: 22 },
    { pattern: /\bearn\s*(?:₹|\$|rs\.?)?\s*[\d,]+\s*(?:daily|per day|hourly|per hour|per task)\b/i, category: 'Job', phrase: 'earn per day / per task promise', weight: 18 },
    { pattern: /\b(youtube video likes?|telegram task|rate hotels?|review products?)\b/i, category: 'Job', phrase: 'unrealistic micro-task employment', weight: 20 },
    { pattern: /\b(registration fee for job|pay before interview|equipment deposit)\b/i, category: 'Job', phrase: 'registration fee for job', weight: 26 },
  ];

  private investmentKeywords: KeywordRule[] = [
    { pattern: /\b(guaranteed returns?|risk[- ]free returns?|100% safe return)\b/i, category: 'Investment', phrase: 'guaranteed returns', weight: 25 },
    { pattern: /\b(double your money|2x in \d+|triple your investment)\b/i, category: 'Investment', phrase: 'double your money promise', weight: 26 },
    { pattern: /\b(crypto profit|forex trading bot|secret trading group|vip signals)\b/i, category: 'Investment', phrase: 'crypto / forex high yield promise', weight: 20 },
    { pattern: /\b(fixed daily return|high yield investment|daily compound)\b/i, category: 'Investment', phrase: 'fixed high yield return', weight: 22 },
  ];

  private impersonationKeywords: KeywordRule[] = [
    { pattern: /\b(bank(?:ing)?\s+support|state bank|hdfc|icici|axis|chase|wells fargo)\b/i, category: 'Impersonation', phrase: 'bank authority claim', weight: 16 },
    { pattern: /\b(income tax|customs office|cyber crime|police department|cbi|fbi|court order)\b/i, category: 'Impersonation', phrase: 'government / law enforcement claim', weight: 24 },
    { pattern: /\b(customer support|official service team|helpdesk manager)\b/i, category: 'Impersonation', phrase: 'customer support impersonation', weight: 14 },
    { pattern: /\b(fedex|dhl|india post|ups|courier tracking|customs parcel)\b/i, category: 'Impersonation', phrase: 'courier / delivery service', weight: 16 },
    { pattern: /\b(telecom regulatory|sim card (?:blocked|verification|kyc))\b/i, category: 'Impersonation', phrase: 'SIM / Telecom KYC warning', weight: 22 },
  ];

  public async analyzeMessage(message: string): Promise<AnalysisResult> {
    const text = message.trim();
    if (!text) {
      return this.getEmptyAnalysisResult();
    }

    const detectedPhrases: SuspiciousPhrase[] = [];
    const redFlags: string[] = [];
    const urlsFound = text.match(this.urlRegex) || [];

    // Indicator flags
    let urgencyDetected = false;
    let financialDetected = false;
    let credentialDetected = false;
    let prizeDetected = false;
    let jobDetected = false;
    let investmentDetected = false;
    let impersonationDetected = false;
    let suspiciousUrlDetected = false;

    // 1. Check Urgency
    for (const rule of this.urgencyKeywords) {
      if (rule.pattern.test(text)) {
        urgencyDetected = true;
        detectedPhrases.push({ phrase: rule.phrase, category: 'Urgency', riskWeight: rule.weight });
      }
    }
    if (urgencyDetected) {
      redFlags.push('High psychological pressure and artificial time urgency designed to rush decisions.');
    }

    // 2. Check Financial Request
    for (const rule of this.financialKeywords) {
      if (rule.pattern.test(text)) {
        financialDetected = true;
        detectedPhrases.push({ phrase: rule.phrase, category: 'Financial', riskWeight: rule.weight });
      }
    }
    if (financialDetected) {
      redFlags.push('Direct request for monetary payment, processing charge, or money transfer.');
    }

    // 3. Check Credential Request
    for (const rule of this.credentialKeywords) {
      if (rule.pattern.test(text)) {
        credentialDetected = true;
        detectedPhrases.push({ phrase: rule.phrase, category: 'Credentials', riskWeight: rule.weight });
      }
    }
    if (credentialDetected) {
      redFlags.push('Solicitation of sensitive credentials, OTP, password, PIN, or verification codes.');
    }

    // 4. Check Prize / Reward
    for (const rule of this.prizeKeywords) {
      if (rule.pattern.test(text)) {
        prizeDetected = true;
        detectedPhrases.push({ phrase: rule.phrase, category: 'Reward', riskWeight: rule.weight });
      }
    }
    if (prizeDetected) {
      redFlags.push('Unsolicited lottery win, unexpected reward, or cash prize notification.');
    }

    // 5. Check Job Scam
    for (const rule of this.jobKeywords) {
      if (rule.pattern.test(text)) {
        jobDetected = true;
        detectedPhrases.push({ phrase: rule.phrase, category: 'Job Offer', riskWeight: rule.weight });
      }
    }
    if (jobDetected && financialDetected) {
      redFlags.push('Employment or work-from-home offer requiring an upfront registration fee or payment.');
    }

    // 6. Check Investment Scam
    for (const rule of this.investmentKeywords) {
      if (rule.pattern.test(text)) {
        investmentDetected = true;
        detectedPhrases.push({ phrase: rule.phrase, category: 'Investment', riskWeight: rule.weight });
      }
    }
    if (investmentDetected) {
      redFlags.push('Unrealistic promises of guaranteed profits, risk-free returns, or fast doubling of funds.');
    }

    // 7. Check Impersonation
    for (const rule of this.impersonationKeywords) {
      if (rule.pattern.test(text)) {
        impersonationDetected = true;
        detectedPhrases.push({ phrase: rule.phrase, category: 'Authority Claim', riskWeight: rule.weight });
      }
    }
    if (impersonationDetected) {
      redFlags.push('Apparent impersonation of an official institution, bank, courier, or authority figure.');
    }

    // 8. Check URLs & Link Intent in Message
    const linkIntentPattern = /\b(click(?:ing)?\s+(?:the\s+)?(?:link|button|url)|follow\s+(?:the\s+)?link|click\s+here|tap\s+here|open\s+link|visit\s+link|link\s+below|bit\.ly|tinyurl)\b/i;
    const hasLinkIntent = linkIntentPattern.test(text);

    if (urlsFound.length > 0 || hasLinkIntent) {
      if (hasLinkIntent && urlsFound.length === 0) {
        detectedPhrases.push({ phrase: 'clicking the link below', category: 'Suspicious Link', riskWeight: 18 });
        redFlags.push('Prompts user to click an unverified external link or button embedded in the message.');
      } else {
        redFlags.push(`Contains ${urlsFound.length} external link(s) prompting user navigation.`);
      }

      for (const u of urlsFound) {
        const urlLower = u.toLowerCase();
        if (
          urlLower.startsWith('http://') ||
          /\.(xyz|top|club|buzz|tk|ml|ga|cf|gq|site|online|vip|work)$/i.test(urlLower) ||
          /(bit\.ly|tinyurl|is\.gd|t\.co|cutt\.ly|rb\.gy)/i.test(urlLower) ||
          /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(urlLower) ||
          /(verify|login|claim|bonus|update|security|reward|bank)/i.test(urlLower)
        ) {
          suspiciousUrlDetected = true;
          detectedPhrases.push({ phrase: u, category: 'Suspicious Link', riskWeight: 20 });
        }
      }
      if (suspiciousUrlDetected) {
        redFlags.push('Link exhibits suspicious characteristics (unverified domain, shortener, or security keywords).');
      }
    }

    // 9. Calculate Transparent Scoring Breakdown
    const scoreBreakdown: ScoreFactor[] = [];
    let baseScore = 0;

    if (urgencyDetected) {
      baseScore += 16;
      scoreBreakdown.push({
        factor: 'Urgency & Pressure Tactics',
        points: 16,
        description: 'Imposes short deadlines or threatens adverse consequences.',
        detected: true,
      });
    }

    if (financialDetected) {
      baseScore += 22;
      scoreBreakdown.push({
        factor: 'Financial Request',
        points: 22,
        description: 'Prompts for payment, processing fee, or money transfer.',
        detected: true,
      });
    }

    if (credentialDetected) {
      baseScore += 26;
      scoreBreakdown.push({
        factor: 'Credential / OTP Request',
        points: 26,
        description: 'Requests OTP, password, PIN, or banking authorization codes.',
        detected: true,
      });
    }

    if (prizeDetected) {
      baseScore += 18;
      scoreBreakdown.push({
        factor: 'Unexpected Reward / Prize',
        points: 18,
        description: 'Claims recipient has won money, prizes, or lucky draws.',
        detected: true,
      });
    }

    if (jobDetected) {
      baseScore += 16;
      scoreBreakdown.push({
        factor: 'Job / Recruitment Offer',
        points: 16,
        description: 'Unsolicited employment, micro-tasks, or remote work offer.',
        detected: true,
      });
    }

    if (impersonationDetected) {
      baseScore += 16;
      scoreBreakdown.push({
        factor: 'Institutional Impersonation',
        points: 16,
        description: 'Claims affiliation with banks, government, or courier services.',
        detected: true,
      });
    }

    if (investmentDetected || (jobDetected && financialDetected)) {
      baseScore += 18;
      scoreBreakdown.push({
        factor: 'Unrealistic Promises / High Return',
        points: 18,
        description: 'Promises guaranteed returns, effortless income, or high rewards.',
        detected: true,
      });
    }

    if (suspiciousUrlDetected || (hasLinkIntent && (prizeDetected || financialDetected || credentialDetected))) {
      baseScore += 20;
      scoreBreakdown.push({
        factor: 'Suspicious URL / External Link Trap',
        points: 20,
        description: 'Directs victim to unverified external web domains, buttons, or shortened links.',
        detected: true,
      });
    } else if (urlsFound.length > 0 || hasLinkIntent) {
      baseScore += 10;
      scoreBreakdown.push({
        factor: 'External Link Present',
        points: 10,
        description: 'Directs user to an external site or link from an unverified message sender.',
        detected: true,
      });
    }

    // Contextual Synergies (Scammers combine Urgency + Reward + Financial fee, or Impersonation + OTP)
    let comboMultiplier = 0;
    if (prizeDetected && financialDetected) comboMultiplier += 8;
    if (urgencyDetected && credentialDetected) comboMultiplier += 10;
    if (impersonationDetected && (credentialDetected || financialDetected)) comboMultiplier += 10;
    if (prizeDetected && urgencyDetected && financialDetected) comboMultiplier += 10;
    if (jobDetected && financialDetected) comboMultiplier += 12;
    if ((urlsFound.length > 0 || hasLinkIntent) && (financialDetected || credentialDetected)) comboMultiplier += 8;

    if (comboMultiplier > 0) {
      baseScore += comboMultiplier;
      scoreBreakdown.push({
        factor: 'Compound Scam Signature',
        points: comboMultiplier,
        description: 'Multiple high-risk indicators occurring simultaneously in a single message.',
        detected: true,
      });
    }

    // If message is genuinely normal/conversational and has no triggers
    if (scoreBreakdown.length === 0) {
      baseScore = 4;
      scoreBreakdown.push({
        factor: 'Normal Baseline Communication',
        points: 4,
        description: 'No threat actors, financial pressures, or credential harvesting detected.',
        detected: true,
      });
    }

    // Normalize final score between 0 and 100
    const riskScore = Math.min(100, Math.max(0, Math.round(baseScore)));

    // Risk Level determination
    let riskLevel: RiskLevel = 'SAFE';
    if (riskScore >= 60) {
      riskLevel = 'HIGH';
    } else if (riskScore >= 30) {
      riskLevel = 'SUSPICIOUS';
    }

    // Primary Category Determination
    let category: ScamCategory = 'Safe Communication';
    if (riskScore >= 30) {
      if (prizeDetected && financialDetected) category = 'Prize / Reward Scam';
      else if (credentialDetected || (impersonationDetected && credentialDetected)) category = 'OTP / Credential Scam';
      else if (impersonationDetected && (text.toLowerCase().includes('bank') || text.toLowerCase().includes('account'))) category = 'Banking Scam';
      else if (jobDetected) category = 'Job / Recruitment Scam';
      else if (investmentDetected) category = 'Investment / Crypto Scam';
      else if (prizeDetected) category = 'Prize / Reward Scam';
      else if (text.toLowerCase().includes('parcel') || text.toLowerCase().includes('delivery') || text.toLowerCase().includes('courier')) category = 'Delivery / Courier Scam';
      else if (impersonationDetected) category = 'Impersonation Scam';
      else if (urlsFound.length > 0) category = 'Phishing Attack';
      else category = 'Suspicious Communication';
    }

    // Scam Pattern Formula (Differentiator)
    const patterns: string[] = [];
    if (urgencyDetected) patterns.push('Urgency');
    if (prizeDetected) patterns.push('Reward Promise');
    if (impersonationDetected) patterns.push('Impersonation');
    if (financialDetected) patterns.push('Payment Request');
    if (credentialDetected) patterns.push('Credential Harvesting');
    if (urlsFound.length > 0) patterns.push('External Link Trap');

    const scamPattern = patterns.length > 0
      ? patterns.join(' + ')
      : 'Standard Conversational Pattern';

    // Safer Alternative (Differentiator)
    const saferAlternative = this.getSaferAlternative(category, text, urlsFound);

    // Human-friendly explanation
    const explanation = this.buildExplanation(riskLevel, category, redFlags, scoreBreakdown);

    // Actionable Recommendations
    const recommendations = this.buildRecommendations(riskLevel, category, financialDetected, credentialDetected, urlsFound.length > 0);

    // Confidence Level
    const confidence = riskScore > 80 || riskScore < 20 ? 0.96 : 0.88;

    const indicators: ScamIndicators = {
      urgency: urgencyDetected,
      financialRequest: financialDetected,
      credentialRequest: credentialDetected,
      suspiciousLink: suspiciousUrlDetected || urlsFound.length > 0,
      impersonation: impersonationDetected,
      unrealisticPromise: prizeDetected || investmentDetected || jobDetected,
    };

    // Deduplicate suspicious phrases
    const uniquePhrases = Array.from(
      new Map(detectedPhrases.map((item) => [item.phrase.toLowerCase(), item])).values()
    );

    return {
      riskScore,
      riskLevel,
      category,
      confidence,
      redFlags,
      suspiciousPhrases: uniquePhrases,
      recommendations,
      explanation,
      indicators,
      scamPattern,
      saferAlternative,
      scoreBreakdown,
      analyzedAt: new Date().toISOString(),
      urlsFound,
    };
  }

  public async analyzeUrl(rawUrl: string): Promise<UrlAnalysisResult> {
    const trimmed = rawUrl.trim();
    if (!trimmed) {
      throw new Error('URL cannot be empty');
    }

    let urlObj: URL;
    let formattedUrl = trimmed;
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    try {
      urlObj = new URL(formattedUrl);
    } catch {
      throw new Error('Invalid URL format');
    }

    const domain = urlObj.hostname.toLowerCase();
    const pathname = urlObj.pathname.toLowerCase();
    const isHttps = urlObj.protocol === 'https:';

    // Heuristics
    const hasIpAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(domain);
    const suspiciousTld = /\.(xyz|top|buzz|club|online|tk|ml|ga|cf|gq|cc|app|vip|link|party|bid|loan|win|trade)$/i.test(domain);
    const isShortener = /^(bit\.ly|tinyurl\.com|is\.gd|t\.co|cutt\.ly|rb\.gy|ow\.ly|buff\.ly|goo\.gl)$/i.test(domain);
    const subdomains = domain.split('.');
    const excessiveSubdomains = subdomains.length > 3;

    const suspiciousKeywordsList = [
      'login', 'verify', 'update', 'banking', 'secure', 'account', 'claim',
      'prize', 'wallet', 'bonus', 'kyc', 'support', 'password', 'confirm', 'service'
    ];

    const detectedKeywords: string[] = [];
    const fullUrlLower = formattedUrl.toLowerCase();
    for (const kw of suspiciousKeywordsList) {
      if (fullUrlLower.includes(kw)) {
        detectedKeywords.push(kw);
      }
    }

    const characteristics: string[] = [];
    let score = 5;

    if (!isHttps) {
      score += 25;
      characteristics.push('Insecure connection (Uses plain HTTP instead of HTTPS)');
    } else {
      characteristics.push('Uses encrypted SSL/TLS (HTTPS connection)');
    }

    if (hasIpAddress) {
      score += 40;
      characteristics.push('Direct IP address used instead of a registered domain name (High risk sign)');
    }

    if (suspiciousTld) {
      score += 25;
      characteristics.push(`Uncommon or high-abuse Top-Level Domain (.${domain.split('.').pop()})`);
    }

    if (isShortener) {
      score += 20;
      characteristics.push('Shortened URL masks the actual destination endpoint');
    }

    if (excessiveSubdomains) {
      score += 15;
      characteristics.push(`Excessive subdomains (${subdomains.length - 2} levels) attempting brand disguise`);
    }

    if (detectedKeywords.length > 0) {
      score += Math.min(30, detectedKeywords.length * 10);
      characteristics.push(`Contains high-risk trigger keywords: [${detectedKeywords.join(', ')}]`);
    }

    const redirectRisk = isShortener || (detectedKeywords.length > 0 && !isHttps);

    const riskScore = Math.min(100, Math.max(0, score));
    let riskLevel: RiskLevel = 'SAFE';
    if (riskScore >= 60) {
      riskLevel = 'HIGH';
    } else if (riskScore >= 30) {
      riskLevel = 'SUSPICIOUS';
    }

    const recommendations: string[] = [];
    if (riskLevel === 'HIGH') {
      recommendations.push('Do NOT open this link or submit any passwords, credentials, or personal information.');
      recommendations.push('If this link was received in an unsolicited message, delete or report the communication.');
      recommendations.push('Verify the destination directly by typing the authentic company address into your browser address bar.');
    } else if (riskLevel === 'SUSPICIOUS') {
      recommendations.push('Exercise caution before interacting with this web address.');
      recommendations.push('Check the address bar closely for misspelled brand names or deceptive extensions.');
      recommendations.push('Do not download files or authorize browser notifications from this site.');
    } else {
      recommendations.push('Link appears to adhere to standard web security conventions.');
      recommendations.push('Always ensure you are logged into official bookmarks when entering sensitive financial info.');
    }

    const explanation = riskLevel === 'HIGH'
      ? `This URL has multiple characteristics commonly associated with credential harvesting or phishing portals (${characteristics.slice(0, 2).join(', ')}). Proceeding is not recommended.`
      : riskLevel === 'SUSPICIOUS'
      ? `This web address exhibits minor anomalous patterns such as URL shortening or security trigger keywords. Verify the sender before opening.`
      : `The web address uses HTTPS and does not demonstrate evident phishing patterns. Standard cyber hygiene is still advised.`;

    return {
      url: formattedUrl,
      riskScore,
      riskLevel,
      domain,
      isHttps,
      hasIpAddress,
      suspiciousKeywords: detectedKeywords,
      suspiciousTld,
      isShortener,
      excessiveSubdomains,
      redirectRisk,
      recommendations,
      explanation,
      characteristics,
      analyzedAt: new Date().toISOString(),
    };
  }

  private getSaferAlternative(category: ScamCategory, text: string, urls: string[]): string {
    const textLower = text.toLowerCase();

    if (category === 'Banking Scam' || textLower.includes('bank') || textLower.includes('account')) {
      return 'Do not click the message link. Instead, open your bank’s official mobile banking app directly, or contact the verified telephone number printed on the back of your debit/credit card.';
    }
    if (category === 'Prize / Reward Scam') {
      return 'Legitimate lotteries and rewards never demand an advance fee, tax clearance, or registration charge to release prizes. Ignore the claim and inspect your known loyalty accounts on official apps.';
    }
    if (category === 'Job / Recruitment Scam') {
      return 'Authentic corporate employers never ask candidates to pay registration fees, purchase training kits, or complete Telegram like-tasks before hiring. Search for the company directly on LinkedIn or their official careers portal.';
    }
    if (category === 'Investment / Crypto Scam') {
      return 'No financial instrument provides risk-free, guaranteed returns. Verify financial advisors with official regulators (such as SEBI, SEC, or RBI) before moving any capital.';
    }
    if (category === 'Delivery / Courier Scam') {
      return 'Do not pay redelivery fees or open tracking links. Go directly to the official courier portal (e.g. India Post, FedEx, DHL, BlueDart) and type your known tracking number manually.';
    }
    if (category === 'OTP / Credential Scam') {
      return 'Never disclose your One-Time Password (OTP) or authentication codes to anyone, including bank staff or support personnel. OTPs are confidential keys for your use only.';
    }
    if (urls.length > 0) {
      return 'Instead of following the hyperlink provided in the communication, manually type the verified domain name of the organization into your browser.';
    }
    return 'Verify unexpected communications through a known, independent contact channel before taking action or sharing details.';
  }

  private buildExplanation(
    riskLevel: RiskLevel,
    category: ScamCategory,
    redFlags: string[],
    breakdown: ScoreFactor[]
  ): string {
    if (riskLevel === 'HIGH') {
      const topFactors = breakdown
        .filter((f) => f.detected && f.points > 10)
        .map((f) => f.factor.toLowerCase())
        .slice(0, 3)
        .join(', ');
      return `Potential high-risk communication detected. The message exhibits hallmark patterns of a ${category.toLowerCase()}, driven by ${topFactors || 'suspicious factors'}. Attackers typically use these tactics to prompt hasty, unsafe actions before the recipient can verify authenticity.`;
    }
    if (riskLevel === 'SUSPICIOUS') {
      return `Suspicious indicators found. While this message may not have all classical attack signatures, certain elements—such as unexpected urgency or external link requests—warrant caution. Independent verification is strongly recommended.`;
    }
    return `Low risk detected. No common phishing signatures, coercive deadlines, or credential extraction mechanisms were found in this text. Maintain standard vigilance when sharing information.`;
  }

  private buildRecommendations(
    riskLevel: RiskLevel,
    category: ScamCategory,
    financial: boolean,
    credential: boolean,
    hasLinks: boolean
  ): string[] {
    const list: string[] = [];

    if (riskLevel === 'HIGH') {
      if (hasLinks) {
        list.push('Do NOT click on any link, button, or attachment included in the message.');
      }
      if (financial) {
        list.push('Do NOT transfer money, pay upfront fees, or share UPI PINs under any circumstances.');
      }
      if (credential) {
        list.push('Never disclose your OTP, banking password, CVV, or card numbers to any caller or sender.');
      }
      list.push('Verify the claim independently through the organization’s verified official application or website.');
      list.push('Block the sender’s number or email address and mark the message as spam/phishing.');
    } else if (riskLevel === 'SUSPICIOUS') {
      list.push('Pause and do not make rushed decisions or click on unverified hyperlinks.');
      list.push('Double-check the sender’s phone number or email address for spoofing or slight spelling alterations.');
      list.push('Contact the purported sender via a trusted official phone number before responding.');
    } else {
      list.push('Message appears safe, but always verify before transferring funds or revealing sensitive details.');
      list.push('Ensure your accounts have multi-factor authentication (MFA) enabled for maximum security.');
    }

    return list;
  }

  private getEmptyAnalysisResult(): AnalysisResult {
    return {
      riskScore: 0,
      riskLevel: 'SAFE',
      category: 'Safe Communication',
      confidence: 1.0,
      redFlags: [],
      suspiciousPhrases: [],
      recommendations: ['Please enter or paste a message to begin risk analysis.'],
      explanation: 'No input provided for analysis.',
      indicators: {
        urgency: false,
        financialRequest: false,
        credentialRequest: false,
        suspiciousLink: false,
        impersonation: false,
        unrealisticPromise: false,
      },
      scamPattern: 'None',
      saferAlternative: 'Enter a valid message or URL.',
      scoreBreakdown: [],
      analyzedAt: new Date().toISOString(),
      urlsFound: [],
    };
  }
}
