# @seosiri/stal-mcp

> 📖 **Architecture & Clinical Specifications:** [SEOSIRI Theranostic Autonomous Loop](https://www.seosiri.com/2026/08/stal-mcp.html) | [Developer Portal](https://developers.seosiri.com)

SEOSIRI Theranostic Autonomous Loop (STAL) is an enterprise-grade Model Context Protocol (MCP) server uniting **BioAssay Target Verification**, **Biopharma Molecular Synthesis**, and **BioRobotics Surgical Kinematic Actuation** under zero-trust HIPAA/GDPR PII stripping and real-time metered billing.

## 👨‍💻 Lead Architect
Designed and architected by **[Momenul Ahmad](https://github.com/MOBILEPHONE)**, Founder of **[SEOSiri](https://seosiri.com)**.

## 🚀 The 4-Stage Autonomous Pipeline
1. **PII Shield Gateway:** Volatile in-memory stripping of all 18 HIPAA Safe Harbor identifiers.
2. **BioAssay Micro-Validation:** Evaluates tissue phenotype arrays & cellular target confidence.
3. **Biopharma Molecular Synthesizer:** Validates candidate structures against toxicity limits and formats CDISC SDTM v1.7 records.
4. **BioRobotics Kinematic Planner:** Converts target voxel coordinates \([X,Y,Z]\) into deterministic G-code surgical trajectories.
5. **Metered Billing Engine:** Tracks computational resource units and signs immutable SHA-256 transaction ledgers.

## 🔌 Quickstart & Claude Desktop Setup

```bash
npm install @seosiri/stal-mcp
npm run build
npm test
```

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "seosiri-stal-core-engine": {
      "command": "node",
      "args": [
        "D:/stal-mcp/dist/index.js"
      ]
    }
  }
}
```
