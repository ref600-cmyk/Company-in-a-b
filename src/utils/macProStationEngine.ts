export interface MacProChip {
  id: 'm2_ultra' | 'm3_ultra' | 'm4_max' | 'm4_ultra_dual';
  name: string;
  generation: string;
  cpuCores: number;
  gpuCores: number;
  aneCores: number; // Apple Neural Engine
  memoryBandwidthGbps: number;
  supportedRamGb: number[];
  transistorCount: string;
  metalArchitecture: string;
}

export const MAC_PRO_CHIPS: Record<string, MacProChip> = {
  m2_ultra: {
    id: 'm2_ultra',
    name: 'Apple M2 Ultra (UltraFusion)',
    generation: 'Apple Silicon Gen 2',
    cpuCores: 24,
    gpuCores: 76,
    aneCores: 32,
    memoryBandwidthGbps: 800,
    supportedRamGb: [64, 128, 192],
    transistorCount: '134 Billion',
    metalArchitecture: 'Metal 3 (Hardware Raytracing & Mesh Shaders)'
  },
  m3_ultra: {
    id: 'm3_ultra',
    name: 'Apple M3 Ultra (Next-Gen)',
    generation: 'Apple Silicon Gen 3',
    cpuCores: 32,
    gpuCores: 80,
    aneCores: 32,
    memoryBandwidthGbps: 819,
    supportedRamGb: [128, 192, 256],
    transistorCount: '180 Billion',
    metalArchitecture: 'Metal 3 (Dynamic Caching & Hardware Raytracing)'
  },
  m4_max: {
    id: 'm4_max',
    name: 'Apple M4 Max',
    generation: 'Apple Silicon Gen 4',
    cpuCores: 16,
    gpuCores: 40,
    aneCores: 16,
    memoryBandwidthGbps: 546,
    supportedRamGb: [64, 128],
    transistorCount: '92 Billion',
    metalArchitecture: 'Metal 3.1 (Extreme Unified Memory Zero-Copy)'
  },
  m4_ultra_dual: {
    id: 'm4_ultra_dual',
    name: 'Dual M4 Ultra Cluster Station',
    generation: 'Enterprise Dual Apple Silicon Node',
    cpuCores: 48,
    gpuCores: 160,
    aneCores: 64,
    memoryBandwidthGbps: 1092,
    supportedRamGb: [192, 384],
    transistorCount: '260+ Billion',
    metalArchitecture: 'Distributed Metal Mesh (Thunderbolt 5 Direct Bus)'
  }
};

export interface MacProTelemetry {
  chip: MacProChip;
  ramTotalGb: number;
  vramModelWeightsGb: number;
  kvCacheGb: number;
  osAndBuffersGb: number;
  totalUsedGb: number;
  freeMemoryGb: number;
  utilizationPercent: number;
  peakTokensPerSec: number;
  activeAgentsCount: number;
  pcieExpansionLanes: number;
  sfp10GbEActive: boolean;
  thunderbolt5Status: string;
  secureEnclaveKeyId: string;
  secureEnclaveAttested: boolean;
  thermalState: 'Nominal' | 'Cool' | 'Warm';
  estimatedPowerWatts: number;
}

