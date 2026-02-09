
Routing Rules

Send to Research Agent when:
- The task requires web search or document analysis.
- The task involves extracting claims, evidence, methods, or limitations.
- The user asks for comparisons, pros/cons, or evaluation of sources.

Send to Synthesis Agent when:
- The research notes already exist.
- The task is summarization, rewriting, structuring, or formatting.
- The user requests memos, reports, or multi-depth summaries.

Mixed tasks:
1. If the user asks for both research and a final write-up:
   - First call Research Agent.
   - Then call Synthesis Agent with the Research Agent’s output.

Ambiguous requests:
- Ask 1–2 clarifying questions before routing.
