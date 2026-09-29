import tape from 'tape';
import { PiiShieldGateway } from '../src/security/piiShield.js';
import { BioassayMicroEngine } from '../src/stages/bioassayStage.js';
import { BiopharmaMolecularSynthesizer } from '../src/stages/biopharmaStage.js';
import { BioroboticsKinematicPlanner } from '../src/stages/bioroboticsStage.js';
import { StalMeteredBillingEngine } from '../src/billing/meterEngine.js';

tape('STAL Layer 1: HIPAA PII Shield Sanitization', (t) => {
  const rawData = {
    patient_name: 'John Doe',
    ssn: '123-45-6789',
    email: 'patient@clinic.org',
    medical_reading: 14.5
  };
  const { sanitized, session } = PiiShieldGateway.sanitizeContext(rawData);
  t.ok(session.sessionId.startsWith('STAL-SES-'));
  t.equal((sanitized as Record<string, string>).ssn, '[REDACTED_SSN]');
  t.equal((sanitized as Record<string, string>).email, '[REDACTED_EMAIL]');
  t.end();
});

tape('STAL Stage 1: BioAssay Micro-Validation Execution', (t) => {
  const valid = BioassayMicroEngine.evaluate({
    assayMethod: 'TR-FRET',
    matrixPayloadBase64: Buffer.from('CELL_DENSITY_HIGH_SIGNAL').toString('base64'),
    minConfidenceThreshold: 0.80
  });
  t.equal(valid.status, 'VERIFIED');
  t.ok(valid.confidenceScore >= 0.80);
  t.end();
});

tape('STAL Stage 2: Biopharma Molecular Synthesis & CDISC SDTM', (t) => {
  const res = BiopharmaMolecularSynthesizer.synthesize({
    allowedToxicityThreshold: 0.05,
    preferredConjugateClass: 'KINASE_INHIBITOR'
  });
  t.equal(res.status, 'COMPOUND_SYNTHESIZED');
  t.equal(res.cdiscSdtmRecord.DOMAIN, 'PC');
  t.equal(res.cdiscSdtmRecord.STAL_VERIFIED, 'TRUE');
  t.end();
});

tape('STAL Stage 3: BioRobotics Kinematic Pathing (G-code)', (t) => {
  const res = BioroboticsKinematicPlanner.planTrajectory({
    voxelTargetMatrix: [12.5, 45.0, 110.2],
    hardwareProfileId: 'SURGICAL-ARM-ROBO-01'
  });
  t.equal(res.status, 'TRAJECTORY_LOCKED');
  t.equal(res.clearanceVerified, true);
  t.ok(res.gcodeKinematicSequence.length >= 5);
  t.end();
});

tape('STAL Audit: Metered Billing Ledger Computation', (t) => {
  const bill = StalMeteredBillingEngine.computeTransactionCharge({
    sessionToken: 'SES-TOKEN-001',
    developerAccountId: 'DEV-AOCR-CLINICAL',
    structuresAnalyzed: 3,
    kinematicSteps: 7,
    executionDurationMs: 450
  });
  t.equal(bill.baseFrameworkFee, 7.50);
  t.ok(bill.totalBillableUnitsUsd > 10.00);
  t.equal(bill.immutableLedgerHash.length, 64);
  t.end();
});
