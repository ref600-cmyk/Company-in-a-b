# SkyShadow Local-Mesh: Autonomous Enterprise Agentic OS

[![Build & Test](https://github.com/skyshadow-os/skyshadow-local-mesh/actions/workflows/ci.yml/badge.svg)](https://github.com/skyshadow-os/skyshadow-local-mesh/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Air-Gap Compliance](https://img.shields.io/badge/Air--Gap-100%25%20Zero%20Data%20Exfiltration-emerald.svg)]()
[![Hardware Acceleration](https://img.shields.io/badge/Apple%20Silicon-Metal%203%20UMA-cyan.svg)]()

> **Turnkey, local-first autonomous agentic operating system designed to run on edge hardware (Apple Silicon Mac Mini to enterprise clusters) with zero cloud data exfiltration, dynamic multi-agent swarm orchestration, and hardware unified memory sizing.**

---

## ⚡ Key Highlights

- **100% Air-Gapped Data Sovereignty**: Operates without external cloud API dependencies. Complies natively with EU GDPR, HIPAA, UK DPA, and defense-grade IP security protocols.
- **Apple Silicon UMA Acceleration**: Built to harness Apple Silicon's unified memory architecture (up to 800 GB/s on UltraFusion) for running 14B to 70B parameter foundation models at <$3/month electricity cost.
- **Autonomous Swarm Coordination**: DAG orchestrator (Orion, Aegis, Vulcan, Iris, Cypher) with human-in-the-loop security approval checkpoints before production code modifications or financial ledger transactions.
- **Thunderbolt 5 P2P Cluster Mesh**: Automatic mDNS discovery and sub-microsecond point-to-point packet routing across clustered nodes with zero-downtime failover.
- **Deterministic Test Coverage**: 44 native unit tests covering math, routing, financial projections, and security rules with zero external mock libraries.

---

## 🚀 Quickstart

### Prerequisites
- Node.js 22+ (Native TypeScript & test runner support)
- macOS Sequoia (Apple Silicon recommended: M2/M3/M4/Pro/Max/Ultra) or Linux

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/skyshadow-local-mesh.git
cd skyshadow-local-mesh

# Install dependencies
npm install

# Start local server with Vite middlewares
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🧪 Testing

SkyShadow enforces a logic-first test architecture using Node's native test runner (`node:test`):

```bash
# Run all 44 unit tests
node --test src/utils/*.test.ts

# Run TypeScript type check
npm run lint

# Compile production build
npm run build
```

---

## 🖥️ Deploying to Mac Pro / Mac Mini

1. Open `http://localhost:3000/?tab=mac-pro-station`
2. Click **Get .command Script** to download the double-clickable desktop launcher.
3. Or launch via 1-liner in Terminal:
```bash
curl -sSL "http://localhost:3000/api/macpro/launcher.command" -o ~/Desktop/SkyShadow.command && chmod +x ~/Desktop/SkyShadow.command && open ~/Desktop/SkyShadow.command
```

---

## 🔒 Security & Air-Gap Architecture

All prompt tokens, codebase embeddings, and vector store indices reside strictly on-premise. Physical WAN sockets are severed by the air-gap firewall, preventing exfiltration to third-party model providers.

---

## 📄 License
MIT © 2026 SkyShadow Ltd.
