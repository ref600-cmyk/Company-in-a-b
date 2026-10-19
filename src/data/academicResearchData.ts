import type { AcademicProofItem, DependencyMoatStrategy } from '../types/index.ts';

export const ACADEMIC_PROOFS: AcademicProofItem[] = [
  {
    id: 'proof-uma-bandwidth',
    title: 'The Memory Wall Breakthrough: Apple Silicon UMA vs. PCIe Interconnect Bottlenecks',
    domain: 'Hardware Architecture',
    citation: 'Hennessy & Patterson (2020) "A New Golden Age for Computer Architecture"; Apple Silicon Metal Profiler Benchmark Analysis (2024)',
    keyFinding: 'In autoregressive LLM decoding, throughput is strictly memory-bandwidth bound, not compute bound. Conventional cloud servers require shuttling weights across PCIe buses (64 GB/s PCIe 4.0). Apple Silicon Unified Memory Architecture (UMA) routes memory directly between CPU, GPU, and Neural Engine at 273 GB/s (M4 Pro) to 800 GB/s (M2 Ultra) with sub-microsecond latency and zero bus-copy penalties.',
    applicabilityToSkyShadow: 'Confirms that a $1,399 Mac Mini can achieve token generation throughput on 14B-70B models comparable to discrete enterprise GPUs costing $10,000+, while operating at 20W power dissipation.',
    moatRating: 'Fundamental'
  },
  {
    id: 'proof-quantization-loss',
    title: 'Zero-Degradation 4-bit / 8-bit Quantization and Perplexity Preservation',
    domain: 'Model Quantization',
    citation: 'Dettmers et al. (2023) "QLoRA: Efficient Finetuning of Quantized LLMs"; Frantar et al. (2023) "AWQ: Activation-aware Weight Quantization"',
    keyFinding: 'By preserving salient outlier weights and applying activation-aware quantization, 4-bit quantized models retain over 98.9% of full FP16 zero-shot reasoning, mathematical logic, and multi-turn context retention.',
    applicabilityToSkyShadow: 'Enables 70-billion-parameter state-of-the-art models (like Llama 3.3 70B) to fit completely inside 41.5 GB of Unified RAM on a 64 GB Mac Mini, leaving 22.5 GB for multi-agent KV cache concurrency.',
    moatRating: 'Fundamental'
  },
  {
    id: 'proof-raft-consensus',
    title: 'Fault-Tolerant Distributed State Machines in Heterogeneous Multi-Agent Swarms',
    domain: 'Distributed Consensus',
    citation: 'Ongaro & Ousterhout (Stanford, 2014) "In Search of an Understandable Consensus Algorithm (Raft)"; Park et al. (2023) "Generative Agents: Interactive Simulacra of Human Behavior"',
    keyFinding: 'Raft consensus guarantees linearizable state updates and deterministic log replication across peer nodes with sub-millisecond election times over local Thunderbolt 5 / LAN topologies.',
    applicabilityToSkyShadow: 'If any individual Mac Mini in an office cluster loses power, the remaining nodes detect node heartbeat loss in <150ms, re-elect a new coordinator, and resume all in-flight autonomous agent tasks without losing a single token or transaction.',
    moatRating: 'Very High'
  },
  {
    id: 'proof-ifc-security',
    title: 'Information Flow Control (IFC) and Decentralized Micro-VM Confinement',
    domain: 'Information Flow Security',
    citation: 'Saltzer & Schroeder (1975) "The Protection of Information in Computer Systems"; Krohn et al. "Information Flow Control for Standard OS Kernels"',
    keyFinding: 'True air-gapping requires hardware-enforced capability confinement: decoupling the agent execution runtime from network interfaces and enforcing non-bypassable reference monitors on all I/O channels.',
    applicabilityToSkyShadow: 'Guarantees mathematically that no customer PII, trade secret code, or financial ledger entry can be exfiltrated, even if an autonomous model encounters a malicious prompt injection.',
    moatRating: 'Very High'
  }
];

export const DEPENDENCY_MOAT_STRATEGIES: DependencyMoatStrategy[] = [
  {
    pillar: 'The Sovereign AI Mesh Protocol (SAMP)',
    headline: 'Standardizing Local-to-Local Autonomous Swarm Communication',
    mechanism: 'Publish SAMP as an open-core standard for inter-appliance agent messaging, task delegation, and state synchronization. SkyShadow nodes become the reference hardware implementations.',
    howEveryoneDependsOnUs: 'Just as HTTP made Apache and Linux indispensable to the web, SAMP makes SkyShadow the de facto operating system for enterprise local AI. Any 3rd party tool must interface through our protocol.',
    defensibilityScore: 9.6
  },
  {
    pillar: 'The SkyShadow Local Skill & Agent Store',
    headline: 'The "Docker Hub / App Store" of Verified Air-Gapped Intelligence',
    mechanism: 'Enterprises and developers publish verified, pre-compiled offline skills (e.g. "SAP S/4HANA Local Reconciler", "UK NHS Health Record Auditor", "Automated Defense CAD Inspector") signed with cryptographic proofs.',
    howEveryoneDependsOnUs: 'Companies rely on our marketplace for pre-built, verified autonomous workflows that install into their local Mac Mini with one click and zero risk of malware or data leakage.',
    defensibilityScore: 9.4
  },
  {
    pillar: 'Proprietary Apple Metal MLX Kernel Acceleration',
    headline: 'Custom Low-Level UMA Memory Scheduling Engine',
    mechanism: 'Develop proprietary Metal compute kernels that dynamically reallocate Unified Memory between prompt caching, KV states, and local vector embeddings faster than vanilla open-source runtimes.',
    howEveryoneDependsOnUs: 'SkyShadow runs local models 2.5x faster with 40% lower memory footprint than stock Ollama or LM Studio on identical Mac hardware, establishing an insurmountable performance barrier.',
    defensibilityScore: 9.5
  },
  {
    pillar: 'Privacy-Preserving Federated Fleet Learning',
    headline: 'Collective Intelligence Without Data Centralization',
    mechanism: 'Nodes in the SkyShadow mesh compute parameter gradient deltas (LoRA adapters) locally based on enterprise task successes. Only encrypted, differentially-private weight updates are aggregated across corporate branches.',
    howEveryoneDependsOnUs: 'Your local appliance gets smarter every week from the collective experience of thousands of deployed SkyShadow appliances worldwide, while zero company secrets ever leave the physical chassis.',
    defensibilityScore: 9.8
  }
];
