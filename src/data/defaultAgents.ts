import { AgentRole, SwarmMission } from '../types/index.ts';

export const DEFAULT_AGENTS: AgentRole[] = [
  {
    id: 'agent-orion',
    name: 'Orion (Master Orchestrator)',
    role: 'Swarm Coordinator',
    department: 'Executive',
    avatar: 'cpu',
    model: 'Llama-3.3-70B (MLX 4-bit)',
    memoryQuotaMB: 8192,
    permissionLevel: 'Autonomous',
    systemPrompt: 'You are the primary coordinator for SkyShadow Local-Mesh. You ingest high-level company goals, decompose them into atomic DAG tasks, delegate to specialist agents, and monitor execution bottlenecks.',
    tools: ['task_dispatch', 'agent_supervision', 'memory_query', 'system_event_bus'],
    status: 'idle'
  },
  {
    id: 'agent-vulcan',
    name: 'Vulcan (Code & DevOps Architect)',
    role: 'Autonomous Software Engineer',
    department: 'Engineering',
    avatar: 'terminal',
    model: 'Qwen-2.5-Coder-32B (MLX)',
    memoryQuotaMB: 6144,
    permissionLevel: 'Autonomous',
    systemPrompt: 'Autonomous coding agent specialized in full-stack architecture, Git operations, unit testing, Docker environments, and automated CI/CD pipeline deployments.',
    tools: ['git_clone_branch', 'file_patcher', 'bash_sandbox', 'test_runner', 'linter'],
    status: 'idle'
  },
  {
    id: 'agent-aegis',
    name: 'Aegis (Security & Compliance Auditor)',
    role: 'Chief Security Sentinel',
    department: 'Security',
    avatar: 'shield',
    model: 'DeepSeek-R1-Distill-32B (MLX)',
    memoryQuotaMB: 4096,
    permissionLevel: 'Critical Checkpoint',
    systemPrompt: 'Inspects all code modifications, database queries, and external network requests. Enforces GDPR, ISO 27001, and zero-trust policies. Enforces human-in-the-loop approvals for sensitive operations.',
    tools: ['ast_security_scan', 'secret_detector', 'network_firewall_rule', 'audit_logger'],
    status: 'idle'
  },
  {
    id: 'agent-mercury',
    name: 'Mercury (FinOps & Ledger Reconciliation)',
    role: 'Autonomous Financial Analyst',
    department: 'Finance',
    avatar: 'dollar-sign',
    model: 'Mistral-NeMo-12B (MLX 8-bit)',
    memoryQuotaMB: 3072,
    permissionLevel: 'Critical Checkpoint',
    systemPrompt: 'Autonomous bookkeeping and financial anomaly detector. Verifies invoices against ERP records, calculates margins, flags suspicious transactions, and prepares monthly reconciliation statements.',
    tools: ['sqlite_erp_query', 'invoice_ocr_parser', 'iban_validator', 'reconciliation_reporter'],
    status: 'idle'
  },
  {
    id: 'agent-cypher',
    name: 'Cypher (Data & Vector Memory Graph)',
    role: 'Knowledge Graph Synthesizer',
    department: 'Research',
    avatar: 'database',
    model: 'DeepSeek-R1-Distill-14B (MLX)',
    memoryQuotaMB: 4096,
    permissionLevel: 'Autonomous',
    systemPrompt: 'Maintains company long-term memory in local Qdrant/LanceDB vector databases. Indexes internal documentation, emails, PDFs, and meeting transcripts with zero cloud transmission.',
    tools: ['lancedb_upsert', 'vector_similarity_search', 'pdf_extractor', 'entity_graph_indexer'],
    status: 'idle'
  },
  {
    id: 'agent-iris',
    name: 'Iris (Customer Ops & Incident Responder)',
    role: 'Support & Triage Lead',
    department: 'Operations',
    avatar: 'headphones',
    model: 'Llama-3.1-8B (MLX)',
    memoryQuotaMB: 2048,
    permissionLevel: 'Supervised',
    systemPrompt: 'Monitors inbound enterprise customer tickets, reproduces bugs in sandbox environments, updates ticket statuses, and provides drafted technical resolutions.',
    tools: ['webhook_receiver', 'ticket_updater', 'slack_notify', 'sandbox_reproducer'],
    status: 'idle'
  }
];

