
import { GoogleGenAI, Type } from "@google/genai";
import { Artifact, Message, ReasoningMode } from "../types";

const getClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const SYSTEM_INSTRUCTION = `
You are the NEXUS Research Orchestrator. Your role is to coordinate a distributed multi-agent system to solve high-complexity research problems.

AGENT ROLES YOU COORDINATE:
1. Literature Agent: Scans web groundings and Memory_Vault for methodology and raw facts.
2. Analysis Critic: Finds contradictions, weak evidence, and surfacing assumptions.
3. Synthesis Scribe: Drafts actionable research artifacts.

BEHAVIORAL RULES:
- If a user asks a complex question, identify if the answer requires an "Atomic Finding" (a Research Card) or a "Full Synthesis" (Narrative).
- Always distinguish between "Empirical Evidence" (from artifacts) and "Inferred Hypothesis."
- Surface contradictions. If one source says X and another says Y, highlight the conflict explicitly.
- Use structured Markdown.
- Keep a calm, analytical, and authoritative tone.

FORMATTING:
- Use ### headers for synthesis.
- Use bold text for key terms.
- Citation format: [Verified via Artifact: {name}].
`;

export const generateResponse = async (
  history: Message[],
  artifacts: Artifact[],
  mode: ReasoningMode,
  lastUserMessage: string
): Promise<string> => {
  const ai = getClient();
  const modelName = mode === 'pro' ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
  
  const contentParts: any[] = [];

  // Add Context Memory
  if (artifacts.length > 0) {
    contentParts.push({ text: "--- BEGIN SECURE CONTEXT MEMORY ---\n" });
    for (const art of artifacts) {
        if (art.type === 'image' && art.mimeType) {
            contentParts.push({
                inlineData: {
                    mimeType: art.mimeType,
                    data: art.content
                }
            });
            contentParts.push({ text: `[Context Object: ${art.name}]` });
        } else if (art.type === 'csv' || art.type === 'text') {
            contentParts.push({ text: `[Document: ${art.name}]\n${art.content}\n---` });
        }
    }
    contentParts.push({ text: "--- END SECURE CONTEXT MEMORY ---\n" });
  }

  contentParts.push({ text: lastUserMessage });

  const tools: any[] = [];
  // Lit Agent always skims web in Flash mode or if searching for current context
  if (mode === 'flash') tools.push({ googleSearch: {} });

  let thinkingConfig = undefined;
  if (mode === 'pro') thinkingConfig = { thinkingBudget: 4096 };

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: { role: 'user', parts: contentParts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: tools.length > 0 ? tools : undefined,
        thinkingConfig: thinkingConfig,
      }
    });

    let finalText = response.text || "";

    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        const chunks = response.candidates[0].groundingMetadata.groundingChunks;
        const links = chunks
            .map((c: any) => c.web?.uri ? `[${c.web.title || 'Source'}](${c.web.uri})` : null)
            .filter(Boolean)
            .join(', ');
        if (links) finalText += `\n\n**External Lit-Review Sources:** ${links}`;
    }

    return finalText;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return `### ⚠️ SYSTEM_ERROR\n\nResearch loop aborted at final synthesis: ${error.message}`;
  }
};