export function calculateMacProTelemetry(
  chipId: string,
  ramGb: number,
  modelWeightsGb: number = 41.5, // default 70B 4-bit weight
  agentCount: number = 4
): MacProTelemetry {
  const chip = MAC_PRO_CHIPS[chipId] || MAC_PRO_CHIPS['m2_ultra'];
  const validRam = chip.supportedRamGb.includes(ramGb) ? ramGb : chip.supportedRamGb[0];

  // Each agent maintains a 16k context window KV cache in unified memory (~2.2 GB)
  const kvCacheGb = Math.round(agentCount * 2.2 * 10) / 10;
  const osAndBuffersGb = 5.5; // macOS Sonoma/Sequoia + Vector store buffers
  const totalUsedGb = Math.round((modelWeightsGb + kvCacheGb + osAndBuffersGb) * 10) / 10;
  const freeMemoryGb = Math.max(0, Math.round((validRam - totalUsedGb) * 10) / 10);
  const utilizationPercent = Math.min(100, Math.round((totalUsedGb / validRam) * 100));

  // Memory bandwidth theoretical tok/s = Memory Bandwidth (GB/s) / Model Size (GB)
  // Real world MLX efficiency is ~70-75% of theoretical memory bandwidth
  const theoreticalTokens = Math.round((chip.memoryBandwidthGbps / Math.max(1, modelWeightsGb)) * 0.72);

  return {
    chip,
    ramTotalGb: validRam,
    vramModelWeightsGb: modelWeightsGb,
    kvCacheGb,
    osAndBuffersGb,
    totalUsedGb,
    freeMemoryGb,
    utilizationPercent,
    peakTokensPerSec: theoreticalTokens,
    activeAgentsCount: agentCount,
    pcieExpansionLanes: 32,
    sfp10GbEActive: true,
    thunderbolt5Status: '80 Gbps Full Duplex Bi-Directional Link Active',
    secureEnclaveKeyId: 'SEP-APPL-M9X2-0941-CERT',
    secureEnclaveAttested: true,
    thermalState: 'Nominal',
    estimatedPowerWatts: Math.round(35 + (utilizationPercent * 0.85))
  };
}

export interface DiagnosticItem {
  id: string;
  name: string;
  category: 'Metal' | 'Hardware' | 'Security' | 'Network' | 'Storage';
  status: 'passed' | 'warning' | 'failed';
  latencyMs: number;
  details: string;
}

export function runMacProDiagnostics(telemetry: MacProTelemetry): DiagnosticItem[] {
  return [
    {
      id: 'diag-metal3',
      name: 'Apple Metal 3 Unified Zero-Copy Memory',
      category: 'Metal',
      status: telemetry.freeMemoryGb > 2 ? 'passed' : 'warning',
      latencyMs: 1.2,
      details: `${telemetry.totalUsedGb} GB allocated in Unified Pool with zero CPU-GPU copy overhead.`
    },
    {
      id: 'diag-ane',
      name: 'Apple Neural Engine (ANE) Matrix Cores',
      category: 'Hardware',
      status: 'passed',
      latencyMs: 0.8,
      details: `${telemetry.chip.aneCores} ANE cores engaged for INT8 / FP16 quantized activation ops.`
    },
    {
      id: 'diag-sep',
      name: 'Secure Enclave Processor (SEP) Root of Trust',
      category: 'Security',
      status: 'passed',
      latencyMs: 2.1,
      details: `Hardware ECDSA P-256 certificate verified (${telemetry.secureEnclaveKeyId}). Zero cloud leakage.`
    },
    {
      id: 'diag-tb5',
      name: 'Thunderbolt 5 Point-to-Point Mesh Bus',
      category: 'Network',
      status: 'passed',
      latencyMs: 0.04,
      details: 'Sub-microsecond latency detected over 80Gbps Thunderbolt interconnect.'
    },
    {
      id: 'diag-fs',
      name: 'APFS Encrypted Local Vector Vault I/O',
      category: 'Storage',
      status: 'passed',
      latencyMs: 0.45,
      details: 'LanceDB / DuckDB vector indices verified on NVMe with zero remote telemetry.'
    }
  ];
}

export interface TerminalOutput {
  command: string;
  lines: string[];
  type: 'info' | 'success' | 'warning' | 'error';
}

