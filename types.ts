
export type ArtifactType = 'text' | 'image' | 'csv' | 'audio';

export interface Artifact {
  id: string;
  name: string;
  type: ArtifactType;
  content: string; // Text content or Base64 string
  mimeType?: string;
  createdAt: number;
}

export type Role = 'user' | 'model';

export type MessageType = 'chat' | 'research_card' | 'security_alert';

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: number;
  type?: MessageType;
  metadata?: {
    confidence?: number;
    source?: string;
    agent?: string;
    phase?: ResearchPhase;
  };
  relatedArtifactIds?: string[];
}

export type ResearchPhase = 'IDLE' | 'PLANNING' | 'COLLECTION' | 'ANALYSIS' | 'SYNTHESIS';

export type ReasoningMode = 'flash' | 'pro';

export type AgentId = 'ORCHESTRATOR' | 'LIT_AGENT' | 'CRITIC' | 'SCRIBE' | 'SEC_OPA';

export interface AgentState {
  id: AgentId;
  name: string;
  status: 'IDLE' | 'ACTIVE' | 'ERROR';
  load: number;
}
