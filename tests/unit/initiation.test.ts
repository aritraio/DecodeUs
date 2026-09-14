import { describe, expect, it } from "vitest";
import { calculateInitiations, SESSION_GAP_THRESHOLD_MS } from "@/lib/metrics/initiation";
import type { CanonicalMessage } from "@/types/chat";

function msg(id: string, iso: string, sender: "person_a" | "person_b"): CanonicalMessage {
  return {
    id,
    timestamp: iso,
    senderId: sender,
    originalSenderName: sender === "person_a" ? "Alex Morgan" : "Jordan Lee",
    text: "hello",
    messageType: "text",
    charCount: 5,
    wordCount: 1,
    hasQuestion: false,
    emojis: [],
  };
}

describe("initiation & sessions (task 03.1)", () => {
  it("exposes the 3-hour threshold constant", () => {
    expect(SESSION_GAP_THRESHOLD_MS).toBe(3 * 60 * 60 * 1000);
  });

  it("counts first message of each 3h session as initiation", () => {
    const messages = [
      msg("msg_00001", "2025-01-05T09:00:00.000Z", "person_a"),
      msg("msg_00002", "2025-01-05T09:10:00.000Z", "person_b"),
      msg("msg_00003", "2025-01-05T09:20:00.000Z", "person_a"),
      // 4h gap → new session initiated by B
      msg("msg_00004", "2025-01-05T13:30:00.000Z", "person_b"),
      msg("msg_00005", "2025-01-05T13:35:00.000Z", "person_a"),
    ];
    const r = calculateInitiations(messages);
    expect(r.personA.count).toBe(1);
    expect(r.personB.count).toBe(1);
    expect(r.totalSessions).toBe(2);
    expect(r.personA.percentage).toBeCloseTo(0.5);
  });

  it("tracks follow-up initiation after 24h silences", () => {
    const messages = [
      msg("msg_00001", "2025-01-05T09:00:00.000Z", "person_a"),
      msg("msg_00002", "2025-01-07T10:00:00.000Z", "person_b"),
    ];
    const r = calculateInitiations(messages);
    expect(r.followUpAfterLongSilence.personB).toBe(1);
    expect(r.followUpAfterLongSilence.personA).toBe(0);
  });

  it("returns 50/50 on empty input", () => {
    const r = calculateInitiations([]);
    expect(r.totalSessions).toBe(0);
    expect(r.personA.percentage).toBe(0.5);
  });
});
