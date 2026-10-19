import type { WorkflowRunbook } from '../utils/workflowRunbookEngine.ts';

export const ENTERPRISE_MISSION_RUNBOOKS: WorkflowRunbook[] = [
  {
    id: 'run-cyber-zeroday',
    title: 'Zero-Day Quarantine & Memory Patch',
    code: 'MISSION-SEC-01',
    category: 'cybersecurity',
    description: 'Autonomous zero-day anomaly detection, eBPF micro-sandbox isolation, and local binary hot-patch verification across the mesh.',
    estimatedDuration: '4.8s',
    slaTargetSeconds: 15,
    currentStepIndex: 0,
    state: 'idle',
    totalTokensGenerated: 0,
    steps: [
      {
        id: 'sec-step-1',
        name: 'Local Heap Anomaly & Vector Triage',
        description: 'Deep scan node memory allocations against known attack signatures using Qwen 2.5 Coder 32B.',
        assignedAgent: 'Sentinel-Alpha',
        assignedRole: 'Security Anomaly Analyst',
        model: 'Qwen-2.5-Coder-32B (Q4_K_M)',
        requiresHumanApproval: false,
        status: 'pending'
      },
      {
        id: 'sec-step-2',
        name: 'Dynamic eBPF Syscall Filter Generation',
        description: 'Synthesize custom kernel-level eBPF filter rule to sever unauthorized socket bindings.',
        assignedAgent: 'Kernel-Guardian',
        assignedRole: 'Low-Level Kernel Engineer',
        model: 'DeepSeek-R1-Distill-70B (Q4_K_M)',
        requiresHumanApproval: false,
        status: 'pending',
        dependsOn: ['sec-step-1']
      },
      {
        id: 'sec-step-3',
        name: 'Supervisor Authorization Gate',
        description: 'Cryptographic authorization sign-off by SecOps officer to broadcast micro-patch to ring.',
        assignedAgent: 'Human-in-the-Loop',
        assignedRole: 'Chief Information Security Officer',
        model: 'Apple Secure Enclave Hardware Token',
        requiresHumanApproval: true,
        status: 'pending',
        dependsOn: ['sec-step-2']
      },
      {
        id: 'sec-step-4',
        name: 'Cluster-Wide Hot-Patch Broadcast',
        description: 'Inject live binary patch via Thunderbolt 4 DMA ring; verify zero service interruption.',
        assignedAgent: 'Mesh-Orchestrator',
        assignedRole: 'Distributed Systems Lead',
        model: 'Llama-3.3-70B (Q4_K_M)',
        requiresHumanApproval: false,
        status: 'pending',
        dependsOn: ['sec-step-3']
      }
    ]
  },
  {
    id: 'run-ma-diligence',
    title: 'Air-Gapped M&A Due Diligence & Codebase Scan',
    code: 'MISSION-FIN-02',
    category: 'ma-due-diligence',
    description: 'Confidential parsing of 450,000 lines of proprietary target acquisition code, license risk audit, and debt modeling without cloud leakage.',
    estimatedDuration: '12.4s',
    slaTargetSeconds: 30,
    currentStepIndex: 0,
    state: 'idle',
    totalTokensGenerated: 0,
    steps: [
      {
        id: 'ma-step-1',
        name: 'Proprietary IP Ingestion & Embedding',
        description: 'Ingest confidential git repositories into local vector cortex with 4096-dim embeddings.',
        assignedAgent: 'Vault-Ingestor',
        assignedRole: 'Data Privacy Officer',
        model: 'BGE-Large-En-v1.5 (Local Metal)',
        requiresHumanApproval: false,
        status: 'pending'
      },
      {
        id: 'ma-step-2',
        name: 'GPL Contamination & Trade Secret Audit',
        description: 'Exhaustive semantic scan for unlicensed copyleft dependencies or patented algorithms.',
        assignedAgent: 'IP-Counsel-Agent',
        assignedRole: 'Legal & Intellectual Property Lead',
        model: 'DeepSeek-R1-Distill-70B (Q4_K_M)',
        requiresHumanApproval: false,
        status: 'pending',
        dependsOn: ['ma-step-1']
      },
      {
        id: 'ma-step-3',
        name: 'Financial Valuation Risk Adjustments',
        description: 'Estimate technical debt remediation cost in millions and recalculate M&A enterprise valuation multiple.',
        assignedAgent: 'Quant-Valuator',
        assignedRole: 'Corporate Finance Lead',
        model: 'Llama-3.3-70B (Q4_K_M)',
        requiresHumanApproval: true,
        status: 'pending',
        dependsOn: ['ma-step-2']
      },
      {
        id: 'ma-step-4',
        name: 'Cryptographic Deal Room Attestation',
        description: 'Generate SHA-512 sealed clean-room certificate ensuring zero target IP left local hardware premises.',
        assignedAgent: 'Sovereignty-Auditor',
        assignedRole: 'Compliance Lead',
        model: 'Apple Secure Enclave Hardware Signer',
        requiresHumanApproval: false,
        status: 'pending',
        dependsOn: ['ma-step-3']
      }
    ]
  },
  {
    id: 'run-compliance-cert',
    title: 'Autonomous EU AI Act & HIPAA Recertification',
    code: 'MISSION-COMP-03',
    category: 'regulatory-audit',
    description: 'Real-time telemetry audit of model bias, local data gravity, memory zeroing on reboot, and exportable regulatory audit packages.',
    estimatedDuration: '6.5s',
    slaTargetSeconds: 20,
    currentStepIndex: 0,
    state: 'idle',
    totalTokensGenerated: 0,
    steps: [
      {
        id: 'comp-step-1',
        name: 'Deterministic Inference Log Audit',
        description: 'Scan past 100,000 prompt-response pairings for hallucination drift and non-repudiation seals.',
        assignedAgent: 'Audit-Watcher',
        assignedRole: 'Risk & Governance Analyst',
        model: 'Phi-4-14B (Q4_K_M)',
        requiresHumanApproval: false,
        status: 'pending'
      },
      {
        id: 'comp-step-2',
        name: 'Air-Gap Physical & Socket Proof Check',
        description: 'Probe all network sockets, Wi-Fi interfaces, and WAN gateways to confirm 0 active external connections.',
        assignedAgent: 'Socket-Probe',
        assignedRole: 'Network Hardening Engineer',
        model: 'Mistral-NeMo-12B (Q4_K_M)',
        requiresHumanApproval: false,
        status: 'pending',
        dependsOn: ['comp-step-1']
      },
      {
        id: 'comp-step-3',
        name: 'Supervisory Board Compliance Seal',
        description: 'Independent verification of Article 14 (Human Oversight) compliance before stamping certificate.',
        assignedAgent: 'Human-Supervisor',
        assignedRole: 'Lead Compliance Controller',
        model: 'Manual Executive Key',
        requiresHumanApproval: true,
        status: 'pending',
        dependsOn: ['comp-step-2']
      }
    ]
  }
];
