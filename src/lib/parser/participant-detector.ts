/**
 * Participant identification & metadata assembly. Per task 02.3.
 * - Tallies human senders (excludes system notifications).
 * - <2 → SINGLE_PARTICIPANT_DETECTED, >2 → GROUP_CHAT_UNSUPPORTED.
 * - person_a = sender of first human message, person_b = second distinct.
 */
import type { CanonicalMessage, ConversationMetadata } from "@/types/chat";
import { classifyBody } from "@/lib/parser/regex-patterns";

export class ParserError extends Error {
  code: "SINGLE_PARTICIPANT_DETECTED" | "GROUP_CHAT_UNSUPPORTED" | "EMPTY_CHAT" | "UNPARSEABLE_CHAT";
  constructor(
    code: ParserError["code"],
    message: string
  ) {
    super(message);
    this.name = "ParserError";
    this.code = code;
  }
}

export interface ParticipantMap {
  slotFor: (name: string) => "person_a" | "person_b" | "system";
  personAName: string;
  personBName: string;
}

/**
 * Discover the two participants from raw headers (pre-normalization).
 * Accepts ordered sender names as they first appear.
 */
export function identifyParticipants(orderedSenderNames: string[]): ParticipantMap {
  const seen: string[] = [];
  for (const name of orderedSenderNames) {
    if (classifyBody(name) === "system") continue;
    if (!seen.includes(name)) seen.push(name);
    if (seen.length > 2) {
      throw new ParserError(
        "GROUP_CHAT_UNSUPPORTED",
        `Group chat detected (${seen.length} participants). DecodeUs supports two-person conversations only.`
      );
    }
  }
  if (seen.length < 2) {
    throw new ParserError(
      "SINGLE_PARTICIPANT_DETECTED",
      "Only 1 participant detected. DecodeUs requires a two-person conversation."
    );
  }
  const [a, b] = seen;
  const norm = (s: string): string => s.trim().toLowerCase();
  return {
    personAName: a,
    personBName: b,
    slotFor: (name: string) => {
      if (norm(name) === norm(a)) return "person_a";
      if (norm(name) === norm(b)) return "person_b";
      // Unknown late-appearing sender (e.g. name change edge) → map to closest
      return "person_b";
    },
  };
}

/** Assemble ConversationMetadata from normalized messages + participant map. */
export function assembleMetadata(
  messages: CanonicalMessage[],
  map: ParticipantMap,
  conversationId = "conv_local_001"
): ConversationMetadata {
  const human = messages.filter((m) => m.senderId !== "system");
  if (human.length === 0) {
    throw new ParserError("EMPTY_CHAT", "No human messages found in this export.");
  }
  const sorted = [...human].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  const start = sorted[0].timestamp;
  const end = sorted[sorted.length - 1].timestamp;
  const days = Math.max(
    1,
    Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 86_400_000)
  );
  return {
    conversationId,
    senderA: { id: "person_a", displayName: map.personAName },
    senderB: { id: "person_b", displayName: map.personBName },
    totalMessages: human.length,
    startDate: start,
    endDate: end,
    totalDays: days,
  };
}
