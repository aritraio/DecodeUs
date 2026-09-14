/**
 * Initiation & session dynamics (3-hour silence threshold).
 * Per architecture.md §2.3 and task 03.1.
 */
import type { CanonicalMessage } from "@/types/chat";
import type { InitiationMetrics } from "@/types/metrics";

export const SESSION_GAP_THRESHOLD_MS = 3 * 60 * 60 * 1000; // 180 minutes
export const LONG_SILENCE_FOLLOWUP_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface InitiationResult extends InitiationMetrics {
  /** Sessions that resumed after a >24h silence, per participant. */
  followUpAfterLongSilence: { personA: number; personB: number };
}

export function calculateInitiations(messages: CanonicalMessage[]): InitiationResult {
  const sorted = [...messages]
    .filter((m) => m.messageType === "text" && m.senderId !== "system")
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  let personA = 0;
  let personB = 0;
  let followA = 0;
  let followB = 0;
  let lastTs = 0;

  for (const msg of sorted) {
    const ts = new Date(msg.timestamp).getTime();
    if (lastTs === 0 || ts - lastTs >= SESSION_GAP_THRESHOLD_MS) {
      if (msg.senderId === "person_a") {
        personA++;
        if (lastTs !== 0 && ts - lastTs >= LONG_SILENCE_FOLLOWUP_MS) followA++;
      } else if (msg.senderId === "person_b") {
        personB++;
        if (lastTs !== 0 && ts - lastTs >= LONG_SILENCE_FOLLOWUP_MS) followB++;
      }
    }
    lastTs = ts;
  }

  const total = personA + personB;
  return {
    thresholdHours: 3,
    totalSessions: total,
    personA: {
      count: personA,
      percentage: total > 0 ? personA / total : 0.5,
    },
    personB: {
      count: personB,
      percentage: total > 0 ? personB / total : 0.5,
    },
    followUpAfterLongSilence: { personA: followA, personB: followB },
  };
}
