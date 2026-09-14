/**
 * Structured intelligence report contracts.
 * Matches api-spec.md §2 (Gemini responseSchema) + §3 + §4 mock fixture.
 */

export type SignalType = "GREEN" | "RED" | "AMBER";
export type SignalCategory =
  | "COMMUNICATION"
  | "CONFLICT"
  | "RECIPROCITY"
  | "EFFORT"
  | "BOUNDARIES"
  | "AFFECTION";
export type ConfidenceLevel = "HIGH" | "MODERATE" | "LOW" | "INSUFFICIENT_EVIDENCE";
export type RealityVerdict = "SUPPORTED_BY_DATA" | "PARTIALLY_SUPPORTED" | "DEBUNKED_BY_DATA";

export interface RelationshipFingerprint {
  communication: number;
  emotionalReciprocity: number;
  conflictHandling: number;
  effortBalance: number;
  affection: number;
  consistency: number;
  boundaries: number;
  summary: string;
}

export interface BehavioralSignal {
  id: string;
  type: SignalType;
  category: SignalCategory;
  title: string;
  description: string;
  confidence: ConfidenceLevel;
  occurrences: number;
  evidenceExcerptIds: string[];
  recommendation: string;
}

export interface PatternLoop {
  id: string;
  name: string;
  /** Step-by-step loop progression */
  sequence: string[];
  occurrencesCount: number;
  typicalResolution: string;
}

export interface RealityCheck {
  userAssumption: string;
  observedData: string;
  verdict: RealityVerdict;
  explanation: string;
}

export interface WrappedHighlights {
  topGreenFlag: string;
  topMixedSignal: string;
  /** E.g. "The Thoughtful Sprints" */
  relationshipVibeTitle: string;
  communicationTakeaway: string;
}

export interface IntelligenceReport {
  fingerprint: RelationshipFingerprint;
  signals: BehavioralSignal[];
  patternLoops: PatternLoop[];
  realityChecks: RealityCheck[];
  wrappedHighlights: WrappedHighlights;
}

export interface ChatAnswer {
  answer: string;
  confidence: ConfidenceLevel | string;
  supportingExcerptIds: string[];
}

export interface AnalyzeRequest {
  relationshipType: string;
  optionalConcern?: string;
  deterministicMetrics: import("@/types/metrics").DeterministicMetrics;
  contextExcerpts: import("@/types/chat").ContextExcerpt[];
}
