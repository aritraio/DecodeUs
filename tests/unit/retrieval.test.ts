import { describe, expect, it } from "vitest";
import { retrieveRelevantExcerpts, tokenizeQuery } from "@/lib/chat/retrieval";
import type { CanonicalMessage } from "@/types/chat";

function msg(id: string, sender: "person_a" | "person_b", text: string, iso = "2025-01-05T09:00:00.000Z"): CanonicalMessage {
  return {
    id,
    timestamp: iso,
    senderId: sender,
    originalSenderName: "X",
    text,
    messageType: "text",
    charCount: text.length,
    wordCount: text.split(/\s+/).length,
    hasQuestion: text.includes("?"),
    emojis: [],
  };
}

describe("vectorless retrieval (task 10.1)", () => {
  const corpus = [
    msg("msg_00001", "person_a", "I'm sorry for snapping earlier, work was overwhelming."),
    msg("msg_00002", "person_b", "Thanks, I appreciate you saying that."),
    msg("msg_00003", "person_a", "What should we cook tonight?"),
    msg("msg_00004", "person_b", "How about pasta?"),
    msg("msg_00005", "person_a", "You never listen when I explain how I feel."),
  ];

  it("tokenizes questions into keywords with synonym expansion", () => {
    const tokens = tokenizeQuery("Who usually apologizes first after an argument?");
    expect(tokens.length).toBeGreaterThan(2);
    expect(tokens.some((t) => t.includes("apolog") || t.includes("sorry"))).toBe(true);
  });

  it("retrieves apology clusters for apology queries", () => {
    const results = retrieveRelevantExcerpts(corpus, "Who apologizes first?");
    expect(results.length).toBeGreaterThan(0);
    const allText = results.flatMap((r) => r.dialogue.map((d) => d.text)).join(" ");
    expect(allText.toLowerCase()).toMatch(/sorry|apolog/);
    expect(results.length).toBeLessThanOrEqual(5);
  });

  it("returns empty for stopword-only queries", () => {
    expect(retrieveRelevantExcerpts(corpus, "the and or")).toHaveLength(0);
  });

  it("packages segments as ContextExcerpts with pseudonyms", () => {
    const results = retrieveRelevantExcerpts(corpus, "cook tonight pasta");
    expect(results.length).toBeGreaterThan(0);
    for (const r of results) {
      expect(r.id).toMatch(/^qexc_\d{2}$/);
      for (const line of r.dialogue) {
        expect(["Person A", "Person B"]).toContain(line.sender);
      }
    }
  });
});
