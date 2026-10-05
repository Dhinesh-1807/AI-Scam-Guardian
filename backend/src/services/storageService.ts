import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AnalyticsSummary, ScanRecord } from '../types/scam.js';

export class StorageService {
  private supabase: SupabaseClient | null = null;
  private inMemoryScans: ScanRecord[] = [];

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        this.supabase = createClient(supabaseUrl, supabaseKey);
        console.log('✅ Connected to Supabase PostgreSQL Database');
      } catch (err) {
        console.warn('⚠️ Failed to initialize Supabase client, using local mock storage:', err);
      }
    } else {
      console.log('📦 Supabase credentials not set. Running with In-Memory Demo Storage (Zero Setup Required)');
    }

    // Seed initial demo data for instant hackathon analytics and history
    this.seedDemoData();
  }

  private seedDemoData() {
    const initialScans: ScanRecord[] = [
      {
        id: 'scan-demo-1',
        scanType: 'message',
        inputText: 'Congratulations! You have been selected to receive a ₹50,000 reward. Claim your prize immediately by clicking the link below. A processing fee of ₹499 is required. Failure to claim within 24 hours will result in cancellation.',
        riskScore: 92,
        riskLevel: 'HIGH',
        category: 'Prize / Reward Scam',
        confidence: 0.96,
        explanation: 'Potential high-risk communication detected. The message exhibits hallmark patterns of a prize scam, driven by urgency, upfront fee demands, and unexpected reward promises.',
        scamPattern: 'Urgency + Reward Promise + Payment Request + External Link Trap',
        saferAlternative: 'Legitimate lotteries and rewards never demand an advance fee or registration charge to release prizes. Ignore the claim.',
        indicators: {
          urgency: true,
          financialRequest: true,
          credentialRequest: false,
          suspiciousLink: true,
          impersonation: false,
          unrealisticPromise: true,
        },
        redFlags: [
          'High psychological pressure and artificial time urgency designed to rush decisions.',
          'Direct request for monetary payment, processing charge, or money transfer.',
          'Unsolicited lottery win, unexpected reward, or cash prize notification.',
          'Contains external link prompting user navigation.',
        ],
        suspiciousPhrases: [
          { phrase: 'within 24 hours', category: 'Urgency', riskWeight: 18 },
          { phrase: 'processing fee', category: 'Financial', riskWeight: 25 },
          { phrase: 'selected to receive', category: 'Reward', riskWeight: 22 },
          { phrase: 'claim your prize', category: 'Reward', riskWeight: 20 },
        ],
        recommendations: [
          'Do NOT click on any link or button included in the message.',
          'Do NOT pay the ₹499 processing fee or transfer any funds.',
          'Verify the claim independently through verified official channels.',
          'Block the sender and report the message as fraud.',
        ],
        scoreBreakdown: [
          { factor: 'Urgency & Pressure Tactics', points: 16, description: '24-hour deadline countdown.', detected: true },
          { factor: 'Financial Request', points: 22, description: 'Demands advance ₹499 processing fee.', detected: true },
          { factor: 'Unexpected Reward / Prize', points: 18, description: 'Claims ₹50,000 cash reward.', detected: true },
          { factor: 'External Link Present', points: 8, description: 'Directs victim to unverified domain.', detected: true },
          { factor: 'Compound Scam Signature', points: 28, description: 'Prize + Urgency + Advance Fee synergy.', detected: true },
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
      },
      {
        id: 'scan-demo-2',
        scanType: 'message',
        inputText: 'Dear customer, your SBI bank account has been suspended due to pending KYC update. Click http://sbi-kyc-verify.xyz to update immediately or account will be blocked within 12 hours.',
        riskScore: 94,
        riskLevel: 'HIGH',
        category: 'Banking Scam',
        confidence: 0.98,
        explanation: 'High-risk phishing attack impersonating State Bank of India. Uses severe threat of account suspension and unverified fake KYC domain to harvest banking credentials.',
        scamPattern: 'Urgency + Impersonation + External Link Trap',
        saferAlternative: 'Do not click the message link. Instead, open your bank’s official mobile banking app directly or contact customer care.',
        indicators: {
          urgency: true,
          financialRequest: false,
          credentialRequest: true,
          suspiciousLink: true,
          impersonation: true,
          unrealisticPromise: false,
        },
        redFlags: [
          'Fake threat of bank account deactivation or suspension within 12 hours.',
          'Direct link to an unverified third-party domain mimicking official bank.',
          'Impersonation of leading financial institution.',
        ],
        suspiciousPhrases: [
          { phrase: 'account will be blocked', category: 'Urgency', riskWeight: 22 },
          { phrase: 'immediately', category: 'Urgency', riskWeight: 15 },
          { phrase: 'bank', category: 'Authority Claim', riskWeight: 16 },
        ],
        recommendations: [
          'Never click links in SMS regarding KYC or account suspensions.',
          'Banks never request KYC updates via generic SMS links.',
          'Contact your branch manager or call the phone number on your debit card.',
        ],
        scoreBreakdown: [
          { factor: 'Urgency & Pressure Tactics', points: 16, description: '12-hour block threat.', detected: true },
          { factor: 'Institutional Impersonation', points: 16, description: 'SBI bank authority claim.', detected: true },
          { factor: 'Suspicious URL / External Link', points: 20, description: 'Directs to .xyz phishing domain.', detected: true },
          { factor: 'Compound Scam Signature', points: 42, description: 'Banking + Urgency + Link combination.', detected: true },
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
      },
      {
        id: 'scan-demo-3',
        scanType: 'message',
        inputText: 'Part-time Work From Home! Earn ₹3,500 daily by simply rating hotels on Google Maps. No experience needed. Join Telegram channel t.me/fast_tasks_daily to receive your first task.',
        riskScore: 78,
        riskLevel: 'HIGH',
        category: 'Job / Recruitment Scam',
        confidence: 0.91,
        explanation: 'Recruitment scam using micro-tasks and unrealistic daily compensation to lure victims into prepaid commission fraud on Telegram.',
        scamPattern: 'Reward Promise + External Link Trap',
        saferAlternative: 'Authentic corporate employers never recruit for daily payouts on anonymous messaging apps. Search for verified career openings.',
        indicators: {
          urgency: false,
          financialRequest: false,
          credentialRequest: false,
          suspiciousLink: true,
          impersonation: false,
          unrealisticPromise: true,
        },
        redFlags: [
          'Unrealistic daily income (₹3,500/day) for effortless rating tasks.',
          'Redirection to unmoderated messaging channels (Telegram).',
        ],
        suspiciousPhrases: [
          { phrase: 'work from home', category: 'Job Offer', riskWeight: 14 },
          { phrase: 'earn ₹3,500 daily', category: 'Job Offer', riskWeight: 18 },
        ],
        recommendations: [
          'Do not complete micro-tasks or provide bank account details for initial small payouts.',
          'Never pay advance deposits to unlock higher-tier tasks.',
        ],
        scoreBreakdown: [
          { factor: 'Unrealistic Promises / High Return', points: 16, description: 'High daily payout promise.', detected: true },
          { factor: 'External Link Present', points: 8, description: 'Telegram link channel.', detected: true },
          { factor: 'Compound Scam Signature', points: 54, description: 'Classic task/prepaid job scam signature.', detected: true },
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hours ago
      },
      {
        id: 'scan-demo-4',
        scanType: 'message',
        inputText: 'Your Amazon package #982-10294 could not be delivered due to an incorrect postal address. Please confirm your delivery address: https://amzn-delivery-portal.club/track',
        riskScore: 74,
        riskLevel: 'HIGH',
        category: 'Delivery / Courier Scam',
        confidence: 0.93,
        explanation: 'Smishing attack exploiting package delivery anxiety. Links to a spoofed delivery portal to capture address and credit card details under the guise of an address correction fee.',
        scamPattern: 'Impersonation + External Link Trap',
        saferAlternative: 'Do not pay redelivery fees or open tracking links. Check your actual order status directly inside your Amazon app.',
        indicators: {
          urgency: false,
          financialRequest: false,
          credentialRequest: false,
          suspiciousLink: true,
          impersonation: true,
          unrealisticPromise: false,
        },
        redFlags: [
          'Fake package delivery failure notification.',
          'Deceptive domain name imitating Amazon (.club domain).',
        ],
        suspiciousPhrases: [
          { phrase: 'could not be delivered', category: 'Authority Claim', riskWeight: 16 },
          { phrase: 'amzn-delivery-portal.club', category: 'Suspicious Link', riskWeight: 20 },
        ],
        recommendations: [
          'Verify package status directly on the official retail application.',
          'Never provide card details to reschedule a regular delivery.',
        ],
        scoreBreakdown: [
          { factor: 'Institutional Impersonation', points: 16, description: 'Courier / retail claim.', detected: true },
          { factor: 'Suspicious URL / External Link', points: 20, description: 'Spoofed .club domain.', detected: true },
          { factor: 'Compound Scam Signature', points: 38, description: 'Delivery phishing signature.', detected: true },
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
      },
      {
        id: 'scan-demo-5',
        scanType: 'url',
        inputText: 'http://192.168.1.100/secure-bank-login/update.php',
        riskScore: 85,
        riskLevel: 'HIGH',
        category: 'Phishing Attack',
        confidence: 0.95,
        explanation: 'High-risk URL using a raw IP address and plain unencrypted HTTP to impersonate bank authentication.',
        scamPattern: 'Credential Harvesting + Insecure HTTP',
        saferAlternative: 'Never submit credentials to raw IP addresses or non-HTTPS websites.',
        recommendations: [
          'Do NOT visit this address.',
          'Legitimate organizations use encrypted HTTPS registered domains.',
        ],
        urlDetails: {
          url: 'http://192.168.1.100/secure-bank-login/update.php',
          riskScore: 85,
          riskLevel: 'HIGH',
          domain: '192.168.1.100',
          isHttps: false,
          hasIpAddress: true,
          suspiciousKeywords: ['secure', 'bank', 'login', 'update'],
          characteristics: [
            'Insecure connection (Uses plain HTTP instead of HTTPS)',
            'Direct IP address used instead of a registered domain name',
            'Contains high-risk trigger keywords: [secure, bank, login, update]',
          ],
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      },
      {
        id: 'scan-demo-6',
        scanType: 'message',
        inputText: 'Hey, are we still meeting at 5 PM today for coffee at the central library?',
        riskScore: 4,
        riskLevel: 'SAFE',
        category: 'Safe Communication',
        confidence: 0.99,
        explanation: 'Low risk detected. No common phishing signatures, coercive deadlines, or credential extraction mechanisms were found in this text.',
        scamPattern: 'Standard Conversational Pattern',
        saferAlternative: 'Standard communication. No security precautions necessary.',
        indicators: {
          urgency: false,
          financialRequest: false,
          credentialRequest: false,
          suspiciousLink: false,
          impersonation: false,
          unrealisticPromise: false,
        },
        redFlags: [],
        suspiciousPhrases: [],
        recommendations: [
          'Message appears safe, but always verify before transferring funds or revealing sensitive details.',
          'Ensure your accounts have multi-factor authentication (MFA) enabled.',
        ],
        scoreBreakdown: [
          { factor: 'Normal Baseline Communication', points: 4, description: 'No threat actors detected.', detected: true },
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      },
      {
        id: 'scan-demo-7',
        scanType: 'message',
        inputText: 'Hi mom, my phone broke and I am temporarily using my friend phone. Can you text me here on WhatsApp when you see this?',
        riskScore: 48,
        riskLevel: 'SUSPICIOUS',
        category: 'Suspicious Communication',
        confidence: 0.88,
        explanation: 'Suspicious indicators found. This resembles the "broken phone / Hi Mum" impersonation tactic where scammers pose as family members before asking for emergency funds.',
        scamPattern: 'Impersonation + Urgency',
        saferAlternative: 'Call your child directly on their usual number or ask a personal question only they would know.',
        indicators: {
          urgency: false,
          financialRequest: false,
          credentialRequest: false,
          suspiciousLink: false,
          impersonation: true,
          unrealisticPromise: false,
        },
        redFlags: [
          'Unverified phone number claiming family member identity.',
          'Common precursor to emergency funds transfer request.',
        ],
        suspiciousPhrases: [
          { phrase: 'my phone broke', category: 'Urgency', riskWeight: 14 },
        ],
        recommendations: [
          'Call your family member directly on their known existing phone number.',
          'Do not send money or gift card codes without verbal voice confirmation.',
        ],
        scoreBreakdown: [
          { factor: 'Institutional Impersonation', points: 16, description: 'Family member impersonation signature.', detected: true },
          { factor: 'Compound Scam Signature', points: 32, description: 'Hi Mum scam precursor pattern.', detected: true },
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
      },
    ];

    this.inMemoryScans = initialScans;
  }

  public async saveScan(scanData: Omit<ScanRecord, 'id' | 'createdAt'>): Promise<ScanRecord> {
    const newScan: ScanRecord = {
      ...scanData,
      id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };

    // If Supabase is available, insert into Supabase
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('scans')
          .insert([
            {
              user_id: newScan.userId || null,
              scan_type: newScan.scanType,
              input_text: newScan.inputText,
              risk_score: newScan.riskScore,
              risk_level: newScan.riskLevel,
              category: newScan.category,
              confidence: newScan.confidence,
              explanation: newScan.explanation,
              scam_pattern: newScan.scamPattern,
              safer_alternative: newScan.saferAlternative,
              indicators: newScan.indicators,
              red_flags: newScan.redFlags,
              suspicious_phrases: newScan.suspiciousPhrases,
              recommendations: newScan.recommendations,
              score_breakdown: newScan.scoreBreakdown,
              url_details: newScan.urlDetails,
            },
          ])
          .select()
          .single();

        if (!error && data) {
          newScan.id = data.id;
          newScan.createdAt = data.created_at;
        }
      } catch (err) {
        console.warn('⚠️ Error inserting into Supabase, maintaining in-memory cache:', err);
      }
    }

    // Always keep in local memory store for instant responsiveness
    this.inMemoryScans.unshift(newScan);
    return newScan;
  }

  public async getScans(filter?: { riskLevel?: string; search?: string; scanType?: string }): Promise<ScanRecord[]> {
    if (this.supabase) {
      try {
        let query = this.supabase.from('scans').select('*').order('created_at', { ascending: false });

        if (filter?.riskLevel && filter.riskLevel !== 'ALL') {
          query = query.eq('risk_level', filter.riskLevel.toUpperCase());
        }
        if (filter?.scanType && filter.scanType !== 'ALL') {
          query = query.eq('scan_type', filter.scanType.toLowerCase());
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            userId: d.user_id,
            scanType: d.scan_type,
            inputText: d.input_text,
            riskScore: d.risk_score,
            riskLevel: d.risk_level,
            category: d.category,
            confidence: Number(d.confidence),
            explanation: d.explanation,
            scamPattern: d.scam_pattern,
            saferAlternative: d.safer_alternative,
            indicators: d.indicators,
            redFlags: d.red_flags,
            suspiciousPhrases: d.suspicious_phrases,
            recommendations: d.recommendations,
            scoreBreakdown: d.score_breakdown,
            urlDetails: d.url_details,
            createdAt: d.created_at,
          }));
        }
      } catch (err) {
        console.warn('Supabase query failed, returning memory scans:', err);
      }
    }

    // Filter in-memory scans
    let result = [...this.inMemoryScans];

    if (filter?.riskLevel && filter.riskLevel !== 'ALL') {
      result = result.filter((s) => s.riskLevel.toUpperCase() === filter.riskLevel?.toUpperCase());
    }

    if (filter?.scanType && filter.scanType !== 'ALL') {
      result = result.filter((s) => s.scanType.toLowerCase() === filter.scanType?.toLowerCase());
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.inputText.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.explanation.toLowerCase().includes(q)
      );
    }

    return result;
  }

  public async getScanById(id: string): Promise<ScanRecord | null> {
    const found = this.inMemoryScans.find((s) => s.id === id);
    if (found) return found;

    if (this.supabase) {
      const { data } = await this.supabase.from('scans').select('*').eq('id', id).single();
      if (data) {
        return {
          id: data.id,
          userId: data.user_id,
          scanType: data.scan_type,
          inputText: data.input_text,
          riskScore: data.risk_score,
          riskLevel: data.risk_level,
          category: data.category,
          confidence: Number(data.confidence),
          explanation: data.explanation,
          scamPattern: data.scam_pattern,
          saferAlternative: data.safer_alternative,
          indicators: data.indicators,
          redFlags: data.red_flags,
          suspiciousPhrases: data.suspicious_phrases,
          recommendations: data.recommendations,
          scoreBreakdown: data.score_breakdown,
          urlDetails: data.url_details,
          createdAt: data.created_at,
        };
      }
    }

    return null;
  }

  public async deleteScan(id: string): Promise<boolean> {
    const initialLen = this.inMemoryScans.length;
    this.inMemoryScans = this.inMemoryScans.filter((s) => s.id !== id);

    if (this.supabase) {
      await this.supabase.from('scans').delete().eq('id', id);
    }

    return this.inMemoryScans.length < initialLen;
  }

  public async getAnalytics(): Promise<AnalyticsSummary> {
    const scans = await this.getScans();

    const totalScans = scans.length;
    const highRiskCount = scans.filter((s) => s.riskLevel === 'HIGH').length;
    const suspiciousCount = scans.filter((s) => s.riskLevel === 'SUSPICIOUS').length;
    const safeCount = scans.filter((s) => s.riskLevel === 'SAFE').length;

    const avgScore = totalScans > 0
      ? Math.round(scans.reduce((acc, s) => acc + s.riskScore, 0) / totalScans)
      : 0;

    const highRiskPercentage = totalScans > 0 ? Math.round((highRiskCount / totalScans) * 100) : 0;

    // Categories count
    const catMap: Record<string, number> = {};
    for (const s of scans) {
      catMap[s.category] = (catMap[s.category] || 0) + 1;
    }

    let mostCommonCategory = 'None';
    let maxCatCount = 0;
    for (const [cat, count] of Object.entries(catMap)) {
      if (count > maxCatCount) {
        maxCatCount = count;
        mostCommonCategory = cat;
      }
    }

    const palette = ['#2563EB', '#DC2626', '#F59E0B', '#16A34A', '#8B5CF6', '#EC4899', '#06B6D4'];
    const categoryDistribution = Object.entries(catMap).map(([category, count], idx) => ({
      category,
      count,
      color: palette[idx % palette.length],
    }));

    const riskDistribution = [
      { name: 'Safe Messages', value: safeCount, color: '#16A34A' },
      { name: 'Suspicious Messages', value: suspiciousCount, color: '#F59E0B' },
      { name: 'High-Risk Threats', value: highRiskCount, color: '#DC2626' },
    ];

    // Scans timeline (last 7 days grouped)
    const timelineMap: Record<string, { count: number; highRisk: number }> = {};
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    for (const d of days) {
      timelineMap[d] = { count: 0, highRisk: 0 };
    }

    for (const s of scans) {
      const day = new Date(s.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
      if (timelineMap[day]) {
        timelineMap[day].count += 1;
        if (s.riskLevel === 'HIGH') {
          timelineMap[day].highRisk += 1;
        }
      }
    }

    const scansOverTime = Object.entries(timelineMap).map(([date, stats]) => ({
      date,
      count: stats.count,
      highRisk: stats.highRisk,
    }));

    return {
      totalScans,
      highRiskCount,
      suspiciousCount,
      safeCount,
      averageRiskScore: avgScore,
      highRiskPercentage,
      mostCommonCategory,
      scansOverTime,
      categoryDistribution,
      riskDistribution,
    };
  }
}

export const storageService = new StorageService();
