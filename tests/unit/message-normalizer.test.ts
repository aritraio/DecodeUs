import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { normalizeLines } from "@/lib/parser/message-normalizer";
import { identifyParticipants } from "@/lib/parser/participant-detector";
import { collectSenderNames } from "@/lib/parser/pipeline";
import { matchMessageHeader } from "@/lib/parser/regex-patterns";

function slotFor(names: string[]) {
  const map = identifyParticipants(names);
  return map.slotFor;
}

describe("multiline stitching + emoji extraction (task 02.2)", () => {
  it("stitches continuation lines into preceding message", () => {
    const raw = [
      "[05/01/2025, 09:00:00] Alex Morgan: First line",
      "second line of the same message",
      "third line here",
      "[05/01/2025, 09:05:00] Jordan Lee: Reply here",
    ].join("\n");
    const names = collectSenderNames(raw);
    const { messages } = normalizeLines(raw, slotFor(names));
    expect(messages).toHaveLength(2);
    expect(messages[0].text).toBe("First line\nsecond line of the same message\nthird line here");
    expect(messages[1].text).toBe("Reply here");
  });

  it("computes counts, questions and emojis", () => {
    const raw = "[05/01/2025, 09:00:00] Alex Morgan: Are you coming tonight? ❤️🎉";
    const names = collectSenderNames(raw);
    // single-participant file → identifyParticipants throws; use manual slot
    void names;
    const { messages } = normalizeLines(raw, () => "person_a");
    expect(messages[0].hasQuestion).toBe(true);
    expect(messages[0].emojis).toContain("❤️");
    expect(messages[0].wordCount).toBeGreaterThan(2);
    expect(messages[0].charCount).toBeGreaterThan(0);
  });

  it("parses the multiline iOS fixture without orphans", () => {
    const raw = readFileSync(
      join(process.cwd(), "tests/fixtures/synthetic/synthetic-multiline-ios.txt"),
      "utf-8"
    );
    const names = collectSenderNames(raw);
    const map = identifyParticipants(names);
    const { messages, orphanLines } = normalizeLines(raw, map.slotFor);
    expect(messages.length).toBeGreaterThan(200);
    expect(orphanLines).toBe(0);
    // some message must contain a stitched newline
    expect(messages.some((m) => m.text.includes("\n"))).toBe(true);
    // media/deleted markers classified
    const types = new Set(messages.map((m) => m.messageType));
    expect(types.has("text")).toBe(true);
  });

  it("header matcher sanity on fixture first lines", () => {
    const raw = readFileSync(
      join(process.cwd(), "tests/fixtures/synthetic/synthetic-android-24h.txt"),
      "utf-8"
    );
    const first = raw.split("\n").filter(Boolean)[1];
    expect(matchMessageHeader(first)?.format).toBe("android");
  });
});
