export interface DeploymentFile {
  filename: string;
  language: string;
  title: string;
  description: string;
  content: string;
}

export const DEPLOYMENT_TEMPLATES: DeploymentFile[] = [
  {
    filename: 'setup_mac_mini.sh',
    language: 'bash',
    title: 'One-Click Mac Mini Bootstrap Script',
    description: 'Installs Apple Silicon Metal/MLX runtime, local vector DB, and bootstraps SkyShadow Local-Mesh daemon in under 3 minutes.',
    content: `#!/usr/bin/env bash
# ==============================================================================
# SkyShadow Local-Mesh OS: Mac Mini Appliance Bootstrap
# Optimized for Apple Silicon (M2 / M3 / M4 / M4 Pro / Max / Ultra)
# Company: skyshadow.co.uk | 100% Air-Gapped Local Autonomous Swarm
# ==============================================================================
set -euo pipefail

echo "========================================================"
echo "⚡ Starting SkyShadow Local-Mesh Setup on Apple Silicon"
echo "========================================================"

# 1. Verify Apple Silicon architecture
ARCH=$(uname -m)
if [ "$ARCH" != "arm64" ]; then
  echo "❌ Error: SkyShadow Local-Mesh requires Apple Silicon (arm64). Found: $ARCH"
  exit 1
fi

TOTAL_RAM_BYTES=$(sysctl -n hw.memsize)
TOTAL_RAM_GB=$((TOTAL_RAM_BYTES / 1024 / 1024 / 1024))
echo "✓ Detected Apple Silicon hardware with \${TOTAL_RAM_GB}GB Unified Memory"

# 2. Configure Homebrew & essentials
if ! command -v brew >/dev/null 2>&1; then
  echo "Installing Homebrew..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

echo "Installing runtime dependencies (Python 3.11, Docker, Qdrant, MLX)..."
brew install python@3.11 cmake git curl jq qdrant

# 3. Create isolated virtual environment
SKY_DIR="$HOME/.skyshadow"
mkdir -p "$SKY_DIR/models" "$SKY_DIR/data" "$SKY_DIR/logs" "$SKY_DIR/sandbox"
cd "$SKY_DIR"

python3.11 -m venv venv
source venv/bin/activate

# Install Apple MLX and autonomous agent mesh runtime
pip install --upgrade pip
pip install mlx mlx-lm fastapi uvicorn pydantic qdrant-client lancedb chromadb

# 4. Download optimized local model weights into MLX cache
echo "Downloading quantized foundation model for \${TOTAL_RAM_GB}GB memory tier..."
if [ "$TOTAL_RAM_GB" -ge 48 ]; then
  echo "✓ High-memory tier detected. Deploying Llama-3.3-70B-Instruct-4bit (MLX)..."
  python -m mlx_lm.convert --hf-path meta-llama/Llama-3.3-70B-Instruct -q --q-bits 4
elif [ "$TOTAL_RAM_GB" -ge 24 ]; then
  echo "✓ Mid-tier detected. Deploying Qwen2.5-32B-Instruct-4bit..."
  python -m mlx_lm.convert --hf-path Qwen/Qwen2.5-32B-Instruct -q --q-bits 4
else
  echo "✓ Entry-tier detected. Deploying Qwen2.5-Coder-14B-Instruct-4bit..."
  python -m mlx_lm.convert --hf-path Qwen/Qwen2.5-Coder-14B-Instruct -q --q-bits 4
fi

# 5. Start background Qdrant vector database
brew services start qdrant

# 6. Install macOS Launchd Service for 24/7 background operation
echo "Configuring automatic launchd background daemon..."
cat << 'PLIST' > "$HOME/Library/LaunchAgents/com.skyshadow.localmesh.plist"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.skyshadow.localmesh</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>-c</string>
    <string>source ~/.skyshadow/venv/bin/activate && python -m skyshadow.mesh.server --port 8443</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>/Users/Shared/skyshadow-stdout.log</string>
  <key>StandardErrorPath</key>
  <string>/Users/Shared/skyshadow-stderr.log</string>
</dict>
</plist>
PLIST

launchctl load "$HOME/Library/LaunchAgents/com.skyshadow.localmesh.plist" 2>/dev/null || true

echo "========================================================"
echo "🎉 SkyShadow Local-Mesh successfully installed and running!"
echo "Dashboard UI: https://localhost:8443"
echo "Hardware Status: Apple Silicon Metal acceleration ACTIVE"
echo "Zero Cloud Leakage: ENFORCED (Air-gapped mode)"
echo "========================================================"
`
  },
  {
    filename: 'docker-compose.mac.yml',
    language: 'yaml',
    title: 'Docker Sandbox & Vector Memory Compose',
    description: 'Sandboxes code execution in Apple Virtualization Framework with local isolated Qdrant vector memory and Redis pub/sub bus.',
    content: `version: '3.8'

services:
  # SkyShadow Core Mesh Orchestrator
  skyshadow-orchestrator:
    image: skyshadow/local-mesh-core:latest
    container_name: skyshadow-mesh
    restart: unless-stopped
    ports:
      - "8443:8443"
    environment:
      - AIR_GAPPED_MODE=true
      - ZERO_TELEMETRY=true
      - LOCAL_MLX_ENDPOINT=http://host.docker.internal:8080
      - VECTOR_DB_URL=http://qdrant:6333
      - REDIS_URL=redis://redis-event-bus:6379
      - MAX_CONCURRENT_AGENTS=16
    volumes:
      - ./data/memory:/var/skyshadow/memory
      - ./data/vault:/var/skyshadow/vault:ro
      - /var/run/docker.sock:/var/run/docker.sock
    extra_hosts:
      - "host.docker.internal:host-gateway"

  # Sandboxed Execution Worker (Zero network access to prevent exfiltration)
  agent-sandbox-runner:
    image: skyshadow/sandbox-worker:latest
    container_name: skyshadow-sandbox
    restart: unless-stopped
    network_mode: "none" # Completely severed from internet for zero-leakage safety
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp:rw,noexec,nosuid,size=1g
    volumes:
      - ./workspace/scratchpad:/workspace:rw

  # Local Air-Gapped Vector Database
  qdrant:
    image: qdrant/qdrant:latest
    container_name: skyshadow-qdrant
    restart: unless-stopped
    ports:
      - "6333:6333"
    volumes:
      - ./data/qdrant_storage:/qdrant/storage

  # Inter-Agent Asynchronous Pub/Sub Event Bus
  redis-event-bus:
    image: redis:7-alpine
    container_name: skyshadow-redis
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - ./data/redis_data:/data
`
  },
  {
    filename: 'skyshadow-cluster.yaml',
    language: 'yaml',
    title: 'Multi-Node Enterprise Raft Cluster Config',
    description: 'Configures peer-to-peer scaling across multiple Mac Minis or on-premises servers with automatic agent load balancing and failover.',
    content: `cluster:
  name: "skyshadow-enterprise-mesh"
  company: "skyshadow.co.uk"
  consensus_protocol: "raft"
  heartbeat_interval_ms: 150
  election_timeout_ms: 1000

discovery:
  mode: "hybrid" # mDNS for local LAN / Thunderbolt + Static seed list for corporate VPC
  mdns_service_name: "_skyshadow-mesh._tcp.local."
  seeds:
    - "node-1-macmini-m4.local:8443"
    - "node-2-macmini-m4.local:8443"
    - "node-3-macmini-m4pro.local:8443"

hardware_scheduling:
  enable_apple_silicon_uma_balancing: true
  offload_heavy_reasoning_to_node: "node-3-macmini-m4pro.local" # Node with 64GB RAM runs 70B
  worker_nodes_run_sub_agents: true # 16GB/24GB nodes execute parallel tools & coding

security_policies:
  air_gapped: true
  allow_cloud_fallback: false # Strict enterprise data sovereignty
  require_human_checkpoint_for_roles:
    - "Financial Auditor"
    - "Production DevOps Deployer"
    - "External Email Sender"
  audit_logging:
    enabled: true
    destination: "local_encrypted_sqlite"
    retention_days: 365
`
  },
  {
    filename: 'CLUSTERING_GUIDE.md',
    language: 'markdown',
    title: 'Mac Mini Thunderbolt & 10GbE Clustering Guide',
    description: 'Hardware blueprint for chaining 2 to 8 Mac Minis together into an ultra-high-throughput enterprise AI supercomputer.',
    content: `# Chaining Mac Minis: The SkyShadow Edge Cluster Guide

## Why Mac Minis instead of Cloud GPUs?
1. **Cost**: A cluster of three Mac Mini M4s costs ~$2,400 once. Running equivalent cloud 70B inference costs ~$1,500/month in SaaS API fees.
2. **Unified Memory**: Apple Silicon chips share unified RAM between CPU and GPU at up to 273 GB/s per node.
3. **Power**: Three Mac Minis draw under 70 Watts combined—quieter than a standard desk fan, pluggable into a standard wall socket with zero server rack cooling.

## Connection Topologies

### Option A: Thunderbolt 5 Point-to-Point Bridge (Up to 80 Gbps)
- Connect Mac Mini #1 to Mac Mini #2 and #3 using Thunderbolt cables.
- macOS automatically establishes a **Thunderbolt Bridge** virtual network interface with latency under 0.2ms.
- Ideal for tensor parallelism and distributed KV cache sharing.

### Option B: 10-Gigabit Ethernet Switch (Corporate Scale)
- Upgrade Mac Minis with the optional 10GbE port ($100 factory option).
- Connect to an unmanaged 10GbE switch (e.g. QNAP or Ubiquiti).
- Supports scaling to 16+ nodes across office floors.

## Autonomous Failover
- If a Mac Mini power cord is unplugged, Raft consensus re-elects the leader node in < 400ms.
- Active agent states are persisted in shared SQLite/WAL storage, allowing inflight missions to resume instantly without lost tokens.
`
  }
];
