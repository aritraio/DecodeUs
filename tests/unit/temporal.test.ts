import { describe, expect, it } from "vitest";
import { calculateTemporal } from "@/lib/metrics/temporal";
import type { CanonicalMessage } from "@/types/chat";

function msg(id: string, iso: string): CanonicalMessage {
  return {
    id,
    timestamp: iso,
    senderId: "person_a",
    originalSenderName: "Alex Morgan",
    text: "hi",
    messageType: "text",
    charCount: 2,
    wordCount: 1,
    hasQuestion: false,
    emojis: [],
  };
}

describe("circadian & weekly distribution (task 03.3)", () => {
  it("buckets hours and days, identifies peaks", () => {
    // Build timestamps in LOCAL time so hour buckets are TZ-independent.
    // 2025-01-05 is a Sunday.
    const local = (day: number, hour: number, min: number): string => {
      const d = new Date(2025, 0, day, hour, min, 0);
      return d.toISOString();
    };
    const base = [
      msg("msg_00001", local(5, 12, 5)),
      msg("msg_00002", local(5, 12, 15)),
      msg("msg_00003", local(5, 12, 35)),
      msg("msg_00004", local(6, 8, 0)),
    ];
    const t = calculateTemporal(base);
    expect(t.hourlyDistribution).toHaveLength(24);
    expect(t.dayOfWeekDistribution).toHaveLength(7);
    const total = t.hourlyDistribution.reduce((a, b) => a + b, 0);
    expect(total).toBe(4);
    // peak hour holds the 3-message cluster
    expect(t.hourlyDistribution[t.peakHour]).toBe(3);
    expect(t.busiestDay).toBe("Sunday");
  });
});
