export interface DemoSample {
  id: string;
  name: string;
  tag: string;
  category: string;
  text: string;
  expectedScore: string;
  expectedRisk: 'HIGH' | 'SUSPICIOUS' | 'SAFE';
}

export const SAMPLE_PRESETS: DemoSample[] = [
  {
    id: 'prize',
    name: 'Try Prize Scam',
    tag: 'Official Demo',
    category: 'Prize / Reward Scam',
    expectedScore: '92/100',
    expectedRisk: 'HIGH',
    text: 'Congratulations! You have been selected to receive a ₹50,000 reward. Claim your prize immediately by clicking the link below. A processing fee of ₹499 is required. Failure to claim within 24 hours will result in cancellation.',
  },
  {
    id: 'bank',
    name: 'Try Banking Scam',
    tag: 'Urgent Threat',
    category: 'Banking Scam',
    expectedScore: '94/100',
    expectedRisk: 'HIGH',
    text: 'Dear Customer, your State Bank account has been temporarily restricted due to an incomplete KYC profile. Click http://sbi-kyc-verify.xyz to update immediately or your debit card will be blocked within 12 hours.',
  },
  {
    id: 'job',
    name: 'Try Job Scam',
    tag: 'Work From Home',
    category: 'Job / Recruitment Scam',
    expectedScore: '78/100',
    expectedRisk: 'HIGH',
    text: 'Work from home opportunity! Earn ₹3,500 daily by simply reviewing hotels and YouTube videos. No experience needed. Pay ₹500 registration fee to receive your starter task kit on Telegram.',
  },
  {
    id: 'delivery',
    name: 'Try Delivery Scam',
    tag: 'Fake Courier',
    category: 'Delivery / Courier Scam',
    expectedScore: '74/100',
    expectedRisk: 'HIGH',
    text: 'Your courier parcel #IN-99201 could not be delivered due to an incomplete apartment number. Please confirm your delivery address and pay the ₹25 redelivery charge: https://india-post-track.club/verify',
  },
  {
    id: 'otp',
    name: 'Try OTP Scam',
    tag: 'Credential Theft',
    category: 'OTP / Credential Scam',
    expectedScore: '88/100',
    expectedRisk: 'HIGH',
    text: 'Urgent: A transaction of ₹24,999 was initiated on your card ending in 4109. If this was not you, call our 24/7 fraud prevention hotline immediately and share the 6-digit cancellation OTP sent to your phone.',
  },
  {
    id: 'safe',
    name: 'Try Safe Message',
    tag: 'Casual Chat',
    category: 'Safe Communication',
    expectedScore: '4/100',
    expectedRisk: 'SAFE',
    text: 'Hey, are we still meeting at 5 PM today for coffee at the central library? Let me know if you want me to bring the project notes!',
  },
];
