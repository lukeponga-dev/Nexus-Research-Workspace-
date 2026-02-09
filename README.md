# NEXUS | Research Command Center

NEXUS is a high-fidelity research substrate designed for complex synthesis and multi-perspective analysis. It leverages the **Gemini 3** intelligence layer to orchestrate a distributed agent model, transforming fragmented data into structured, decision-ready insights.

## 🚀 Vision
In the modern information landscape, the bottleneck is no longer access to data, but the **cognitive load of synthesis**. NEXUS acts as an intelligence force-multiplier, automating the "Research-Verify-Synthesize" loop through specialized agent roles.

## 🏗️ Technical Architecture

### 1. Intelligence Layer (Substrates)
NEXUS utilizes a multi-model routing strategy:
- **Primary Orchestrator (Gemini 3 Pro):** Handles planning, task decomposition, and memory management.
- **Specialized Agents (Gemini 3 Flash):** Optimized for high-throughput literature scanning, security validation, and drafting.

### 2. Distributed Agent Model
The system simulates a micro-agent architecture within a unified workspace:
- **LIT_AGENT:** Grounded web search and artifact ingestion.
- **CRITIC:** Dialectical analysis and contradiction surfacing.
- **SCRIBE:** Synthesis and memo generation.
- **SEC_OPA:** Real-time OPA-inspired policy enforcement and prompt injection scanning.

### 3. Secure Context Vault
Persistent storage is handled via **IndexedDB**, creating a local-first "Memory Vault" where research artifacts (CSVs, MD, Images) are stored and injected into the Gemini context window dynamically.

## 🛠️ Tech Stack
- **Frontend:** React 19, Tailwind CSS
- **Intelligence:** Google GenAI SDK (Gemini 3)
- **Visualization:** Recharts (Dynamic CSV-to-Graph rendering)
- **Security:** OPA Simulation & Gemini-based Input Validation
- **Persistence:** IndexedDB (idb)

## 📡 Key Features
- **Grounding Integration:** Real-time web search integration via Gemini's Google Search tool.
- **Thinking Mode:** High-budget reasoning for complex research queries using Gemini 3 Pro.
- **Artifact Visualization:** Automatic detection and rendering of CSV data into interactive charts.
- **Security Posture:** Real-time monitoring of agent load, system latency, and security validation status.

## 📥 Getting Started
1. Clone the repository.
2. Ensure `process.env.API_KEY` is configured with a valid Google Gemini API Key.
3. `npm install` and `npm start`.
4. Use the "Import Demo Data" button in the sidebar to populate the context vault.

---
*NEXUS: Cognitive Synthesis at Scale.*