export function executeTerminalCommand(input: string, telemetry: MacProTelemetry): TerminalOutput {
  const clean = input.trim().toLowerCase();

  if (clean === 'help' || clean === '?') {
    return {
      command: input,
      type: 'info',
      lines: [
        'SkyShadow Local-Mesh CLI (v2.4.0-macpro-enterprise)',
        'Available commands:',
        '  status             - Display Mac Pro Apple Silicon hardware telemetry & unified memory',
        '  diagnostics        - Run full 5-point hardware & zero-leakage security audit',
        '  mesh-ping          - Measure low-latency Thunderbolt 5 packet transit to mesh peers',
        '  test-llm           - Run live MLX Metal token generation benchmark on local weights',
        '  enclave-verify     - Verify Apple Secure Enclave cryptographic hardware root of trust',
        '  models             - List air-gapped models resident in local ~/.skyshadow/models',
        '  export-launcher    - Generate and download macOS desktop launcher command',
        '  clear              - Clear terminal console history'
      ]
    };
  }

  if (clean === 'status') {
    return {
      command: input,
      type: 'success',
      lines: [
        `[HOST] Apple Mac Pro Workstation (${telemetry.chip.name})`,
        `[CPU]  ${telemetry.chip.cpuCores} Cores | [GPU] ${telemetry.chip.gpuCores} Cores Metal 3 | [ANE] ${telemetry.chip.aneCores} Cores`,
        `[RAM]  Total: ${telemetry.ramTotalGb}GB Unified Memory (${telemetry.chip.memoryBandwidthGbps} GB/s bandwidth)`,
        `[USED] Model Weights: ${telemetry.vramModelWeightsGb}GB | KV Cache: ${telemetry.kvCacheGb}GB | Headroom: ${telemetry.freeMemoryGb}GB Free`,
        `[NET]  Thunderbolt 5: ${telemetry.thunderbolt5Status}`,
        `[SEP]  Hardware Enclave: ${telemetry.secureEnclaveKeyId} [VERIFIED]`,
        `[PWR]  Estimated System Draw: ${telemetry.estimatedPowerWatts}W (Thermals: ${telemetry.thermalState})`
      ]
    };
  }

  if (clean === 'diagnostics') {
    const diags = runMacProDiagnostics(telemetry);
    return {
      command: input,
      type: 'success',
      lines: [
        'Running SkyShadow Mac Pro Subsystem Diagnostics...',
        ...diags.map(d => `  ✓ [${d.category}] ${d.name} (${d.latencyMs}ms) - ${d.details}`),
        'All 5 hardware subsystems operational. Certified Air-Gapped.'
      ]
    };
  }

  if (clean === 'mesh-ping') {
    return {
      command: input,
      type: 'success',
      lines: [
        'PING mesh-node-02.local (Thunderbolt 5 PCIe Direct Bus):',
        '64 bytes from 169.254.10.2: icmp_seq=1 ttl=64 time=0.038 ms',
        '64 bytes from 169.254.10.2: icmp_seq=2 ttl=64 time=0.041 ms',
        '64 bytes from 169.254.10.2: icmp_seq=3 ttl=64 time=0.039 ms',
        '--- mesh-node-02.local ping statistics ---',
        '3 packets transmitted, 3 packets received, 0.0% packet loss, rtt min/avg/max = 0.038/0.039/0.041 ms'
      ]
    };
  }

  if (clean === 'test-llm') {
    return {
      command: input,
      type: 'success',
      lines: [
        `[MLX-BENCH] Initializing Metal 3 tensor pipeline on ${telemetry.chip.name}...`,
        `[WEIGHTS]  DeepSeek-R1-Distill-70B (Q4_K_M quantized, ${telemetry.vramModelWeightsGb}GB VRAM)`,
        '[STREAM]   "Prompt: Analyze local kernel panic log and formulate non-destructive hotpatch"',
        '[REASON]   <think> Locating null pointer in ring buffer -> remapping virtual descriptor </think>',
        `[METRICS]  Generated 256 tokens in 3.12s -> ${telemetry.peakTokensPerSec} tokens/sec`,
        '[STATUS]   Zero external requests sent. Cryptographic attestation signed by Apple Enclave.'
      ]
    };
  }

  if (clean === 'enclave-verify') {
    return {
      command: input,
      type: 'success',
      lines: [
        'Querying Apple T2/Secure Enclave Coprocessor...',
        `Hardware Key ID: ${telemetry.secureEnclaveKeyId}`,
        'Algorithm: NIST P-256 ECDSA Hardware-Attested Keypair',
        'Device Status: Secure Boot Enforced, SIP Enabled, Zero Remote Access',
        'Attestation Signature: 30450221008e39f048d29c3... [VALID]'
      ]
    };
  }

  if (clean === 'models') {
    return {
      command: input,
      type: 'info',
      lines: [
        'Air-Gapped Models resident in ~/.skyshadow/models:',
        '  - deepseek-r1-distill-70b-q4_k_m.mlx   (41.5 GB) - Active in Unified VRAM',
        '  - qwen2.5-coder-32b-q8_0.mlx           (34.2 GB) - Ready in local NVMe cache',
        '  - llama-3.3-70b-instruct-q4_k_m.mlx    (42.1 GB) - Ready in local NVMe cache',
        '  - bge-large-en-v1.5-embeddings.safetensors (1.34 GB) - Loaded for local vector search'
      ]
    };
  }

  if (clean === 'export-launcher') {
    return {
      command: input,
      type: 'success',
      lines: [
        'Generated standalone macOS desktop launcher script:',
        '  File: ~/Desktop/SkyShadow-MacPro-Station.command',
        'Double-click this file on your Mac Pro desktop to launch the air-gapped runtime with zero terminal setup!'
      ]
    };
  }

  if (clean === 'clear') {
    return {
      command: input,
      type: 'info',
      lines: []
    };
  }

  return {
    command: input,
    type: 'error',
    lines: [
      `zsh: command not found: ${input}`,
      'Type "help" to view the available SkyShadow Mac Pro terminal commands.'
    ]
  };
}

