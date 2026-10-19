import type { KnowledgeNode } from '../utils/meshTopologyEngine.ts';

export const ENTERPRISE_KNOWLEDGE_NODES: KnowledgeNode[] = [
  {
    id: 'kn-core-arch',
    label: 'Proprietary Core Execution Engine (Rust/Metal)',
    category: 'code',
    classification: 'TOP-SECRET',
    chunkCount: 1840,
    vectorDimensions: 1024,
    embeddingModel: 'bge-m3-local-quantized',
    sha256Seal: 'e7f8901234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    connectedNodeIds: ['kn-sec-ciso', 'kn-algo-trading'],
    summary: 'Hardware-level unified memory ring buffers, zero-copy MLX tensor sharing, and Thunderbolt 4 DMA packet parsers.',
    tags: ['metal', 'rust', 'kernel', 'apple-silicon', 'dma']
  },
  {
    id: 'kn-sec-ciso',
    label: 'CISO Air-Gapped Security Controls & Audit Trail',
    category: 'compliance',
    classification: 'CONFIDENTIAL',
    chunkCount: 620,
    vectorDimensions: 1024,
    embeddingModel: 'bge-m3-local-quantized',
    sha256Seal: 'a1b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcdef',
    connectedNodeIds: ['kn-core-arch', 'kn-eu-ai-act', 'kn-iso27001'],
    summary: 'Cryptographic attestation logs proving physical air-gap status, zero WAN telemetry, and human-in-the-loop authorization signatures.',
    tags: ['ciso', 'soc2', 'audit', 'cryptography', 'attestation']
  },
  {
    id: 'kn-eu-ai-act',
    label: 'EU AI Act Article 14 Human Oversight System',
    category: 'compliance',
    classification: 'RESTRICTED',
    chunkCount: 410,
    vectorDimensions: 1024,
    embeddingModel: 'bge-m3-local-quantized',
    sha256Seal: 'f9e8d7c6b5a432101234567890abcdef1234567890abcdef1234567890abcdef',
    connectedNodeIds: ['kn-sec-ciso'],
    summary: 'Automated policy bounds, kill-switch circuit breakers, and unalterable local disk audit journal required by High-Risk AI classifications.',
    tags: ['eu-ai-act', 'compliance', 'legal', 'risk']
  },
  {
    id: 'kn-iso27001',
    label: 'ISO/IEC 27001:2022 ISMS Annex A Controls',
    category: 'compliance',
    classification: 'CONFIDENTIAL',
    chunkCount: 780,
    vectorDimensions: 1024,
    embeddingModel: 'bge-m3-local-quantized',
    sha256Seal: 'b4c3d2e1f0a98765432101234567890abcdef1234567890abcdef1234567890',
    connectedNodeIds: ['kn-sec-ciso'],
    summary: 'Complete technical mappings for A.8.20 Network Security, A.8.24 Use of Cryptography, and A.8.28 Secure Coding.',
    tags: ['iso27001', 'isms', 'security-controls']
  },
  {
    id: 'kn-algo-trading',
    label: 'High-Frequency Order Routing & Execution Models',
    category: 'strategy',
    classification: 'TOP-SECRET',
    chunkCount: 3200,
    vectorDimensions: 1024,
    embeddingModel: 'bge-m3-local-quantized',
    sha256Seal: 'c5d4e3f2a1b098765432101234567890abcdef1234567890abcdef1234567890',
    connectedNodeIds: ['kn-core-arch', 'kn-fin-ledger'],
    summary: 'Ultra-low latency statistical arbitrage heuristics, order book depth predictive models, and risk limits.',
    tags: ['trading', 'quantitative', 'finance', 'low-latency']
  },
  {
    id: 'kn-fin-ledger',
    label: 'Consolidated Executive P&L and 5-Year Budget Plan',
    category: 'finance',
    classification: 'TOP-SECRET',
    chunkCount: 950,
    vectorDimensions: 1024,
    embeddingModel: 'bge-m3-local-quantized',
    sha256Seal: 'd6e5f4a3b2c1098765432101234567890abcdef1234567890abcdef1234567890',
    connectedNodeIds: ['kn-algo-trading', 'kn-corp-mna'],
    summary: 'Audited financial statements, EBITDA margins, hardware CapEx depreciation schedules, and SaaS replacement payback models.',
    tags: ['financials', 'pnl', 'ebitda', 'budget', 'arr']
  },
  {
    id: 'kn-corp-mna',
    label: 'Strategic M&A Targets and Enterprise IP Portfolio',
    category: 'strategy',
    classification: 'TOP-SECRET',
    chunkCount: 540,
    vectorDimensions: 1024,
    embeddingModel: 'bge-m3-local-quantized',
    sha256Seal: 'e7f6a5b4c3d21098765432101234567890abcdef1234567890abcdef1234567890',
    connectedNodeIds: ['kn-fin-ledger'],
    summary: 'Valuation models for edge AI hardware startups, patent defensibility filings, and non-disclosure agreements.',
    tags: ['mna', 'patents', 'enterprise-strategy', 'acquisitions']
  },
  {
    id: 'kn-api-gateway',
    label: 'Local ERP & Legacy Mainframe Connector Protocol',
    category: 'code',
    classification: 'INTERNAL',
    chunkCount: 1120,
    vectorDimensions: 1024,
    embeddingModel: 'bge-m3-local-quantized',
    sha256Seal: 'f8a7b6c5d4e321098765432101234567890abcdef1234567890abcdef1234567890',
    connectedNodeIds: ['kn-core-arch'],
    summary: 'Zero-cloud proxies for SAP ECC 6.0, Salesforce On-Premise, Oracle Database 19c, and internal REST/gRPC endpoints.',
    tags: ['erp', 'sap', 'oracle', 'legacy-integration', 'grpc']
  }
];

export const SAMPLE_VECTOR_QUERIES = [
  'Zero-copy Apple Metal unified memory ring buffer',
  'CISO air-gapped cryptographic audit logs and SOC 2 proofs',
  'EU AI Act Article 14 human oversight circuit breaker',
  'Consolidated financial CapEx payback schedule and EBITDA',
  'High-frequency statistical arbitrage execution models',
  'Local SAP and Oracle ERP zero-cloud connector'
];
