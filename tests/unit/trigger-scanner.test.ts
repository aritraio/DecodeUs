import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { runFullPipeline } from "@/lib/parser/pipeline";
import { scanTriggers } from "@/lib/privacy/trigger-scanner";
import { buildExcerptPayload, MAX_EXCERPTS, MAX_PAYLOAD_BYTES } from "@/lib/privacy/windowing";
import type { CanonicalMessage } from "@/types/chat";

function msg(id: string, iso: string, sender: "person_a" | "person_b", text: string): CanonicalMessage {
  return {
    id,
    timestamp: iso,
    senderId: sender,
    originalSenderName: sender === "person_a" ? "Alex Morgan" : "Jordan Lee",
    text,
    messageType: "text",
    charCount: text.length,
    wordCount: text.split(/\s+/).length,
    hasQuestion: text.includes("?"),
    emojis: [],
  };
}

describe("trigger scanner (task 04.2)", () => {
  it("detects conflict lexicon", () => {
    const messages = [
      msg("msg_00001", "2025-01-05T09:00:00.000Z", "person_a", "You never listen to me"),
      msg("msg_00002", "2025-01-05T09:05:00.000Z", "person_b", "Let's grab lunch"),
    ];
    const hits = scanTriggers(messages);
    expect(hits.some((h) => h.reason === "conflict_lexicon")).toBe(true);
  });

  it("detects long-delay terse replies", () => {
    const messages = [
      msg("msg_00001", "2025-01-05T09:00:00.000Z", "person_a", "Are we still on for tonight?"),
      msg("msg_00002", "2025-01-06T09:00:00.000Z", "person_b", "ok"),
    ];
    const hits = scanTriggers(messages);
    expect(hits.some((h) => h.reason === "long_delay")).toBe(true);
  });

  it("detects double-text bursts of ≥4", () => {
    const messages = [0, 1, 2, 3, 4].map((i) =>
      msg(`msg_0000${i + 1}`, `2025-01-05T09:0${i}:00.000Z`, "person_a", `ping ${i}`)
    );
    const hits = scanTriggers(messages);
    expect(hits.some((h) => h.reason === "double_text")).toBe(true);
  });

  it("detects emotional disclosure (>50 words + vulnerability)", () => {
    const long =
      "I feel really anxious about how distant we have become lately and I am worried that " +
      "all of my efforts to reconnect are going unnoticed every single day this month " +
      "and I need you to tell me honestly what is happening between us right now " +
      "again and again every day without fail truly please?";
    const messages = [msg("msg_00001", "2025-01-05T09:00:00.000Z", "person_a", long)];
    const hits = scanTriggers(messages);
    expect(hits.some((h) => h.reason === "emotional_disclosure")).toBe(true);
  });

  it("emits chronological monthly anchors", () => {
    const messages = [
      msg("msg_00001", "2025-01-05T09:00:00.000Z", "person_a", "jan hello"),
      msg("msg_00002", "2025-02-05T09:00:00.000Z", "person_b", "feb hello"),
      msg("msg_00003", "2025-03-05T09:00:00.000Z", "person_a", "mar hello"),
    ];
    const hits = scanTriggers(messages).filter((h) => h.reason === "sample");
    expect(hits).toHaveLength(3);
  });
});

describe("windowing + budgets (task 04.3)", () => {
  it("caps excerpts at 25 and scrubs names/phones", () => {
    const raw = readFileSync(
      join(process.cwd(), "tests/fixtures/synthetic/synthetic-high-conflict.txt"),
      "utf-8"
    );
    const { messages, metadata } = runFullPipeline(raw);
    const excerpts = buildExcerptPayload(
      messages,
      metadata.senderA.displayName,
      metadata.senderB.displayName
    );
    expect(excerpts.length).toBeGreaterThan(0);
    expect(excerpts.length).toBeLessThanOrEqual(MAX_EXCERPTS);
    const payload = JSON.stringify(excerpts);
    expect(payload.length).toBeLessThan(MAX_PAYLOAD_BYTES);
    expect(payload).not.toContain("Alex Morgan");
    expect(payload).not.toContain("Jordan Lee");
    // senders pseudonymized
    expect(payload).toMatch(/Person [AB]/);
  });

  it("emits EXCERPTS_READY-shaped payload via pipeline (task 04.4)", () => {
    const raw = readFileSync(
      join(process.cwd(), "tests/fixtures/synthetic/synthetic-balanced-couple.txt"),
      "utf-8"
    );
    const { excerpts, metrics } = runFullPipeline(raw);
    expect(metrics.volume.totalMessages).toBeGreaterThan(0);
    for (const e of excerpts) {
      expect(e.id).toMatch(/^exc_\d{2}$/);
      expect(e.dialogue.length).toBeGreaterThan(0);
      expect(e.dialogue.length).toBeLessThanOrEqual(17); // ±8 window + trigger
    }
  });
});
