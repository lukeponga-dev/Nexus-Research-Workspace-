export const agentManifest = {
  "orchestrator": {
    "systempromptpath": "orchestrator/system_prompt.txt",
    "tools": ["websearch", "docloader", "memory_writer"],
    "description": "Primary controller."
  },
  "research_agent": {
    "systempromptpath": "agents/research_agent/system_prompt.txt",
    "tools": ["websearch", "docloader"],
    "description": "Search + extraction + analysis."
  },
  "synthesis_agent": {
    "systempromptpath": "agents/synthesis_agent/system_prompt.txt",
    "tools": [],
    "description": "Summaries + structured writing."
  }
};