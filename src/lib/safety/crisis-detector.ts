/**
 * Crisis keyword detector — routes to the safe off-ramp when self-harm
 * or domestic-violence indicators appear. Conservative by design:
 * any hit triggers the support modal (privacy-security.md §6.4).
 */
import type { CanonicalMessage } from "@/types/chat";

const CRISIS_PATTERNS = [
  /kill (you|myself|me|him|her|them)/i,
  /hurt (you|me|myself|him|her|them)/i,
  /hit (you|me|him|her)/i,
  /beat (you|me) up/i,
  /threaten/i,
  /afraid (you'?ll|he'?ll|she'?ll) hurt/i,
  /self[\s-]?harm/i,
  /suicid/i,
  /end (my|it all|everything)/i,
  /don'?t (want to|wanna) live/i,
  /i'?ll make you (pay|regret|suffer)/i,
  /watch (yourself|your back)/i,
  /you'?re (dead|finished)/i,
  /domestic violen/i,
  /call the police/i,
];

export interface CrisisScan {
  flagged: boolean;
  matchedCount: number;
  matchedIds: string[];
}

/** Scan canonical messages for crisis indicators. */
export function scanForCrisis(messages: CanonicalMessage[]): CrisisScan {
  const matchedIds: string[] = [];
  for (const m of messages) {
    if (m.senderId === "system") continue;
    if (CRISIS_PATTERNS.some((re) => re.test(m.text))) {
      matchedIds.push(m.id);
    }
  }
  return { flagged: matchedIds.length > 0, matchedCount: matchedIds.length, matchedIds };
}
