import { describe, expect, it } from "vitest";
import { calculateLexical } from "@/lib/metrics/lexical";
import type { CanonicalMessage } from "@/types/chat";

function msg(
  id: string,
  sender: "person_a" | "person_b",
  text: string,
  extra: Partial<CanonicalMessage> = {}
): CanonicalMessage {
  return {
    id,
    timestamp: "2025-01-05T09:00:00.000Z",
    senderId: sender,
    originalSenderName: "X",
    text,
    messageType: "text",
    charCount: text.length,
    wordCount: text.split(/\s+/).length,
    hasQuestion: text.trim().endsWith("?"),
    emojis: [],
    ...extra,
  };
}

describe("lexical effort & bursts (task 03.4)", () => {
  it("counts double-text bursts (≥2 consecutive)", () => {
    const messages = [
      msg("msg_00001", "person_a", "one"),
      msg("msg_00002", "person_a", "two"),
      msg("msg_00003", "person_b", "reply"),
      msg("msg_00004", "person_b", "again"),
      msg("msg_00005", "person_b", "and again"),
    ];
    // fix timestamps for ordering
    messages.forEach((m, i) => {
      m.timestamp = `2025-01-05T09:0${i}:00.000Z`;
    });
    const lex = calculateLexical(messages);
    expect(lex.personA.doubleTextCount).toBe(1);
    expect(lex.personB.doubleTextCount).toBe(1);
  });

  it("counts questions and top emojis", () => {
    const messages = [
      msg("msg_00001", "person_a", "Are you coming?", { hasQuestion: true, emojis: ["❤️"] }),
      msg("msg_00002", "person_a", "What time?", { hasQuestion: true, emojis: ["❤️", "🎉"] }),
      msg("msg_00003", "person_b", "Sure thing", { emojis: ["👍"] }),
    ];
    messages.forEach((m, i) => {
      m.timestamp = `2025-01-05T09:0${i}:00.000Z`;
    });
    const lex = calculateLexical(messages);
    expect(lex.personA.questionsAsked).toBe(2);
    expect(lex.personA.topEmojis[0]).toMatchObject({ emoji: "❤️", count: 2 });
    expect(lex.personB.topEmojis[0]).toMatchObject({ emoji: "👍", count: 1 });
  });

  it("computes average words per message", () => {
    const messages = [msg("msg_00001", "person_a", "one two three four")];
    const lex = calculateLexical(messages);
    expect(lex.personA.avgWordCount).toBe(4);
  });
});
