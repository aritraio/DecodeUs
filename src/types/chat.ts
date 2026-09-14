/**
 * Canonical domain models — normalized representations of WhatsApp exports.
 * Matches api-spec.md §1 and architecture.md §2.2.
 * Synthetic data only. Raw chats never leave the browser.
 */

/** Normalized representation of a single conversation line. */
export interface CanonicalMessage {
  /** Sequential index, e.g. "msg_00001" */
  id: string;
  /** ISO 8601 UTC string, e.g. "2026-09-14T08:30:00.000Z" */
  timestamp: string;
  senderId: "person_a" | "person_b" | "system";
  /** Scraped display name from WhatsApp (redacted before any LLM call) */
  originalSenderName: string;
  /** Cleaned message body */
  text: string;
  messageType: "text" | "media_omitted" | "deleted" | "system";
  charCount: number;
  wordCount: number;
  /** Ends with '?' or contains interrogative markers */
  hasQuestion: boolean;
  /** Unicode emoji array */
  emojis: string[];
}

/** High-level summary of the imported conversation. */
export interface ConversationMetadata {
  conversationId: string;
  senderA: { id: "person_a"; displayName: string };
  senderB: { id: "person_b"; displayName: string };
  totalMessages: number;
  /** ISO 8601 */
  startDate: string;
  /** ISO 8601 */
  endDate: string;
  totalDays: number;
}

/** Dialogue excerpt window used as evidence and LLM context. */
export interface ContextExcerpt {
  /** E.g. "exc_01" */
  id: string;
  triggerReason:
    | "conflict_lexicon"
    | "long_delay"
    | "double_text"
    | "emotional_disclosure"
    | "sample";
  startDate: string;
  endDate: string;
  dialogue: Array<{
    sender: "Person A" | "Person B";
    timestamp: string;
    text: string;
  }>;
}

export type SenderId = CanonicalMessage["senderId"];
export type MessageType = CanonicalMessage["messageType"];
export type TriggerReason = ContextExcerpt["triggerReason"];
