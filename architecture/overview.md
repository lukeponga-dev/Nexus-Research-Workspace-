# Architectural Deep Dive: The Nexus Substrate

NEXUS is built on the principle of **Cognitive Decoupling**. Instead of a monolithic prompt, it treats the research process as a series of distinct, verifiable transitions.

## 1. The Interaction Loop
1. **Input Ingestion:** The user provides a high-level directive (e.g., "Analyze the impact of interest rate changes on SaaS valuations").
2. **Security Pre-flight:** The `SEC_OPA` agent validates the input for injection attacks or policy violations.
3. **Decomposition:** The `ORCHESTRATOR` breaks the goal into a multi-step research plan.
4. **Context Injection:** Relevant artifacts from the `Context_Vault` are serialized and injected into the prompt.
5. **Execution:** Specialized agents (Literature, Critic, Scribe) execute their respective phases.
6. **Synthesis:** The final output is rendered as a "Research Card" (structured data) or a "Synthesis Memo" (narrative).

## 2. Agent Specialization
The system leverages different model configurations for different tasks:
- **High-Temperature Scribe:** For creative framing of memos.
- **Low-Temperature Critic:** For rigorous fact-checking and contradiction detection.
- **Thinking-Budget Orchestrator:** Uses the Gemini 3 `thinkingConfig` to ensure the logic path is sound before generating output.

## 3. Grounding & Veracity
NEXUS strictly differentiates between **Internal Context** (User artifacts) and **Global Knowledge** (Web search). 
- When `googleSearch` is triggered, the system extracts `groundingChunks` to provide explicit citations.
- This prevents "hallucination leak" by anchoring model claims to specific sources.

## 4. Visualization Engine
The `ChartRenderer` component provides a "live-code" feel. When the model identifies numeric trends in CSV artifacts, the UI automatically mounts a Recharts instance to visualize the data, bridging the gap between raw information and executive understanding.
