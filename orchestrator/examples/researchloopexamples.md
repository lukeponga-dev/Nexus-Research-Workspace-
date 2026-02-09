
Example Research Loop

User goal: “I want to understand whether we should use Gen App Builder or build our own RAG stack.”

1. Orchestrator:
   - Clarifies constraints (budget, timeline, team skills).
   - Sends task to Research Agent:
     - “Compare Gen App Builder vs custom RAG stack on cost, speed to market, flexibility, and maintenance.”

2. Research Agent:
   - Searches web and internal docs.
   - Produces comparison table + bullet analysis.

3. Orchestrator:
   - Sends findings to Synthesis Agent:
     - “Write a 1-page decision memo for a product lead.”

4. Synthesis Agent:
   - Produces memo with:
     - Summary
     - Options
     - Tradeoffs
     - Recommendation

5. Orchestrator:
   - Logs key points in Research Log.
   - Creates 2–3 Research Cards (e.g., “Gen App Builder tradeoffs”, “Custom RAG maintenance cost”).
   - Suggests next step: “Run a small spike with Gen App Builder.”
