/**
 * Heuristic trigger scanner — finds relationally salient moments in the
 * canonical stream without any LLM. Per task 04.2 / architecture.md §2.4.
 */
import type { CanonicalMessage, TriggerReason } from "@/types/chat";

export interface TriggerHit {
  index: number;
  reason: TriggerReason;
}

const CONFLICT_LEXICON = [
  "always",
  "never",
  "listen",
  "upset",
  "sorry",
  "apologize",
  "apologise",
  "hurt",
  "fault",
  "tired of",
  "overreact",
  "defensive",
  "blame",
  "argue",
  "fight",
  "angry",
  "frustrat",
  "disappoint",
  "ignore",
  "dismiss",
];

const VULNERABILITY_MARKERS = [
  "i feel",
  "i'm scared",
  "i am scared",
  "worried",
  "anxious",
  "need you",
  "miss you",
  "love you",
  "afraid",
  "insecure",
  "jealous",
];

const LONG_DELAY_MS = 12 * 60 * 60 * 1000;
const DOUBLE_TEXT_BURST = 4;
const DISCLOSURE_WORDS = 50;

/** Scan messages; returns trigger hits with canonical indices. */
export function scanTriggers(messages: CanonicalMessage[]): TriggerHit[] {
  const hits: TriggerHit[] = [];
  const human = messages
    .map((m, i) => ({ m, i }))
    .filter(({ m }) => m.senderId !== "system" && m.messageType === "text");

  // Trigger 1: conflict lexicon
  for (const { m, i } of human) {
    const lower = m.text.toLowerCase();
    if (CONFLICT_LEXICON.some((w) => lower.includes(w))) {
      hits.push({ index: i, reason: "conflict_lexicon" });
    }
  }

  // Trigger 2: long delay (>12h) followed by terse reply (<5 words)
  for (let k = 1; k < human.length; k++) {
    const prev = human[k - 1].m;
    const cur = human[k].m;
    const gap =
      new Date(cur.timestamp).getTime() - new Date(prev.timestamp).getTime();
    if (gap > LONG_DELAY_MS && cur.wordCount < 5) {
      hits.push({ index: human[k].i, reason: "long_delay" });
    }
  }

  // Trigger 3: double-text bursts (≥4 consecutive from one participant)
  let runStart = 0;
  for (let k = 1; k <= human.length; k++) {
    const same =
      k < human.length && human[k].m.senderId === human[k - 1].m.senderId;
    if (!same) {
      const runLen = k - runStart;
      if (runLen >= DOUBLE_TEXT_BURST) {
        // tag the middle message of the burst as the trigger anchor
        const anchor = runStart + Math.floor(runLen / 2);
        hits.push({ index: human[anchor].i, reason: "double_text" });
      }
      runStart = k;
    }
  }

  // Trigger 4: emotional disclosure (>50 words + question or vulnerability marker)
  for (const { m, i } of human) {
    if (m.wordCount > DISCLOSURE_WORDS) {
      const lower = m.text.toLowerCase();
      if (
        m.hasQuestion ||
        VULNERABILITY_MARKERS.some((w) => lower.includes(w))
      ) {
        hits.push({ index: i, reason: "emotional_disclosure" });
      }
    }
  }

  // Trigger 5: chronological anchors — 1 per calendar month
  const seenMonths = new Set<string>();
  for (const { m, i } of human) {
    const d = new Date(m.timestamp);
    const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}`;
    if (!seenMonths.has(key)) {
      seenMonths.add(key);
      hits.push({ index: i, reason: "sample" });
    }
  }

  return hits;
}
