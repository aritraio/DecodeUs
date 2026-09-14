/**
 * Response latency & speed distribution calculator.
 * Latency measured only on sender switches. Median is robust against
 * overnight sleep gaps. Per task 03.2.
 */
import type { CanonicalMessage } from "@/types/chat";
import type { ResponseSpeedMetrics } from "@/types/metrics";

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 1 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export interface LatencyDetail {
  metrics: ResponseSpeedMetrics;
  longestSilence: { hours: number; start: string; end: string } | null;
}

export function calculateResponseSpeed(messages: CanonicalMessage[]): LatencyDetail {
  const sorted = [...messages]
    .filter((m) => m.senderId !== "system")
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  const latA: number[] = []; // time Person A took to reply to B
  const latB: number[] = []; // time Person B took to reply to A
  const buckets = { under1m: 0, m1to5: 0, m5to30: 0, m30to2h: 0, over2h: 0 };

  let longestMs = 0;
  let longestStart = "";
  let longestEnd = "";
  let longestA = 0; // longest silence attributed per replier
  let longestB = 0;

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const cur = sorted[i];
    if (prev.senderId === cur.senderId) continue;
    if (prev.senderId === "system" || cur.senderId === "system") continue;
    const deltaSec =
      (new Date(cur.timestamp).getTime() - new Date(prev.timestamp).getTime()) / 1000;
    if (deltaSec < 0) continue;

    if (cur.senderId === "person_a") {
      latA.push(deltaSec);
      if (deltaSec > longestA) longestA = deltaSec;
    } else {
      latB.push(deltaSec);
      if (deltaSec > longestB) longestB = deltaSec;
    }

    if (deltaSec < 60) buckets.under1m++;
    else if (deltaSec < 300) buckets.m1to5++;
    else if (deltaSec < 1800) buckets.m5to30++;
    else if (deltaSec < 7200) buckets.m30to2h++;
    else buckets.over2h++;

    if (deltaSec * 1000 > longestMs) {
      longestMs = deltaSec * 1000;
      longestStart = prev.timestamp;
      longestEnd = cur.timestamp;
    }
  }

  return {
    metrics: {
      personA: {
        averageSeconds: Math.round(mean(latA)),
        medianSeconds: Math.round(median(latA)),
        longestSilenceHours: Math.round((longestA / 3600) * 10) / 10,
      },
      personB: {
        averageSeconds: Math.round(mean(latB)),
        medianSeconds: Math.round(median(latB)),
        longestSilenceHours: Math.round((longestB / 3600) * 10) / 10,
      },
      distribution: buckets,
    },
    longestSilence:
      longestMs > 0
        ? {
            hours: Math.round((longestMs / 3_600_000) * 10) / 10,
            start: longestStart,
            end: longestEnd,
          }
        : null,
  };
}
