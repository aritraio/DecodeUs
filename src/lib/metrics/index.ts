/**
 * Master metrics orchestrator — combines all deterministic modules.
 * Runs synchronously in the Web Worker. Target <300ms for 20k messages.
 * Per task 03.5.
 */
import type { CanonicalMessage, ConversationMetadata } from "@/types/chat";
import type { DeterministicMetrics } from "@/types/metrics";
import { calculateInitiations } from "@/lib/metrics/initiation";
import { calculateResponseSpeed } from "@/lib/metrics/response-speed";
import { calculateTemporal } from "@/lib/metrics/temporal";
import { calculateLexical } from "@/lib/metrics/lexical";

export function computeMetrics(
  messages: CanonicalMessage[],
  metadata: ConversationMetadata
): DeterministicMetrics {
  const human = messages.filter((m) => m.senderId !== "system");
  const countA = human.filter((m) => m.senderId === "person_a").length;
  const countB = human.filter((m) => m.senderId === "person_b").length;
  const total = human.length;

  const initiation = calculateInitiations(messages);
  const { metrics: responseSpeed } = calculateResponseSpeed(messages);
  const temporal = calculateTemporal(messages);
  const lexical = calculateLexical(messages);

  return {
    volume: {
      totalMessages: total,
      personA: {
        count: countA,
        percentage: total > 0 ? countA / total : 0.5,
      },
      personB: {
        count: countB,
        percentage: total > 0 ? countB / total : 0.5,
      },
      averagePerDay: metadata.totalDays > 0 ? Math.round((total / metadata.totalDays) * 10) / 10 : total,
    },
    initiation: {
      thresholdHours: initiation.thresholdHours,
      totalSessions: initiation.totalSessions,
      personA: initiation.personA,
      personB: initiation.personB,
    },
    responseSpeed,
    temporal,
    lexical,
  };
}

export { SESSION_GAP_THRESHOLD_MS } from "@/lib/metrics/initiation";
