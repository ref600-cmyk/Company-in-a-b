export interface PitchSlide {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  keyPoints: {
    heading: string;
    description: string;
  }[];
  statNumber?: string;
  statLabel?: string;
  speakerNotes: string;
}

export const PITCH_DECK_SLIDES: PitchSlide[] = [
  {
    id: 1,
    badge: 'The Macro Crisis',
    title: 'Centralized Cloud AI is Facing a Dead End',
    subtitle: 'Enterprises are terrified of cloud LLM data leaks, skyrocketing token bills, and strict regulatory penalties.',
    keyPoints: [
      {
        heading: 'The Air-Gap Mandate',
        description: 'EU AI Act, HIPAA, and GDPR enforce severe penalties for uploading proprietary IP, source code, and patient data to remote multi-tenant clouds.'
      },
      {
        heading: 'Runaway Token Bills',
        description: 'Companies experimenting with autonomous agent swarms are receiving $5,000–$25,000 monthly bills for continuous API calling.'
      },
      {
        heading: 'Zero Sovereignty',
        description: 'Cloud outages, silent prompt policy changes, and vendor lock-in leave critical enterprise operations vulnerable.'
      }
    ],
    statNumber: '84%',
    statLabel: 'of Enterprise CIOs cite data privacy as their #1 barrier to deploying autonomous agents',
    speakerNotes: 'Start by establishing the urgency: the enterprise world cannot trust public cloud AI with its core intellectual property and client data.'
  },
  {
    id: 2,
    badge: 'The Breakthrough',
    title: 'SkyShadow Local-Mesh OS: The Sovereign AI Appliance',
    subtitle: 'A turnkey, 100% air-gapped autonomous agent operating system that turns any Mac Mini into a private enterprise super-brain.',
    keyPoints: [
      {
        heading: 'Plug-and-Play Appliance',
        description: 'Ships pre-installed on Apple Silicon hardware. Connect to an office Ethernet port and immediately deploy an autonomous workforce.'
      },
      {
        heading: 'Zero Cloud Data Exfiltration',
        description: 'Every prompt, embedding, and database query stays 100% on physical local memory inside micro-VM sandboxes.'
      },
      {
        heading: 'Elastic Node-to-Cluster Mesh',
        description: 'Starts with 1 Mac Mini ($599–$1,799) for SMBs; seamlessly chains via Thunderbolt 5 or LAN into high-availability multi-node corporate swarms.'
      }
    ],
    statNumber: '100%',
    statLabel: 'Air-Gapped Sovereign Intelligence with Zero Telemetry',
    speakerNotes: 'Position SkyShadow as the plug-and-play appliance that delivers complete independence and enterprise-grade multi-agent collaboration.'
  },
  {
    id: 3,
    badge: 'The Unfair Hardware Asymmetry',
    title: 'Apple Silicon UMA: The Secret Weapon Over Cloud GPUs',
    subtitle: 'Autoregressive transformer inference is memory-bandwidth bound, not compute bound.',
    keyPoints: [
      {
        heading: '273 to 800 GB/s Unified Memory (UMA)',
        description: 'Apple Silicon shares high-speed memory directly between CPU, GPU, and Neural Engine without PCIe transfer bottlenecks.'
      },
      {
        heading: '70B Reasoning at 20 Watts',
        description: 'Runs quantized Llama-3.3-70B and Qwen-2.5-32B at whisper-quiet desk power consumption (~20W vs. 750W cloud server racks).'
      },
      {
        heading: '90%+ Operating Cost Reduction',
        description: 'A $1,399 Mac Mini M4 Pro runs 24/7 autonomous agents for ~$2.88/month in electricity—paying for itself in under 35 days.'
      }
    ],
    statNumber: '273 GB/s',
    statLabel: 'Memory Bandwidth on a $1,399 Mac Mini M4 Pro',
    speakerNotes: 'Show the mathematical breakthrough: why an off-the-shelf Mac Mini out-classes cloud servers in price-to-performance and energy efficiency.'
  },
  {
    id: 4,
    badge: 'The Platform',
    title: 'Autonomous Multi-Agent Swarm with Human-in-the-Loop',
    subtitle: 'Real enterprise work executed autonomously by collaborative specialist agents.',
    keyPoints: [
      {
        heading: 'Master Orchestration (Orion)',
        description: 'Decomposes complex company directives into atomic DAG workflows and dynamically schedules tasks across local hardware cores.'
      },
      {
        heading: 'Specialist Roster',
        description: 'Autonomous Software Engineers (Vulcan), Financial Auditors (Mercury), Knowledge Graph Indexers (Cypher), and Security Sentinels (Aegis).'
      },
      {
        heading: 'Non-Bypassable Security Checkpoints',
        description: 'Autonomous agents execute safely; high-consequence operations (Git production merges, invoice payments) pause for human authorization.'
      }
    ],
    statNumber: '16+',
    statLabel: 'Concurrent Autonomous Agents per Quad-Node Cluster',
    speakerNotes: 'Emphasize that this is not a toy chatbot—it is an autonomous multi-agent operating system designed for real work with strict corporate governance.'
  },
  {
    id: 5,
    badge: 'The Business Model',
    title: 'Dual Revenue Flywheel: Appliance Margin + Recurring SaaS ARR',
    subtitle: 'Monetizing both upfront hardware capital and high-retention annual software subscriptions.',
    keyPoints: [
      {
        heading: 'Turnkey Hardware Appliance ($1,899 – $4,999)',
        description: 'Sold with ~35% hardware gross margin, providing immediate upfront cash flow and customer lock-in.'
      },
      {
        heading: 'Software Node Subscription ($99 – $349/mo/node)',
        description: 'High-margin (92% gross margin) recurring ARR for mesh orchestration, model optimization updates, and security patches.'
      },
      {
        heading: 'Enterprise Sovereign Corporate Contracts ($25k–$100k+/yr)',
        description: 'Custom fine-tuning, SAML SSO, on-prem Kubernetes hybrid clustering, and 24/7 mission-critical SLAs.'
      }
    ],
    statNumber: '82%',
    statLabel: 'Blended Gross Margin at Scale with 7.6x LTV/CAC Ratio',
    speakerNotes: 'Walk investors through the unit economics: upfront hardware covers acquisition costs; recurring software drives exponential SaaS valuation.'
  },
  {
    id: 6,
    badge: 'The Market Size',
    title: '$140B Total Addressable Sovereign AI Market',
    subtitle: 'Capturing the transition from fragile cloud APIs to sovereign on-premises intelligence.',
    keyPoints: [
      {
        heading: 'TAM: $140B+',
        description: 'Global enterprise spending on internal AI software, local infrastructure, and compliance automation by 2030.'
      },
      {
        heading: 'SAM: $32B',
        description: 'Regulated mid-market and SMB enterprises in legal, financial services, healthcare, defense, and engineering.'
      },
      {
        heading: 'SOM: $1.8B',
        description: 'Initial 5-year capture across UK, EU, and US privacy-first SMB agencies and corporate branch networks.'
      }
    ],
    statNumber: '$140B',
    statLabel: 'Addressable Enterprise Market by 2030',
    speakerNotes: 'Highlight the colossal market transition: every company will need local edge AI as compliance and IP protections tighten.'
  },
  {
    id: 7,
    badge: 'The Unstoppable Moat',
    title: 'How We Make the Entire AI Ecosystem Depend on Us',
    subtitle: 'Building the fundamental operating system and network protocol for local autonomous agents.',
    keyPoints: [
      {
        heading: 'Sovereign AI Mesh Protocol (SAMP)',
        description: 'Open-core communication standard. 3rd-party developer agents and appliances must interface through our protocol.'
      },
      {
        heading: 'The SkyShadow Local Skill Store',
        description: 'The "Docker Hub / App Store" of verified, offline air-gapped skills with zero telemetry.'
      },
      {
        heading: 'Proprietary Apple Metal MLX Kernels',
        description: 'Custom low-level memory scheduling yielding 2.5x speedup and 40% RAM reduction over vanilla runtimes.'
      },
      {
        heading: 'Privacy-Preserving Federated Fleet Learning',
        description: 'Appliances share encrypted LoRA weight deltas without raw data transfer, making the entire network collectively smarter.'
      }
    ],
    statNumber: '9.8 / 10',
    statLabel: 'Defensibility & Switching Cost Barrier Score',
    speakerNotes: 'This is our defensibility slide: we are not just selling a box; we are establishing the de facto protocol and marketplace for sovereign AI.'
  },
  {
    id: 8,
    badge: 'Financial Milestones',
    title: 'Five-Year Trajectory: Road to $2.9B Valuation',
    subtitle: 'Disciplined capital efficiency with cash-flow break-even within 14 months.',
    keyPoints: [
      {
        heading: 'Year 1 (2026): Seed Traction',
        description: '250 appliances shipped, $804K software ARR, $1.28M total revenue, break-even foundation.'
      },
      {
        heading: 'Year 3 (2028): Series A Expansion',
        description: '4,500 appliances shipped, $18.2M ARR, $26.8M total revenue, 80% blended gross margin.'
      },
      {
        heading: 'Year 5 (2030): Enterprise Market Leader',
        description: '38,000 appliances, 98,000 active nodes, $175.2M ARR, $247.4M total revenue, $2.90B valuation.'
      }
    ],
    statNumber: '$175M+',
    statLabel: 'Year 5 Annual Recurring Software Revenue (ARR)',
    speakerNotes: 'Demonstrate our realistic, bottom-up growth trajectory: high hardware retention coupled with escalating recurring software ARR.'
  },
  {
    id: 9,
    badge: 'Go-To-Market Execution',
    title: '3-Phase Wedge: From Boutique Agency to Global Enterprise',
    subtitle: 'Bottom-up developer evangelism scaling into certified enterprise reseller networks.',
    keyPoints: [
      {
        heading: 'Direct SMB & Agency Wedge (Months 1–9)',
        description: 'Pre-imaged "SkyShadow Mini-Box" shipped directly with 30-day money-back guarantee for law and tech consultancies.'
      },
      {
        heading: 'Regulated Mid-Market Expansion (Months 10–24)',
        description: 'Thunderbolt office clusters; SOC2 Type II and HIPAA compliance certifications; regional MSP partnerships.'
      },
      {
        heading: 'Global Enterprise Channel (Months 25–48)',
        description: 'Apple Authorized Enterprise Reseller programs and OEM hardware integrator distribution.'
      }
    ],
    statNumber: '35 Days',
    statLabel: 'Average Customer Payback Timeline',
    speakerNotes: 'Explain why customer adoption is frictionless: the payback is immediate, and installation takes under 10 minutes.'
  },
  {
    id: 10,
    badge: 'The Investment Ask',
    title: 'The Opportunity: Accelerate the Sovereign AI Revolution',
    subtitle: 'Raising $2.5M Seed to scale hardware appliance inventory and finalize the Sovereign AI Protocol.',
    keyPoints: [
      {
        heading: 'Use of Funds',
        description: '50% Core Engineering (Metal kernel & Raft consensus), 30% GTM & Appliance Inventory, 20% Security Certification & Legal IP.'
      },
      {
        heading: '18-Month Target Milestones',
        description: 'Deploy 500+ appliances, reach $2.5M ARR, establish 10 MSP partnerships, achieve SOC2 Type II certification.'
      },
      {
        heading: 'Company & Contact',
        description: 'SkyShadow Ltd • skyshadow.co.uk • Contact: ref600@gmail.com'
      }
    ],
    statNumber: '$2.5M',
    statLabel: 'Seed Capital Round Allocation',
    speakerNotes: 'Conclude with a confident call to action: invite investors to partner in building the defining infrastructure company of sovereign enterprise AI.'
  }
];
