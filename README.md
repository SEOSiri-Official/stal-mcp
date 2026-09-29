# @seosiri/stal-mcp

[![NPM Version](https://img.shields.io/npm/v/@seosiri/stal-mcp?color=0284c7&label=npm%20package)](https://www.npmjs.com/package/@seosiri/stal-mcp)
[![Edge Gateway](https://img.shields.io/badge/Edge%20Gateway-stal.seosiri.com-10b981)](https://stal.seosiri.com/health)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/SEOSiri-Official/stal-mcp/blob/main/LICENSE)
[![HIPAA Compliant](https://img.shields.io/badge/HIPAA-Zero--Retention%20PII%20Shield-8b5cf6)](https://developers.seosiri.com)

> 📋 **Official Architectural Specification:** [SEOSIRI Theranostic Autonomous Loop (STAL) Core Engine](https://www.seosiri.com/2026/08/stal-mcp.html) | [Developer Portal](https://developers.seosiri.com)

The **SEOSIRI Theranostic Autonomous Loop (STAL)** is an enterprise-grade Model Context Protocol (MCP) server uniting **BioAssay Target Verification**, **Biopharma Molecular Synthesis**, and **BioRobotics Surgical Kinematic Actuation** under volatile zero-retention HIPAA/GDPR PII stripping and real-time metered transaction billing.

Designed for clinical oncology research networks, automated high-throughput screening (HTS) laboratories, and autonomous surgical robotic guidance systems.

---

## 👨‍💻 Lead Architect & Systems Attribution
Designed and engineered by **[Momenul Ahmad](https://github.com/MOBILEPHONE)**, Founder and Principal AI Systems Architect at **[SEOSiri](https://seosiri.com)**.

---

## 🏛️ Autonomous Pipeline Architecture

```text
[ Hospital EHR / Clinical Client ]
               │
               ▼ (TLS 1.3 / stdio)
┌──────────────────────────────────────────────────┐
│ STAL EDGE ACCESS LAYER (HIPAA ZERO-RETENTION PII) │
│ - Ephemeral in-memory execution (zero disk commits)│
│ - Redacts all 18 HIPAA Safe Harbor identifiers     │
│ - Signs cryptographic HMAC session validation tokens│
└──────────────────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────┐
│ STAGE 1: BIOASSAY MICRO-VALIDATION ENGINE         │
│ - Evaluates tissue phenotype arrays & anomalies    │
│ - Cross-references TR-FRET, UA-Glo, and ELISA loops│
│ - Halts execution if cellular target affinity < 95%│
└──────────────────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────┐
│ STAGE 2: BIOPHARMA MOLECULAR SYNTHESIZER          │
│ - 4PL non-linear regression sigmoidal curve fitting│
│ - Validates molecular SMILES against toxicity bounds│
│ - Formats CDISC SDTM v1.7 observation compliance sets│
└──────────────────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────┐
│ STAGE 3: BIOROBOTICS KINEMATIC PLANNER            │
│ - Translates [X, Y, Z] target voxel matrices       │
│ - Density boundary and surgical tool clearance checks│
│ - Outputs deterministic robotic G-code trajectories│
└──────────────────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────┐
│ STAL AUDIT & METERED CHARGING ENGINE              │
│ - Base fee: $7.50 USD                              │
│ - Compute scaling: +$0.85/struct, +$0.12/step      │
│ - Execution latency tracking: +$0.0025/ms          │
│ - Emits immutable SHA-256 ledger proof hash        │
└──────────────────────────────────────────────────┘
```

---

## 🚀 Tool Specifications

### `execute_stal_pipeline`
Orchestrates the entire end-to-end theranostic loop in a single atomic tool call.

#### Input Schema (JSON-RPC 2.0 / Zod)
```json
{
  "session_token": "CLINICAL-SES-99",
  "developer_account_id": "HOSPITAL-AOCR-01",
  "assay_telemetry": {
    "assay_method": "TR-FRET",
    "matrix_payload_base64": "Q0VMTF9URVNUX0RBVEE=",
    "min_confidence_threshold": 0.85
  },
  "target_molecular_profile": {
    "allowed_toxicity_threshold": 0.05,
    "preferred_conjugate_class": "KINASE"
  },
  "spatial_kinematic_constraints": {
    "voxel_target_matrix": [14.2, 55.8, 120.4],
    "hardware_profile_id": "ROBOT-SURGICAL-ARM-01"
  }
}
```

#### Production Execution Output
```json
{
  "status": "STAL_PIPELINE_COMPLETE",
  "session": {
    "sessionId": "STAL-EDGE-AA976441",
    "timestamp": "2026-09-29T03:56:41.752Z",
    "isSanitized": true,
    "edgeLocation": "CLOUDFLARE_GLOBAL_NETWORK"
  },
  "stage1Bioassay": {
    "status": "VERIFIED",
    "confidenceScore": 0.88,
    "receptorProfile": "HER2_VEGF_KINASE_CONJUGATE_STABLE"
  },
  "stage2Biopharma": {
    "status": "COMPOUND_SYNTHESIZED",
    "candidateMolecule": "SEOSIRI-SYN-KINASE-099",
    "ec50Molar": 1.45e-9,
    "cdiscSdtmRecord": {
      "STUDYID": "STAL-CLINICAL-2026",
      "DOMAIN": "PC",
      "PCTESTCD": "AFFINITY",
      "PCORRES": "1.45",
      "PCORRESU": "nmol/L"
    }
  },
  "stage3Biorobotics": {
    "status": "TRAJECTORY_LOCKED",
    "gcodeKinematicSequence": [
      "G90 ; Absolute coordinate system",
      "G0 X13.700 Y55.300 Z125.400 F3000",
      "G1 X14.200 Y55.800 Z120.400 F600",
      "G0 Z130.400 F2400",
      "M84 ; Stepper release"
    ],
    "clearanceVerified": true
  },
  "ledgerReport": {
    "baseFrameworkFee": 7.5,
    "biopharmaComputeFee": 2.55,
    "bioroboticsComputeFee": 0.6,
    "executionDurationFee": 0,
    "totalBillableUnitsUsd": 10.65,
    "immutableLedgerHash": "c1ed4e1fed734b8cad7451f0498f6499d86308cf23da4d40a1aaa854888176f5"
  }
}
```

---

## 🔌 Connection Setup for AI Clients

### Option A: Local Stdio Execution (Claude Desktop & Cursor IDE)
Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "seosiri-stal-core-engine": {
      "command": "npx",
      "args": ["-y", "@seosiri/stal-mcp"]
    }
  }
}
```

### Option B: Remote Cloudflare Edge Transport (SSE / JSON-RPC)
Connect to the live edge gateway without local runtime dependencies:

* **JSON-RPC 2.0 Endpoint:** `https://stal.seosiri.com/v1/mcp`
* **SSE Stream Route:** `https://stal.seosiri.com/sse`
* **Live Health Check:** `https://stal.seosiri.com/health`

---

## 🛡️ Regulatory & Security Safeguards

* **HIPAA Safe Harbor Compliance:** Automatic regex scrubbing sanitizes Social Security Numbers, Medical Record Numbers (MRN), dates of birth, phone numbers, and email addresses prior to internal processing.
* **CDISC SDTM v1.7 Compatibility:** Standardized output dictionaries allow direct integration with clinical trial data management software.
* **Deterministic G-Code Generation:** Collision margins and clearance parameters prevent unintended tool contact with critical structures.

---

## 💳 Enterprise SLA & Payoneer Licensing

For high-volume clinical deployments exceeding 1,000 requests/minute, obtain a cryptographically signed Pro/Enterprise API Key via Payoneer settlement.

* **Developer Portal:** [developers.seosiri.com](https://developers.seosiri.com)
* **Corporate Desk:** [info@seosiri.com](mailto:info@seosiri.com)

---

## 📄 License

Published under the [MIT License](https://github.com/SEOSiri-Official/stal-mcp/blob/main/LICENSE). Copyright (c) 2026 SEOSiri-Official.