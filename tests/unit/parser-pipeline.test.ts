import { describe, expect, it } from "vitest";
import {
  ParserError,
  assembleMetadata,
  identifyParticipants,
} from "@/lib/parser/participant-detector";
import { normalizeLines } from "@/lib/parser/message-normalizer";
import { collectSenderNames, runFullPipeline } from "@/lib/parser/pipeline";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("participant identification (task 02.3)", () => {
  it("assigns person_a to first sender, person_b to second", () => {
    const map = identifyParticipants(["Alex Morgan", "Jordan Lee", "Alex Morgan"]);
    expect(map.personAName).toBe("Alex Morgan");
    expect(map.personBName).toBe("Jordan Lee");
    expect(map.slotFor("Alex Morgan")).toBe("person_a");
    expect(map.slotFor("jordan lee")).toBe("person_b");
  });

  it("throws SINGLE_PARTICIPANT_DETECTED for 1-person chats", () => {
    expect(() => identifyParticipants(["Solo Person", "Solo Person"])).toThrowError(
      expect.objectContaining({ code: "SINGLE_PARTICIPANT_DETECTED" })
    );
  });

  it("throws GROUP_CHAT_UNSUPPORTED for 3+ participants", () => {
    expect(() =>
      identifyParticipants(["A Person", "B Person", "C Person"])
    ).toThrowError(expect.objectContaining({ code: "GROUP_CHAT_UNSUPPORTED" }));
  });

  it("assembles metadata with day counts", () => {
    const raw = [
      "[05/01/2025, 09:00:00] Alex Morgan: hi",
      "[07/01/2025, 09:00:00] Jordan Lee: hello",
    ].join("\n");
    const names = collectSenderNames(raw);
    const map = identifyParticipants(names);
    const { messages } = normalizeLines(raw, map.slotFor);
    const meta = assembleMetadata(messages, map);
    expect(meta.senderA.displayName).toBe("Alex Morgan");
    expect(meta.totalMessages).toBe(2);
    expect(meta.totalDays).toBe(2);
  });

  it("ParserError carries machine-readable codes", () => {
    const e = new ParserError("GROUP_CHAT_UNSUPPORTED", "x");
    expect(e.code).toBe("GROUP_CHAT_UNSUPPORTED");
  });
});

describe("worker pipeline harness (task 02.4)", () => {
  it("runs the full pipeline inline on the balanced fixture", () => {
    const raw = readFileSync(
      join(process.cwd(), "tests/fixtures/synthetic/synthetic-balanced-couple.txt"),
      "utf-8"
    );
    const result = runFullPipeline(raw);
    expect(result.messages.length).toBeGreaterThan(200);
    expect(result.metadata.totalMessages).toBeGreaterThan(200);
    expect(result.metrics.volume.totalMessages).toBeGreaterThan(200);
    expect(result.excerpts.length).toBeGreaterThan(0);
    expect(result.excerpts.length).toBeLessThanOrEqual(25);
  });

  it("surfaces UNPARSEABLE_CHAT for non-WhatsApp files", () => {
    expect(() => runFullPipeline("just some random notes\nno timestamps here\n")).toThrowError(
      expect.objectContaining({ code: "UNPARSEABLE_CHAT" })
    );
  });

  it("surfaces SINGLE_PARTICIPANT_DETECTED for notes-to-self", () => {
    const raw = [
      "[05/01/2025, 09:00:00] Solo Person: note one",
      "[05/01/2025, 09:05:00] Solo Person: note two",
    ].join("\n");
    expect(() => runFullPipeline(raw)).toThrowError(
      expect.objectContaining({ code: "SINGLE_PARTICIPANT_DETECTED" })
    );
  });
});
