export interface StalSessionContext {
  sessionId: string;
  timestamp: string;
  isSanitized: boolean;
  geographicRegion: string;
}

export interface BioassayInput {
  assayMethod: 'ELISA' | 'Flow-Cytometry' | 'TR-FRET' | 'UA-Glo';
  matrixPayloadBase64: string;
  minConfidenceThreshold?: number;
}

export interface BioassayResult {
  status: 'VERIFIED' | 'FAILED_AFFINITY_THRESHOLD';
  confidenceScore: number;
  observedTiterRatio: number;
  receptorProfile: string;
}

export interface BiopharmaInput {
  allowedToxicityThreshold: number;
  preferredConjugateClass?: string;
  smilesSequence?: string;
}

export interface BiopharmaResult {
  status: 'COMPOUND_SYNTHESIZED' | 'TOXICITY_LIMIT_EXCEEDED';
  candidateMolecule: string;
  ec50Molar: number;
  cdiscSdtmRecord: Record<string, string>;
}

export interface BioroboticsInput {
  voxelTargetMatrix: [number, number, number];
  hardwareProfileId: string;
  densityMargin?: number;
}

export interface BioroboticsResult {
  status: 'TRAJECTORY_LOCKED';
  gcodeKinematicSequence: string[];
  clearanceVerified: boolean;
  estimatedActuationDurationSec: number;
}

export interface StalExecutionMetrics {
  sessionToken: string;
  developerAccountId: string;
  structuresAnalyzed: number;
  kinematicSteps: number;
  executionDurationMs: number;
}

export interface StalBillingReport {
  baseFrameworkFee: number;
  biopharmaComputeFee: number;
  bioroboticsComputeFee: number;
  executionDurationFee: number;
  totalBillableUnitsUsd: number;
  immutableLedgerHash: string;
}

export interface StalExecutionOutput {
  status: 'STAL_PIPELINE_COMPLETE' | 'EARLY_TERMINATION_AFFINITY_ALERT' | 'PIPELINE_ERROR';
  session: StalSessionContext;
  stage1Bioassay: BioassayResult;
  stage2Biopharma?: BiopharmaResult;
  stage3Biorobotics?: BioroboticsResult;
  ledgerReport: StalBillingReport;
  error?: string;
}
