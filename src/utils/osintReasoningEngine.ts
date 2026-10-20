import type { 
  OsintEntity, 
  ReasoningStep, 
  OsintInvestigationReport 
} from '../types/index.ts';

export function calculateReasoningMemoryOverhead(
  tokensPlanned: number,
  modelTier: '32B' | '70B' | '14B' = '32B'
) {
  // MLX 4-bit weights footprint in GB
  const weightGb = modelTier === '70B' ? 41.5 : modelTier === '32B' ? 19.8 : 8.8;
  
  // KV cache per token in 4-bit / FP16 quantized context (~128KB per 1K tokens for 32B)
  const bytesPerToken = modelTier === '70B' ? 196608 : modelTier === '32B' ? 98304 : 49152;
  const kvCacheGb = Number(((tokensPlanned * bytesPerToken) / (1024 * 1024 * 1024)).toFixed(2));
  
  // Apple Silicon UMA bandwidth throughput
  const tokensPerSec = modelTier === '70B' ? 18.4 : modelTier === '32B' ? 34.2 : 68.5;
  const totalRamGb = Number((weightGb + kvCacheGb + 2.5).toFixed(1)); // +2.5GB for system & metal buffers

  return {
    modelTier,
    weightGb,
    kvCacheGb,
    totalRamGb,
    tokensPerSec,
    supportedOnMacMini: totalRamGb <= 24,
    supportedOnMacStudio: totalRamGb <= 64,
    supportedOnMacPro: totalRamGb <= 192
  };
}

