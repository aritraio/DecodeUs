import { describe, expect, it } from "vitest";
import { calculateResponseSpeed } from "@/lib/metrics/response-speed";
import type { CanonicalMessage } from "@/types/chat";

function msg(id: string, iso: string, sender: "person_a" | "person_b"): CanonicalMessage {
  return {
    id,
    timestamp: iso,
    senderId: sender,
    originalSenderName: "X",
    text: "hi",
    messageType: "text",
    charCount: 2,
    wordCount: 1,
    hasQuestion: false,
    emojis: [],
  };
}

describe("response latency (task 03.2)", () => {
  it("measures latency only on sender switches, median robust to sleep gaps", () => {
    const messages = [
      msg("msg_00001", "2025-01-05T09:00:00.000Z", "person_a"),
      msg("msg_00002", "2025-01-05T09:01:00.000Z", "person_b"), // B: 60s
      msg("msg_00003", "2025-01-05T09:03:00.000Z", "person_a"), // A: 120s
      msg("msg_00004", "2025-01-05T09:04:00.000Z", "person_a"), // same sender → ignored
      msg("msg_00005", "2025-01-06T09:04:00.000Z", "person_b"), // B: 24h (outlier)
    ];
    const { metrics } = calculateResponseSpeed(messages);
    expect(metrics.personB.medianSeconds).toBe(Math.round((60 + 86400) / 2));
    // A's single sample
    expect(metrics.personA.medianSeconds).toBe(120);
    expect(metrics.personA.averageSeconds).toBe(120);
  });

  it("fills speed distribution buckets", () => {
    const messages = [
      msg("msg_00001", "2025-01-05T09:00:00.000Z", "person_a"),
      msg("msg_00002", "2025-01-05T09:00:30.000Z", "person_b"), // <1m
      msg("msg_00003", "2025-01-05T09:03:30.000Z", "person_a"), // 1-5m
      msg("msg_00004", "2025-01-05T09:13:30.000Z", "person_b"), // 5-30m
      msg("msg_00005", "2025-01-05T10:13:30.000Z", "person_a"), // 30m-2h
      msg("msg_00006", "2025-01-05T14:13:30.000Z", "person_b"), // 2h+
    ];
    const { metrics } = calculateResponseSpeed(messages);
    expect(metrics.distribution).toMatchObject({
      under1m: 1,
      m1to5: 1,
      m5to30: 1,
      m30to2h: 1,
      over2h: 1,
    });
  });

  it("tracks longest silence with timestamps", () => {
    const messages = [
      msg("msg_00001", "2025-01-05T09:00:00.000Z", "person_a"),
      msg("msg_00002", "2025-01-05T19:00:00.000Z", "person_b"),
    ];
    const { longestSilence } = calculateResponseSpeed(messages);
    expect(longestSilence?.hours).toBeCloseTo(10);
    expect(longestSilence?.start).toBe("2025-01-05T09:00:00.000Z");
  });
});
