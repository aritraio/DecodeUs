/**
 * Circadian (24h) + weekly (7d) temporal distribution. Per task 03.3.
 * Hours are computed in LOCAL time (Date#getHours) to reflect the
 * user's lived texting rhythm.
 */
import type { CanonicalMessage } from "@/types/chat";
import type { TemporalMetrics } from "@/types/metrics";

export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export function calculateTemporal(messages: CanonicalMessage[]): TemporalMetrics {
  const hourly = new Array<number>(24).fill(0);
  const weekly = new Array<number>(7).fill(0);

  for (const m of messages) {
    if (m.senderId === "system") continue;
    const d = new Date(m.timestamp);
    if (Number.isNaN(d.getTime())) continue;
    hourly[d.getHours()]++;
    weekly[d.getDay()]++;
  }

  let peakHour = 0;
  for (let h = 1; h < 24; h++) {
    if (hourly[h] > hourly[peakHour]) peakHour = h;
  }
  let busyIdx = 0;
  for (let i = 1; i < 7; i++) {
    if (weekly[i] > weekly[busyIdx]) busyIdx = i;
  }

  return {
    hourlyDistribution: hourly,
    dayOfWeekDistribution: weekly,
    peakHour,
    busiestDay: DAY_NAMES[busyIdx],
  };
}
