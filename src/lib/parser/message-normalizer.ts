/**
 * Sequential line processor: multiline stitching, counts, question
 * detection, and Unicode emoji extraction. Per task 02.2.
 */
import {
  classifyBody,
  matchMessageHeader,
  normalizeToISO,
} from "@/lib/parser/regex-patterns";
import type { CanonicalMessage } from "@/types/chat";

/** Full-Unicode emoji matcher (Extended_Pictographic + common symbols). */
const EMOJI_REGEX =
  /\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic}*)?|[\u2600-\u27BF\u2B00-\u2BFF\uFE0F]/gu;

const INTERROGATIVE_MARKERS =
  /^(who|what|when|where|why|how|are|is|do|does|did|can|could|would|will|have|has|should|are you|do you)\b/i;

/** Extract all emoji characters from text. */
export function extractEmojis(text: string): string[] {
  return Array.from(text.matchAll(EMOJI_REGEX), (m) => m[0]);
}

/** Question detection: ends with '?' or starts with interrogative marker. */
export function detectQuestion(text: string): boolean {
  const t = text.trim();
  if (t.endsWith("?")) return true;
  return INTERROGATIVE_MARKERS.test(t);
}

export function countWords(text: string): number {
  const t = text.trim();
  if (t.length === 0) return 0;
  return t.split(/\s+/).length;
}

function padId(n: number): string {
  return `msg_${String(n).padStart(5, "0")}`;
}

export interface NormalizeResult {
  messages: CanonicalMessage[];
  /** Lines that could not be attached to any message (leading junk). */
  orphanLines: number;
}

/**
 * Parse full WhatsApp export text into canonical messages.
 * Continuation lines (no timestamp header) append to the previous
 * message body with "\n". Sender mapping is applied afterwards via
 * participant-detector; here senderId is a provisional slot filled
 * from the ordered sender list.
 */
export function normalizeLines(
  fileContent: string,
  senderSlotFor: (name: string) => "person_a" | "person_b" | "system"
): NormalizeResult {
  const rawLines = fileContent.split(/\r?\n/);
  type Draft = {
    timestamp: string;
    senderName: string;
    body: string;
    system: boolean;
  };
  const drafts: Draft[] = [];
  let orphans = 0;

  for (const line of rawLines) {
    if (line.trim() === "") continue;
    const header = matchMessageHeader(line);
    if (header) {
      const iso = normalizeToISO(header.datePart, header.timePart);
      if (!iso) {
        // Unparseable date → treat as continuation if possible
        if (drafts.length > 0) {
          drafts[drafts.length - 1].body += `\n${line}`;
        } else {
          orphans++;
        }
        continue;
      }
      const cls = classifyBody(header.body);
      drafts.push({
        timestamp: iso,
        senderName: header.senderName,
        body: header.body,
        system: cls === "system",
      });
    } else {
      if (drafts.length > 0) {
        drafts[drafts.length - 1].body += `\n${line}`;
      } else {
        orphans++;
      }
    }
  }

  const messages: CanonicalMessage[] = drafts.map((d, i) => {
    const messageType = classifyBody(d.body);
    const senderId = messageType === "system" ? "system" : senderSlotFor(d.senderName);
    const text = d.body;
    return {
      id: padId(i + 1),
      timestamp: d.timestamp,
      senderId,
      originalSenderName: d.senderName,
      text,
      messageType,
      charCount: Array.from(text).length,
      wordCount: countWords(text),
      hasQuestion: messageType === "text" ? detectQuestion(text) : false,
      emojis: extractEmojis(text),
    };
  });

  return { messages, orphanLines: orphans };
}