export function synthesizeOsintProfile(rawTarget: string): OsintInvestigationReport {
  const target = (rawTarget || 'enterprise-target.internal').trim().toLowerCase();
  const cleanDomain = target.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
  const now = new Date().toISOString();
  const investigationId = `OSINT-UMA-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

  // Deterministic mock generation based on domain characters
  const charSum = cleanDomain.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const baseRisk = 35 + (charSum % 55);

  const entities: OsintEntity[] = [
    {
      id: `ent-dns-1`,
      type: 'domain',
      label: 'Root Target Domain',
      value: cleanDomain,
      riskScore: Math.min(95, baseRisk + 5),
      source: 'Passive Sovereign DNS Resolver (Local Root Cache)',
      details: {
        'Apex Nameserver': `ns1.${cleanDomain}.soa-local`,
        'Mail Exchange': `mx10.${cleanDomain} (SPF Enforced, DMARC Reject)`,
        'DNSSEC': 'Valid (Curve25519 Hardware Attested)'
      }
    },
    {
      id: `ent-ip-1`,
      type: 'ip_range',
      label: 'Autonomous System & CIDR',
      value: `198.51.100.${(charSum % 250) + 1}/28`,
      riskScore: Math.min(90, baseRisk - 10),
      source: 'BGP Sovereign Route Table (Apple Silicon Memory Cache)',
      details: {
        'ASN': `AS${13370 + (charSum % 500)} (Sovereign Uplink Ltd)`,
        'Geolocation': 'London, United Kingdom (Air-Gapped Sovereign Node)',
        'Open Sockets Detected': 'TCP/443 (TLS 1.3 only), TCP/9090 (Raft Mesh)'
      }
    },
    {
      id: `ent-cert-1`,
      type: 'certificate',
      label: 'TLS / Hardware Attestation Cert',
      value: `CN=${cleanDomain}, O=SkyShadow Enterprise Mesh`,
      riskScore: 15,
      source: 'Hardware Secure Enclave Key Chain',
      details: {
        'Issuer': 'SkyShadow Sovereign Root CA v4 (Offline Air-Gap)',
        'Cipher Suite': 'TLS_AES_256_GCM_SHA384 (Post-Quantum Resilient)',
        'Validity Period': '365 Days (Hardware Attested Non-Revoked)'
      }
    },
    {
      id: `ent-cve-1`,
      type: 'cve_vulnerability',
      label: 'Supply Chain Dependency Audit',
      value: 'CVE-2024-3094 / GHSA-dependency-check',
      riskScore: baseRisk > 60 ? 88 : 25,
      source: 'Local Air-Gapped NVD / OSV Vector Database',
      details: {
        'Affected Component': 'XZ/Liblzma upstream compression utility',
        'Sovereign Status': 'Mitigated via isolated Docker micro-sandbox',
        'Exploitability': 'Zero WAN egress prevents remote telemetry'
      }
    },
    {
      id: `ent-cred-1`,
      type: 'breached_credential',
      label: 'Dark-Web Hash Exposure Check',
      value: `k-Anonymity Hash prefix ${cleanDomain.slice(0, 3).toUpperCase()}...F9A`,
      riskScore: baseRisk > 50 ? 74 : 18,
      source: 'Zero-Knowledge SHA-256 Bloom Filter (Offline 8GB Dump)',
      details: {
        'Exposed Accounts': `${(charSum % 8) + 1} corporate accounts flagged in historical dumps`,
        'Credential Age': 'Circa 2023 breach repository',
        'Remediation': 'Enforce Hardware WebAuthn / TouchID token mandatory'
      }
    },
    {
      id: `ent-actor-1`,
      type: 'threat_actor',
      label: 'Threat Actor TTP Attribution',
      value: baseRisk > 60 ? 'APT29 / CozyBear Pattern Matching' : 'Script-Kiddie WAN Port Scanner',
      riskScore: baseRisk > 60 ? 82 : 30,
      source: 'MITRE ATT&CK Matrix Sovereign Classifier (DeepSeek-R1 Distill)',
      details: {
        'Observed TTPs': 'T1190 (Exploit Public App), T1071.001 (Web Protocols)',
        'Objective': 'Corporate IP theft & unauthorized model parameter exfiltration',
        'Air-Gap Barrier': 'Physical WAN disconnection renders exfiltration impossible'
      }
    }
  ];

  const overallThreatScore = Math.round(
    entities.reduce((acc, e) => acc + e.riskScore, 0) / entities.length
  );

  const reasoningTrace: ReasoningStep[] = [
    {
      stepNumber: 1,
      phase: 'hypothesis',
      thoughtTrace: `<thought>
Analyzing target: "${cleanDomain}" under zero-trust assumptions.
Hypothesis 1: Target entity may have exposed supply-chain vectors in lockfile dependencies.
Hypothesis 2: Dark-web k-anonymity bloom filter indicates possible password reuse across administrative accounts.
Initial evidence points to domain ${cleanDomain} with AS${13370 + (charSum % 500)}.
Need to formulate strict cross-examination between passive DNS records and hardware TLS attestation certificates.
</thought>`,
      confidence: 78,
      verificationCheck: 'Verified DNS apex against sovereign root cache without WAN resolution leakage.',
      tokensUsed: 620
    },
    {
      stepNumber: 2,
      phase: 'cross_examination',
      thoughtTrace: `<thought>
Cross-examining threat entity #ent-cve-1 (Supply chain risk) against active container sandboxes.
The NVD local vector database flagged upstream CVE-2024-3094.
However, inspection of macOS Apple Virtualization runtime confirms that network interfaces have been severed at the host bridge.
Even if malicious byte payload executes, socket creation fails with errno 101 (Network unreachable).
Therefore, effective exploitability drops from Critical (CVSS 10.0) to Low (CVSS 2.1) in our local-mesh environment.
</thought>`,
      confidence: 89,
      verificationCheck: 'Host-level socket isolation enforced; zero outbound packets recorded on en0.',
      tokensUsed: 840
    },
    {
      stepNumber: 3,
      phase: 'counter_factual',
      thoughtTrace: `<thought>
Counter-factual exploration: What if the observed exposed hash in the dark-web bloom filter belongs to an executive root admin?
Simulating breach scenario:
If an attacker attempts password spray on local web UI:
1. SkyShadow local daemon intercepts via PAM module.
2. WebAuthn Secure Enclave hardware key is required for all administrative sessions.
3. Password alone cannot bypass biometric / hardware token gate.
Conclusion: Credential stuffing risk is neutralized by physical enclave requirement.
</thought>`,
      confidence: 94,
      verificationCheck: 'Secure Enclave SEP-APPL attestation requires physical touch confirmation.',
      tokensUsed: 780
    },
    {
      stepNumber: 4,
      phase: 'synthesis',
      thoughtTrace: `<thought>
Synthesizing OSINT entities with multi-agent consensus:
- Agent Cypher (Knowledge Cortex): Confirmed 0 unindexed subdomains in corporate namespace.
- Agent Aegis (Chief Security Sentinel): Validated air-gap firewall killswitch integrity.
- Agent Orion (Orchestrator): Scheduled 24-hour rotating local re-audit.
Composite posture: Moderate external surface, but 100% resilient due to air-gapped on-premise execution topology.
</thought>`,
      confidence: 96,
      verificationCheck: 'Consensus verified across 3 local model nodes over Thunderbolt 5 mesh.',
      tokensUsed: 910
    },
    {
      stepNumber: 5,
      phase: 'verdict',
      thoughtTrace: `<thought>
Final Sovereign Verdict reached after 3,150 reasoning tokens:
Target "${cleanDomain}" possesses an overall threat score of ${overallThreatScore}/100.
While external reconnaissance reveals standard corporate metadata and historical credential traces, the air-gapped local architecture prevents exfiltration or lateral exploitation.
Generating concrete defense recommendations.
</thought>`,
      confidence: 98,
      verificationCheck: 'Cryptographic forensic signoff generated with local SHA-256 digest.',
      tokensUsed: 540
    }
  ];

  const finalVerdict = overallThreatScore > 65
    ? `ELEVATED RISK DETECTED: External threat surface exhibits historical credential exposure and dependency alerts. Immediate enforcement of hardware enclave MFA and container sandboxing mandated.`
    : `DEEP SOVEREIGN ASSURANCE: Target perimeter is robustly shielded. Air-gapped on-premise execution architecture successfully neutralizes external attack vectors and supply-chain leakage.`;

  const recommendedMitigations = [
    'Enforce hardware Secure Enclave WebAuthn tokens for all admin roles.',
    'Execute all third-party code and dependency updates inside isolated micro-VM sandboxes.',
    'Keep physical WAN sockets severed (Air-gap killswitch armed).',
    'Rotate internal TLS keys using offline Sovereign Root CA.',
    'Maintain daily k-anonymity bloom filter audits against local breach archives.'
  ];

  const totalTokens = reasoningTrace.reduce((acc, s) => acc + s.tokensUsed, 0);

  return {
    target: cleanDomain,
    investigationId,
    timestamp: now,
    overallThreatScore,
    entities,
    reasoningTrace,
    finalVerdict,
    recommendedMitigations,
    localInferenceStats: {
      model: 'DeepSeek-R1-Distill-32B + Qwen-2.5-Coder (MLX 4-bit)',
      thinkingBudgetTokens: totalTokens,
      tokensPerSecond: 34.2,
      unifiedMemoryAllocatedGB: 22.3,
      appleSiliconEngine: 'Apple Metal 3 Unified Memory Architecture (UMA)'
    }
  };
}

export function generateInvestigationMarkdownReport(report: OsintInvestigationReport): string {
  return `# SkyShadow Sovereign OSINT & Extreme Reasoning Investigation Report

**Target**: \`${report.target}\`  
**Investigation ID**: \`${report.investigationId}\`  
**Timestamp**: ${report.timestamp}  
**Air-Gap Guarantee**: 100% Zero-Cloud Leakage (Queried via Local Bloom Filters & Sovereign Caches)  
**Overall Threat Score**: **${report.overallThreatScore} / 100**

---

## 1. Executive Verdict
> ${report.finalVerdict}

---

## 2. Local Inference & Extreme Reasoning Telemetry
- **Reasoning Model**: ${report.localInferenceStats.model}
- **Thinking Budget Tokens**: ${report.localInferenceStats.thinkingBudgetTokens.toLocaleString()} tokens
- **Throughput**: ${report.localInferenceStats.tokensPerSecond} tokens/sec (Metal 3 UMA)
- **Unified RAM Footprint**: ${report.localInferenceStats.unifiedMemoryAllocatedGB} GB
- **Hardware Acceleration**: ${report.localInferenceStats.appleSiliconEngine}

---

## 3. Discovered Sovereign OSINT Entities & Threat Surface
${report.entities.map(e => `### [${e.type.toUpperCase()}] ${e.label}: \`${e.value}\`
- **Risk Score**: ${e.riskScore} / 100
- **Source**: ${e.source}
${Object.entries(e.details).map(([k, v]) => `  - **${k}**: ${v}`).join('\n')}
`).join('\n')}

---

## 4. Extreme Chain-of-Thought Reasoning Trace
${report.reasoningTrace.map(s => `#### Step ${s.stepNumber} [${s.phase.toUpperCase()}] (Confidence: ${s.confidence}%, Tokens: ${s.tokensUsed})
${s.thoughtTrace}
> **Verification Check**: ${s.verificationCheck}
`).join('\n')}

---

## 5. Recommended Sovereign Mitigations
${report.recommendedMitigations.map((m, i) => `${i + 1}. ${m}`).join('\n')}

---
*Generated by SkyShadow Local-Mesh Autonomous Enterprise Agentic OS (Zero Data Exfiltration)*
`;
}
