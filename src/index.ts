import { CircuitBreaker } from './security/circuitBreaker.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { PiiShieldGateway } from './security/piiShield.js';
import { BioassayMicroEngine } from './stages/bioassayStage.js';
import { BiopharmaMolecularSynthesizer } from './stages/biopharmaStage.js';
import { BioroboticsKinematicPlanner } from './stages/bioroboticsStage.js';
import { StalMeteredBillingEngine } from './billing/meterEngine.js';
import { StalExecutionOutput } from './types.js';

const cb = new CircuitBreaker();
const mcpServer = new Server(
  {
    name: 'seosiri-stal-core-engine',
    version: '1.0.4'
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// Zod Schema validating the entire Theranostic Loop input
const executeStalPipelineSchema = z.object({
  session_token: z.string().describe('Anonymized context validation token issued by SEOSiri Edge'),
  developer_account_id: z.string().default('DEV-ENTERPRISE-01'),
  assay_telemetry: z.object({
    assay_method: z.enum(['ELISA', 'Flow-Cytometry', 'TR-FRET', 'UA-Glo']),
    matrix_payload_base64: z.string(),
    min_confidence_threshold: z.number().min(0).max(1).default(0.95)
  }),
  target_molecular_profile: z.object({
    allowed_toxicity_threshold: z.number().min(0).max(1),
    preferred_conjugate_class: z.string().optional()
  }),
  spatial_kinematic_constraints: z.object({
    voxel_target_matrix: z.tuple([z.number(), z.number(), z.number()]),
    hardware_profile_id: z.string()
  })
});

mcpServer.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'execute_stal_pipeline',
      description: 'Executes the unified SEOSIRI Theranostic Autonomous Loop: performs zero-trust PII scrubbing, bioassay target validation, biopharma molecular synthesis, and biorobotics surgical kinematic pathing with metered transaction logging.',
      inputSchema: {
        type: 'object',
        properties: {
          session_token: { type: 'string' },
          developer_account_id: { type: 'string' },
          assay_telemetry: {
            type: 'object',
            properties: {
              assay_method: { type: 'string', enum: ['ELISA', 'Flow-Cytometry', 'TR-FRET', 'UA-Glo'] },
              matrix_payload_base64: { type: 'string' },
              min_confidence_threshold: { type: 'number', default: 0.95 }
            },
            required: ['assay_method', 'matrix_payload_base64']
          },
          target_molecular_profile: {
            type: 'object',
            properties: {
              allowed_toxicity_threshold: { type: 'number' },
              preferred_conjugate_class: { type: 'string' }
            },
            required: ['allowed_toxicity_threshold']
          },
          spatial_kinematic_constraints: {
            type: 'object',
            properties: {
              voxel_target_matrix: {
                type: 'array',
                items: { type: 'number' },
                minItems: 3,
                maxItems: 3,
                description: '[X, Y, Z] spatial target coordinates.'
              },
              hardware_profile_id: { type: 'string' }
            },
            required: ['voxel_target_matrix', 'hardware_profile_id']
          }
        },
        required: ['session_token', 'assay_telemetry', 'target_molecular_profile', 'spatial_kinematic_constraints']
      }
    }
  ]
}));

mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const startTime = Date.now();

  if (name !== 'execute_stal_pipeline') {
    return {
      isError: true,
      content: [{ type: 'text', text: `Unknown tool: ${name}` }]
    };
  }

  try {
    const input = executeStalPipelineSchema.parse(args);

    // Layer 1: PII Shield
    const { session } = PiiShieldGateway.sanitizeContext(args as Record<string, unknown>);

    // Stage 1: BioAssay Micro-Validation
    const bioassayResult = BioassayMicroEngine.evaluate({
      assayMethod: input.assay_telemetry.assay_method,
      matrixPayloadBase64: input.assay_telemetry.matrix_payload_base64,
      minConfidenceThreshold: input.assay_telemetry.min_confidence_threshold
    });

    // Early termination check: halt pipeline if target confidence is suboptimal
    if (bioassayResult.status === 'FAILED_AFFINITY_THRESHOLD') {
      const execMs = Date.now() - startTime;
      const billing = StalMeteredBillingEngine.computeTransactionCharge({
        sessionToken: input.session_token,
        developerAccountId: input.developer_account_id,
        structuresAnalyzed: 0,
        kinematicSteps: 0,
        executionDurationMs: execMs
      });

      const output: StalExecutionOutput = {
        status: 'EARLY_TERMINATION_AFFINITY_ALERT',
        session,
        stage1Bioassay: bioassayResult,
        ledgerReport: billing
      };

      return {
        content: [{ type: 'text', text: JSON.stringify(output, null, 2) }]
      };
    }

    // Stage 2: Biopharma Molecular Synthesizer
    const biopharmaResult = BiopharmaMolecularSynthesizer.synthesize({
      allowedToxicityThreshold: input.target_molecular_profile.allowed_toxicity_threshold,
      preferredConjugateClass: input.target_molecular_profile.preferred_conjugate_class
    });

    // Stage 3: BioRobotics Kinematic Planner
    const bioroboticsResult = BioroboticsKinematicPlanner.planTrajectory({
      voxelTargetMatrix: input.spatial_kinematic_constraints.voxel_target_matrix,
      hardwareProfileId: input.spatial_kinematic_constraints.hardware_profile_id
    });

    // Stage 4: Metered Billing & Audit Log
    const executionDurationMs = Date.now() - startTime;
    const ledgerReport = StalMeteredBillingEngine.computeTransactionCharge({
      sessionToken: input.session_token,
      developerAccountId: input.developer_account_id,
      structuresAnalyzed: 3,
      kinematicSteps: bioroboticsResult.gcodeKinematicSequence.length,
      executionDurationMs
    });

    const finalOutput: StalExecutionOutput = {
      status: 'STAL_PIPELINE_COMPLETE',
      session,
      stage1Bioassay: bioassayResult,
      stage2Biopharma: biopharmaResult,
      stage3Biorobotics: bioroboticsResult,
      ledgerReport
    };

    return {
      content: [{ type: 'text', text: JSON.stringify(finalOutput, null, 2) }]
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      isError: true,
      content: [{ type: 'text', text: JSON.stringify({ status: 'PIPELINE_ERROR', error: errorMsg }) }]
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await mcpServer.connect(transport);
  console.error('[SEOSIRI STAL MCP] Core engine connected via stdio transport.');
}

main().catch((err) => {
  console.error('[STAL MCP Fatal Error]:', err);
  process.exit(1);
});
