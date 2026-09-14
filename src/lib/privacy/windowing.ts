/**
 * Context window assembler + token budgeting.
 * Window: trigger ±8 messages → dedupe overlaps → cap 25 excerpts
 * (≤12k estimated tokens / <250KB). All text sanitized via anonymizer.
 * Per task 04.3.
 */
import type { CanonicalMessage, ContextExcerpt } from "@/types/chat";
import { redactPII } from "@/lib/privacy/anonymizer";
import { scanTriggers } from "@/lib/privacy/trigger-scanner";

export const WINDOW_RADIUS = 8;
export const MAX_EXCERPTS = 25;
export const MAX_PAYLOAD_BYTES = 250 * 1024;

/** Rough token estimate: ~4 chars per token. */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export function buildExcerptPayload(
  messages: CanonicalMessage[],
  personAName: string,
  personBName: string
): ContextExcerpt[] {
  const hits = scanTriggers(messages);
  if (hits.length === 0) return [];

  // Priority: conflict > disclosure > long_delay > double_text > sample
  const priority: Record<ContextExcerpt["triggerReason"], number> = {
    conflict_lexicon: 0,
    emotional_disclosure: 1,
    long_delay: 2,
    double_text: 3,
    sample: 4,
  };
  const ordered = [...hits].sort(
    (x, y) => priority[x.reason] - priority[y.reason] || x.index - y.index
  );

  // Deduplicate overlapping windows (share >50% of messages)
  const claimed = new Set<number>();
  const excerpts: ContextExcerpt[] = [];
  let counter = 1;

  for (const hit of ordered) {
    if (excerpts.length >= MAX_EXCERPTS) break;
    const start = Math.max(0, hit.index - WINDOW_RADIUS);
    const end = Math.min(messages.length - 1, hit.index + WINDOW_RADIUS);
    const range: number[] = [];
    for (let i = start; i <= end; i++) range.push(i);
    const overlap = range.filter((i) => claimed.has(i)).length;
    if (range.length > 0 && overlap / range.length > 0.5) continue;
    range.forEach((i) => claimed.add(i));

    const windowMsgs = range
      .map((i) => messages[i])
      .filter((m) => m.senderId !== "system");

    const dialogue = windowMsgs.map((m) => {
      const { sanitizedText } = redactPII(m.text, personAName, personBName);
      return {
        sender: (m.senderId === "person_a" ? "Person A" : "Person B") as
          | "Person A"
          | "Person B",
        timestamp: m.timestamp,
        text: sanitizedText,
      };
    });

    if (dialogue.length === 0) continue;

    excerpts.push({
      id: `exc_${String(counter).padStart(2, "0")}`,
      triggerReason: hit.reason,
      startDate: windowMsgs[0].timestamp,
      endDate: windowMsgs[windowMsgs.length - 1].timestamp,
      dialogue,
    });
    counter++;
  }

  // Enforce byte + token budgets (drop lowest-priority tail first)
  let payload = JSON.stringify(excerpts);
  while (
    excerpts.length > 1 &&
    (payload.length > MAX_PAYLOAD_BYTES || estimateTokens(payload) > 12_000)
  ) {
    excerpts.pop();
    payload = JSON.stringify(excerpts);
  }

  return excerpts;
}
