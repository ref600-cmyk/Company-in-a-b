export type NavTab = 
  | 'market' 
  | 'valuation' 
  | 'academic-moat' 
  | 'tco-calculator'
  | 'mac-pro-station'
  | 'hardware' 
  | 'mesh-topology'
  | 'knowledge-vault'
  | 'mission-control'
  | 'model-zoo'
  | 'swarm' 
  | 'studio' 
  | 'skill-store'
  | 'compliance'
  | 'deployment' 
  | 'ai-architect';

export interface HardwarePreset {
  id: string;
  name: string;
  category: 'mac-mini' | 'mac-studio' | 'cluster' | 'enterprise';
  chip: string;
  unifiedMemoryGB: number;
  memoryBandwidthGBs: number;
  approxPriceUSD: number;
  powerWatts: number;
  description: string;
  recommendedRole: string;
  supportedModels: string[];
  maxConcurrentAgents: number;
  tokensPerSec: number;
}

export interface ModelSpec {
  id: string;
  name: string;
  parameters: string;
  quantization: string;
  ramRequiredGB: number;
  bestFor: string;
  engine: 'MLX' | 'Ollama' | 'vLLM' | 'llama.cpp';
  contextWindow: number;
}

export interface CompetitorItem {
  name: string;
  category: 'Cloud SaaS' | 'Dev Framework' | 'Model Runner' | 'Coding Agent';
  localRun: 'No' | 'Partial (Complex)' | 'Yes (Inference only)' | 'Yes';
  autonomousSwarm: 'Yes' | 'Developer-built' | 'No' | 'Limited';
  macMiniOptimized: 'No' | 'Requires manual setup' | 'Yes' | 'No';
  enterpriseSecurity: 'Cloud-dependent' | 'Self-implemented' | 'Local only' | 'Enterprise Ready';
  pricing: string;
  pros: string;
  cons: string;
  gapIdentified: string;
}

export interface AgentRole {
  id: string;
  name: string;
  role: string;
  department: 'Engineering' | 'Finance' | 'Executive' | 'Operations' | 'Research' | 'Security';
  avatar: string;
  model: string;
  memoryQuotaMB: number;
  permissionLevel: 'Supervised' | 'Autonomous' | 'Critical Checkpoint';
  systemPrompt: string;
  tools: string[];
  status: 'idle' | 'thinking' | 'executing' | 'waiting_approval' | 'completed' | 'error';
  currentAction?: string;
}

export interface SwarmMission {
  id: string;
  title: string;
  description: string;
  category: string;
  participatingAgents: string[];
  steps: {
    agentId: string;
    action: string;
    toolUsed?: string;
    outputSample: string;
    durationMs: number;
    requiresApproval?: boolean;
  }[];
}

export interface SwarmLogEntry {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  level: 'info' | 'tool' | 'decision' | 'warning' | 'success';
  message: string;
  detail?: string;
}

// Financial Valuation & Forecast interfaces
export interface ValuationMetric {
  category: string;
  scoreOutOf10: number;
  weight: number;
  verdict: string;
  justification: string;
}

export interface FinancialYearProjection {
  year: number;
  yearLabel: string;
  appliancesShipped: number;
  activeSoftwareNodes: number;
  hardwareRevenueUSD: number;
  softwareArrUSD: number;
  totalRevenueUSD: number;
  grossMarginPercent: number;
  netMarginPercent: number;
  headcount: number;
  cashFlowUSD: number;
  enterpriseValuationUSD: number;
}

export interface AcademicProofItem {
  id: string;
  title: string;
  domain: 'Hardware Architecture' | 'Model Quantization' | 'Distributed Consensus' | 'Information Flow Security';
  citation: string;
  keyFinding: string;
  applicabilityToSkyShadow: string;
  moatRating: 'Fundamental' | 'Very High' | 'High';
}

export interface DependencyMoatStrategy {
  pillar: string;
  headline: string;
  mechanism: string;
  howEveryoneDependsOnUs: string;
  defensibilityScore: number;
}

// Milestone 7 additions: Sovereign Skill Store & Compliance Audit
export interface SovereignSkillItem {
  id: string;
  name: string;
  category: 'Enterprise ERP' | 'Healthcare' | 'Defense & ITAR' | 'Software Engineering' | 'Legal & Compliance' | 'Speech & Audio';
  description: string;
  author: string;
  version: string;
  cryptoSeal?: string;
  cryptoSignature: string;
  requiredMemoryMB: number;
  airGapCertified: boolean;
  permissionBoundary: string;
  installed: boolean;
  tags: string[];
  capabilities: string[];
}

export interface ComplianceControl {
  id: string;
  standard: 'ISO 27001' | 'SOC 2 Type II' | 'EU AI Act' | 'HIPAA' | 'UK DPA / GDPR';
  controlName: string;
  clause: string;
  status: 'passed' | 'enforced' | 'verified';
  evidence: string;
  technicalMechanism: string;
}