export const PREBUILT_MISSIONS: SwarmMission[] = [
  {
    id: 'mission-sec-audit',
    title: 'Autonomous Codebase Security & Air-Gap Audit',
    description: 'Scans local repository for CVE vulnerabilities, writes an isolated unit test, verifies fix inside macOS sandbox, and requests human confirmation before Git commit.',
    category: 'Engineering & Security',
    participatingAgents: ['agent-orion', 'agent-aegis', 'agent-vulcan'],
    steps: [
      {
        agentId: 'agent-orion',
        action: 'Ingest security scan directive and map local Git working tree',
        toolUsed: 'task_dispatch',
        outputSample: 'Mapped 142 files in /workspace/skyshadow-core. Dispatched Aegis for static AST inspection.',
        durationMs: 700
      },
      {
        agentId: 'agent-aegis',
        action: 'Run static taint analysis & dependency vulnerability verification',
        toolUsed: 'ast_security_scan',
        outputSample: 'Detected CVE-2024-4321 in upstream websocket dependency. High severity: unauthenticated buffer overflow risk.',
        durationMs: 900
      },
      {
        agentId: 'agent-vulcan',
        action: 'Synthesize dependency bump patch & write regression test in sandbox',
        toolUsed: 'bash_sandbox',
        outputSample: 'Created patch branch fix/cve-2024-4321. Upgraded package to v2.4.1. Executed test suite: 48/48 passed in 1.4s.',
        durationMs: 1100
      },
      {
        agentId: 'agent-aegis',
        action: 'Require supervisor sign-off before committing to production Git branch',
        toolUsed: 'network_firewall_rule',
        outputSample: 'Security checkpoint: Ready to merge fix/cve-2024-4321 into main branch. SHA256 checksum: 9c8b7f12e8.',
        durationMs: 800,
        requiresApproval: true
      },
      {
        agentId: 'agent-vulcan',
        action: 'Merge verified patch, push signed commit, and record audit trail in LanceDB',
        toolUsed: 'git_clone_branch',
        outputSample: 'Git commit 4c89a01 pushed. Security log indexed into local air-gapped vector store. Incident resolved.',
        durationMs: 650
      }
    ]
  },
  {
    id: 'mission-fin-recon',
    title: 'Autonomous Financial Audit & Invoice Reconciliation',
    description: 'Processes vendor PDF invoices from local storage, matches against bank statement feeds in SQLite, and flags any unapproved amount discrepancies.',
    category: 'FinOps & Compliance',
    participatingAgents: ['agent-orion', 'agent-mercury', 'agent-cypher'],
    steps: [
      {
        agentId: 'agent-orion',
        action: 'Trigger end-of-month reconciliation pipeline across pending invoices',
        toolUsed: 'task_dispatch',
        outputSample: 'Identified 38 pending invoice PDFs in local /vault/finance/2026-Q3 directory.',
        durationMs: 600
      },
      {
        agentId: 'agent-cypher',
        action: 'Extract structured line-items via local multi-modal OCR engine',
        toolUsed: 'pdf_extractor',
        outputSample: 'Extracted 38 invoices totaling £184,290.00. Parsed vendor VAT IDs and bank IBAN coordinates.',
        durationMs: 850
      },
      {
        agentId: 'agent-mercury',
        action: 'Execute cross-ledger reconciliation against local SQLite bank journal',
        toolUsed: 'sqlite_erp_query',
        outputSample: 'Matched 37 invoices (100% match). Discrepancy detected on Invoice #SKY-8812: billed £4,500 vs PO contract £3,900.',
        durationMs: 950
      },
      {
        agentId: 'agent-mercury',
        action: 'Hold payment and request human CFO approval on pricing variance',
        toolUsed: 'iban_validator',
        outputSample: 'Discrepancy flag: £600 variance over approved purchase order. Payout paused pending CFO override.',
        durationMs: 700,
        requiresApproval: true
      },
      {
        agentId: 'agent-mercury',
        action: 'Finalize approved ledger, output audit summary PDF, and update records',
        toolUsed: 'reconciliation_reporter',
        outputSample: 'Reconciliation complete. 37 payments scheduled via local OpenBanking API. Audit report stored in encrypted vault.',
        durationMs: 750
      }
    ]
  },
  {
    id: 'mission-customer-ops',
    title: 'Autonomous Enterprise Ticket Triage & Database Investigation',
    description: 'Catches critical customer escalation, queries local telemetry logs, reproduces error in sandbox, and drafts high-priority response.',
    category: 'Operations',
    participatingAgents: ['agent-orion', 'agent-iris', 'agent-vulcan'],
    steps: [
      {
        agentId: 'agent-iris',
        action: 'Receive webhook from customer portal regarding API latency spike',
        toolUsed: 'webhook_receiver',
        outputSample: 'Customer "Acme Corp" reported P99 latency > 2.5s on GraphQL search endpoint.',
        durationMs: 500
      },
      {
        agentId: 'agent-vulcan',
        action: 'Analyze local database query execution plan in isolated sandbox',
        toolUsed: 'bash_sandbox',
        outputSample: 'Identified missing B-Tree composite index on "tenant_id, created_at". Query was doing full table scan on 4.2M rows.',
        durationMs: 900
      },
      {
        agentId: 'agent-vulcan',
        action: 'Apply concurrent index migration to local staging instance and verify speedup',
        toolUsed: 'file_patcher',
        outputSample: 'Index "idx_tenant_created" created. P99 query latency dropped from 2,450ms down to 14ms (175x speedup).',
        durationMs: 800
      },
      {
        agentId: 'agent-iris',
        action: 'Notify team and send verified diagnostic resolution to customer',
        toolUsed: 'slack_notify',
        outputSample: 'Resolution draft dispatched. Migration scheduled for 02:00 UTC maintenance window. SLA compliance maintained at 99.98%.',
        durationMs: 600
      }
    ]
  }
];
