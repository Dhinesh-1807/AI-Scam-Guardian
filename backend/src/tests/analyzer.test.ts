import { LocalScamAnalyzer } from '../services/ai/localAnalyzer.js';

async function runTests() {
  console.log('🧪 Running AI Scam Guardian Analyzer Verification Suite...\n');
  const analyzer = new LocalScamAnalyzer();
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
      failed++;
    }
  }

  // TEST 1: Hackathon Sample Demo Message (Prize Scam)
  console.log('--- Test 1: Official Demo Prize Scam Message ---');
  const demoPrizeMsg =
    'Congratulations! You have been selected to receive a ₹50,000 reward. Claim your prize immediately by clicking the link below. A processing fee of ₹499 is required. Failure to claim within 24 hours will result in cancellation.';
  const prizeResult = await analyzer.analyzeMessage(demoPrizeMsg);

  assert(prizeResult.riskLevel === 'HIGH', 'Demo message detected as HIGH risk', `Got: ${prizeResult.riskLevel}`);
  assert(prizeResult.riskScore >= 90, 'Demo message risk score is >= 90', `Got: ${prizeResult.riskScore}`);
  assert(
    prizeResult.category.includes('Prize'),
    'Categorized as Prize / Reward Scam',
    `Got: ${prizeResult.category}`
  );
  assert(prizeResult.indicators.urgency === true, 'Urgency indicator detected');
  assert(prizeResult.indicators.financialRequest === true, 'Financial request indicator detected');
  assert(prizeResult.indicators.unrealisticPromise === true, 'Reward promise indicator detected');
  assert(prizeResult.redFlags.length >= 3, 'Multiple red flags generated', `Count: ${prizeResult.redFlags.length}`);
  assert(prizeResult.scamPattern.length > 0, 'Scam pattern formula generated', `Got: ${prizeResult.scamPattern}`);
  assert(prizeResult.saferAlternative.length > 0, 'Safer alternative action provided');

  // TEST 2: Bank Account & OTP Threat Message
  console.log('\n--- Test 2: Banking & OTP Threat Message ---');
  const bankMsg = 'Your bank account will be blocked. Verify OTP immediately.';
  const bankResult = await analyzer.analyzeMessage(bankMsg);

  assert(bankResult.riskLevel === 'HIGH', 'Bank threats detected as HIGH risk', `Got: ${bankResult.riskLevel}`);
  assert(bankResult.indicators.urgency === true, 'Bank urgency detected');
  assert(bankResult.indicators.credentialRequest === true, 'OTP credential request detected');
  assert(bankResult.riskScore >= 60, 'Bank risk score >= 60', `Got: ${bankResult.riskScore}`);

  // TEST 3: Safe Everyday Message
  console.log('\n--- Test 3: Safe Everyday Communication ---');
  const safeMsg = 'Hey, are we meeting at 5 PM today?';
  const safeResult = await analyzer.analyzeMessage(safeMsg);

  assert(safeResult.riskLevel === 'SAFE', 'Casual message detected as SAFE', `Got: ${safeResult.riskLevel}`);
  assert(safeResult.riskScore < 30, 'Safe message score < 30', `Got: ${safeResult.riskScore}`);
  assert(safeResult.category === 'Safe Communication', 'Categorized as Safe Communication');

  // TEST 4: Job Scam with Telegram & Upfront Fee
  console.log('\n--- Test 4: Job / Task Recruitment Scam ---');
  const jobMsg = 'Work from home! Guaranteed salary of ₹4,000 per day. Pay ₹500 registration fee to join.';
  const jobResult = await analyzer.analyzeMessage(jobMsg);

  assert(jobResult.riskLevel === 'HIGH', 'Recruitment fee detected as HIGH risk', `Got: ${jobResult.riskLevel}`);
  assert(jobResult.category.includes('Job'), 'Job category detected');

  // TEST 5: Suspicious Raw IP URL Analysis
  console.log('\n--- Test 5: Suspicious Raw IP & HTTP URL ---');
  const urlResult = await analyzer.analyzeUrl('http://192.168.1.1/login-verify');

  assert(urlResult.riskLevel === 'HIGH', 'Raw IP + HTTP URL flagged as HIGH risk', `Got: ${urlResult.riskLevel}`);
  assert(urlResult.isHttps === false, 'Detected non-HTTPS protocol');
  assert(urlResult.hasIpAddress === true, 'Detected raw IP hostname');

  // TEST 6: Safe Legitimate URL
  console.log('\n--- Test 6: Legitimate Domain URL ---');
  const safeUrlResult = await analyzer.analyzeUrl('https://www.google.com');

  assert(safeUrlResult.riskLevel === 'SAFE', 'Legitimate HTTPS domain detected as SAFE', `Got: ${safeUrlResult.riskLevel}`);
  assert(safeUrlResult.isHttps === true, 'Detected HTTPS protocol');

  // Summary
  console.log(`\n===========================================`);
  console.log(`Test Results: ${passed} PASSED, ${failed} FAILED`);
  console.log(`===========================================`);

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 All analyzer test cases verified successfully!\n');
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Test runner error:', err);
  process.exit(1);
});
