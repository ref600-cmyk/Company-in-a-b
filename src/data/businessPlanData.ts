import type { ValuationMetric } from '../types/index.ts';

export interface BusinessPlanContent {
  executiveSummary: string;
  overallRating: number;
  ratingTier: string;
  valuationRounds: {
    stage: string;
    timeline: string;
    valuationUSD: string;
    capitalRaisedUSD: string;
    milestone: string;
    comparableExit: string;
  }[];
  scorecardMetrics: ValuationMetric[];
  gtmPhases: {
    phase: string;
    title: string;
    duration: string;
    focus: string;
    tactics: string[];
    targetMetrics: string;
  }[];
  icpSegments: {
    title: string;
    badge: string;
    painPoint: string;
    whySkyShadowWins: string;
    dealSize: string;
  }[];
  pricingTiers: {
    tier: string;
    price: string;
    target: string;
    includes: string[];
  }[];
}

export const BUSINESS_PLAN: BusinessPlanContent = {
  executiveSummary: `SkyShadow Local-Mesh OS (skyshadow.co.uk) transforms off-the-shelf Apple Silicon hardware (starting at the $599 Mac Mini M4) into a turnkey, air-gapped autonomous enterprise agent appliance. By exploiting Apple Silicon's Unified Memory Architecture (UMA, 273–800 GB/s bandwidth), SkyShadow delivers 70B+ model inference and autonomous multi-agent coordination with ZERO data leakage, 90% cost savings over cloud APIs, and seamless Raft clustering from 1 office to 100+ corporate nodes.`,
  overallRating: 9.45,
  ratingTier: 'Unicorn-Grade Venture Potential (Top 1% Global AI Ideas)',
  scorecardMetrics: [
    {
      category: 'Market Timing & Catalysts',
      scoreOutOf10: 9.8,
      weight: 0.20,
      verdict: 'Perfect Storm',
      justification: 'The EU AI Act, HIPAA/GDPR, and enterprise IP leaks have made CIOs paranoid of cloud LLMs. Apple M4 hardware now enables 70B inference at $599-$1,799.'
    },
    {
      category: 'Technical Feasibility',
      scoreOutOf10: 9.5,
      weight: 0.20,
      verdict: 'Proven & Repeatable',
      justification: 'Apple MLX and Metal acceleration are production-grade. 4-bit quant preserves 99.1% reasoning accuracy with 273 GB/s memory bandwidth.'
    },
    {
      category: 'Regulatory Tailwind & Air-Gap Moat',
      scoreOutOf10: 9.9,
      weight: 0.15,
      verdict: 'Mandatory Compliance',
      justification: 'Law firms, financial institutions, defense contractors, and hospitals legally cannot use public cloud APIs. SkyShadow provides 100% legal compliance.'
    },
    {
      category: 'Unit Economics & Margins',
      scoreOutOf10: 9.2,
      weight: 0.15,
      verdict: 'SaaS + Hardware Blend',
      justification: 'Turnkey appliance sold with 35% hardware margin + high-retention $149/mo software subscription per node (92% software gross margin).'
    },
    {
      category: 'Defensibility & Network Effects',
      scoreOutOf10: 9.3,
      weight: 0.15,
      verdict: 'High Switching Cost',
      justification: 'Once a company builds its local vector memory graph and autonomous agent roles in SkyShadow, the replacement friction is enormous.'
    },
    {
      category: 'Scalability (SMB to Corporate)',
      scoreOutOf10: 9.0,
      weight: 0.15,
      verdict: 'Elastic Mesh',
      justification: 'Starts with 1 plug-and-play Mac Mini in an accounting boutique, expands to a Thunderbolt office quad, or scales to 100 on-prem K8s nodes.'
    }
  ],
  valuationRounds: [
    {
      stage: 'Pre-Seed / Genesis',
      timeline: 'Months 1 - 6',
      valuationUSD: '$8M - $12M',
      capitalRaisedUSD: '$1.5M - $2.5M',
      milestone: 'Working Mac Mini MLX appliance prototype + 20 pilot SMB customers.',
      comparableExit: 'Early Ollama / LangChain genesis rounds'
    },
    {
      stage: 'Seed Round',
      timeline: 'Months 7 - 18',
      valuationUSD: '$35M - $50M',
      capitalRaisedUSD: '$6M - $10M',
      milestone: '350 shipped appliances, $2.1M ARR, Raft clustering released.',
      comparableExit: 'CrewAI / AutoGen seed acceleration'
    },
    {
      stage: 'Series A',
      timeline: 'Months 19 - 36',
      valuationUSD: '$150M - $220M',
      capitalRaisedUSD: '$25M - $40M',
      milestone: '2,500 active clusters, $12M ARR, Fortune 500 branch trials.',
      comparableExit: 'Cognition / Devin $2B trajectory early comps'
    },
    {
      stage: 'Series B & Enterprise Expansion',
      timeline: 'Months 37 - 48',
      valuationUSD: '$600M - $900M',
      capitalRaisedUSD: '$75M - $100M',
      milestone: '12,000+ active enterprise nodes, $45M ARR, Global MSP channel agreements.',
      comparableExit: 'HashiCorp, Databricks enterprise inflection'
    },
    {
      stage: 'Series C / IPO Path',
      timeline: 'Year 5+',
      valuationUSD: '$2.5B - $4.5B+',
      capitalRaisedUSD: '$150M+',
      milestone: '38,000+ nodes, $120M+ ARR with 82% blended gross margin and net profitability.',
      comparableExit: 'Red Hat ($34B), Docker ($2.1B), Snowflake'
    }
  ],
  gtmPhases: [
    {
      phase: 'Phase 1: Direct SMB & Agency Wedge',
      title: 'The "Turnkey AI Box" for Boutique Firms',
      duration: 'Months 1 - 9',
      focus: 'Target tech agencies, law firms, accounting consultancies, and software development shops.',
      tactics: [
        'Pre-configured "SkyShadow Mini-Box" (pre-imaged M4 Pro Mac Mini shipped in branded box).',
        '30-Day Money-Back Guarantee: "Replace your $1,500/mo cloud API bill with a $1,899 one-time box".',
        'Word-of-mouth developer community evangelism & Open-Core Sovereign Mesh CLI.'
      ],
      targetMetrics: '300 appliances deployed, $1.2M blended revenue.'
    },
    {
      phase: 'Phase 2: Regulated Mid-Market Expansion',
      title: 'The Air-Gapped Compliance Solution',
      duration: 'Months 10 - 24',
      focus: 'HealthTech (HIPAA), Financial Services (FINRA/FCA), Defense Supply Chain (ITAR/ISO27001).',
      tactics: [
        'Release SkyShadow Thunderbolt Raft Clustering (chain 3-8 Mac Minis for 70B/405B inference).',
        'Formal security compliance certifications (SOC2 Type II, ISO 27001, HIPAA BAA air-gap guarantee).',
        'Partner with Apple Authorized Enterprise Resellers and Regional MSPs.'
      ],
      targetMetrics: '1,800 clusters, $8.5M ARR.'
    },
    {
      phase: 'Phase 3: Fortune 500 Enterprise Fleet Mesh',
      title: 'Global Sovereign Corporate Infrastructure',
      duration: 'Months 25 - 48',
      focus: 'Multinational corporations requiring regional edge data residency across 50+ countries.',
      tactics: [
        'Enterprise Hybrid Mesh: local branch office Mac Minis federated with on-premise private clouds.',
        'Sovereign AI Skill Store: Enterprise app store for internal corporate agent skills with zero telemetry.',
        'OEM appliance partnerships with Apple Enterprise & enterprise hardware integrators.'
      ],
      targetMetrics: '15,000+ nodes, $50M+ ARR.'
    }
  ],
  icpSegments: [
    {
      title: 'Boutique Law Firms & Legal Clinics',
      badge: 'High Value',
      painPoint: 'Attorney-client privilege strictly prohibits uploading client contracts, depositions, or M&A files to OpenAI/Anthropic.',
      whySkyShadowWins: '100% offline air-gapped contract audit agent runs on local hardware on the senior partner desk.',
      dealSize: '$2,500 setup + $199/mo'
    },
    {
      title: 'Fintech, Accounting & Audit Agencies',
      badge: 'Immediate ROI',
      painPoint: 'Financial ledger data and VAT/payroll documents cannot leave sovereign UK/EU jurisdiction.',
      whySkyShadowWins: 'Mercury agent reconciles 500+ invoices in minutes against local SQLite without external API calls.',
      dealSize: '$4,500 cluster + $499/mo'
    },
    {
      title: 'Software Dev Consultancies & SaaS Shops',
      badge: 'High Volume',
      painPoint: 'Proprietary IP leakage and runaway Claude 3.5 Sonnet token bills ($3,000-$10,000/month).',
      whySkyShadowWins: 'Vulcan agent runs 24/7 unlimited unit test generation and refactoring for $3/month electricity.',
      dealSize: '$6,000 multi-node + $699/mo'
    },
    {
      title: 'Healthcare Clinics & Medical Diagnostic Labs',
      badge: 'Mission Critical',
      painPoint: 'HIPAA and NHS Caldicott principles enforce criminal penalties for unauthorized patient PII transmission.',
      whySkyShadowWins: 'Zero-exfiltration micro-VM sandbox guarantees complete patient record confinement.',
      dealSize: '$12,000 division hub + $1,200/mo'
    }
  ],
  pricingTiers: [
    {
      tier: 'Appliance SMB Starter',
      price: '$1,899 hardware + $99/mo node fee',
      target: '1-15 person teams',
      includes: [
        'Pre-imaged Apple Mac Mini M4 (24GB Unified RAM)',
        'Pre-installed Qwen-Coder-14B & DeepSeek-R1-14B',
        'Local Vector Memory (LanceDB, 100k document limit)',
        'Up to 4 parallel autonomous agents',
        'Standard community & security updates'
      ]
    },
    {
      tier: 'Office Thunderbolt Mesh (Pro)',
      price: '$4,999 cluster + $349/mo cluster fee',
      target: '15-100 person companies',
      includes: [
        '3x Mac Mini M4 Pro nodes (192GB pooled RAM)',
        'Thunderbolt 5 (80Gbps) low-latency Raft consensus',
        'Llama-3.3-70B + Qwen-2.5-32B distributed inference',
        'Up to 16 parallel autonomous agents with Human-in-the-Loop',
        'Unlimited document vector indexing & priority SLA'
      ]
    },
    {
      tier: 'Enterprise Sovereign Corporate',
      price: '$18,000 - $60,000+ / year contract',
      target: 'Global 2000 & Regulated Entities',
      includes: [
        'Unlimited hybrid nodes (Mac Studio Ultra + On-prem K8s)',
        'Custom corporate model fine-tuning (LoRA adapter injection)',
        'SAML SSO, RBAC, encrypted audit trail compliance',
        'Dedicated Solutions Architect & 24/7 mission support',
        'Custom sandboxed tool integrations (SAP, Oracle, Epic EHR)'
      ]
    }
  ]
};
