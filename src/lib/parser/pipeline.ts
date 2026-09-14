/**
 * Shared full-pipeline runner executed by the Web Worker AND the
 * in-thread test fallback. Single source of truth for:
 *   parse → metadata → metrics → excerpts.
 */
import { matchMessageHeader } from "@/lib/parser/regex-patterns";
import { normalizeLines } from "@/lib/parser/message-normalizer";
import {
  ParserError,
  assembleMetadata,
  identifyParticipants,
} from "@/lib/parser/participant-detector";
import { computeMetrics } from "@/lib/metrics";
import { buildExcerptPayload } from "@/lib/privacy/windowing";
import type { CanonicalMessage, ConversationMetadata } from "@/types/chat";
import type { DeterministicMetrics } from "@/types/metrics";
import type { ContextExcerpt } from "@/types/chat";

export interface PipelineResult {
  messages: CanonicalMessage[];
  metadata: ConversationMetadata;
  metrics: DeterministicMetrics;
  excerpts: ContextExcerpt[];
}

/** Collect ordered sender names for participant identification. */
export function collectSenderNames(fileContent: string): string[] {
  const names: string[] = [];
  for (const line of fileContent.split(/\r?\n/)) {
    if (line.trim() === "") continue;
    const h = matchMessageHeader(line);
    if (h) names.push(h.senderName);
  }
  return names;
}

export function runFullPipeline(fileContent: string): PipelineResult {
  if (!fileContent || fileContent.trim().length === 0) {
    throw new ParserError("EMPTY_CHAT", "The uploaded file is empty.");
  }

  const orderedNames = collectSenderNames(fileContent);
  if (orderedNames.length === 0) {
    throw new ParserError(
      "UNPARSEABLE_CHAT",
      "Unsupported file format. Please upload a WhatsApp .txt chat export."
    );
  }

  const participants = identifyParticipants(orderedNames);
  const { messages } = normalizeLines(fileContent, participants.slotFor);

  if (messages.filter((m) => m.senderId !== "system").length === 0) {
    throw new ParserError("EMPTY_CHAT", "No human messages found in this export.");
  }

  const metadata = assembleMetadata(messages, participants);
  const metrics = computeMetrics(messages, metadata);
  const excerpts = buildExcerptPayload(
    messages,
    participants.personAName,
    participants.personBName
  );

  return { messages, metadata, metrics, excerpts };
}