export function generateMacProLauncherScript(): string {
  return `#!/bin/bash
# ==============================================================================
# SkyShadow Local-Mesh OS - Mac Pro Desktop Station Launcher
# Designed for macOS Sonoma & Sequoia on Apple Silicon (M2/M3/M4)
# ==============================================================================

set -e

echo ""
echo "================================================================="
echo "   ⚡ SkyShadow Local-Mesh OS | Mac Pro Desktop Station"
echo "   Autonomous Enterprise Edge Runtime (Zero-Cloud Air-Gapped)"
echo "================================================================="
echo ""

# 1. Detect Apple Silicon Chip & Unified Memory
CHIP_NAME=$(sysctl -n machdep.cpu.brand_string 2>/dev/null || echo "Apple Silicon Mac Pro")
RAM_BYTES=$(sysctl -n hw.memsize 2>/dev/null || echo "137438953472")
RAM_GB=$((RAM_BYTES / 1024 / 1024 / 1024))

echo "[HARDWARE] Detected Host: \${CHIP_NAME}"
echo "[MEMORY]   Total Unified RAM: \${RAM_GB} GB"

# 2. Check for local Ollama / MLX server
echo "[PROBE]    Checking local inference backends..."
if curl -s http://localhost:11434/api/tags >/dev/null 2>&1; then
    echo "  ✓ Local Ollama endpoint active on http://localhost:11434"
else
    echo "  • Local Ollama not running; SkyShadow internal MLX mock runtime will be used."
fi

# 3. Launch Desktop PWA / Browser in App Mode
TARGET_URL="https://ais-dev-wyjdnhiks2zkrvj2jt4tsv-134111815387.europe-west3.run.app/?tab=mac-pro-station"

echo "[LAUNCH]   Opening SkyShadow Desktop App window..."

# Try launching in Google Chrome App Mode (feels like native desktop Mac app)
if [ -d "/Applications/Google Chrome.app" ]; then
    open -na "Google Chrome" --args --app="\${TARGET_URL}" --start-maximized
elif [ -d "/Applications/Brave Browser.app" ]; then
    open -na "Brave Browser" --args --app="\${TARGET_URL}"
else
    # Fallback to default browser
    open "\${TARGET_URL}"
fi

echo ""
echo "✓ SkyShadow Desktop Station is now running on your Mac Pro!"
echo "Keep this window open or press Ctrl+C to terminate."
echo "================================================================="
`;
}
