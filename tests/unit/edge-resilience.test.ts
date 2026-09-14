import { describe, expect, it, vi } from "vitest";
import {
  assessParseability,
  assessParserError,
  assessSkew,
} from "@/lib/parser/error-handler";
import { ParserError } from "@/lib/parser/participant-detector";
import { withGeminiRetry, isRetryableGeminiError } from "@/lib/gemini/retry";
import type { CanonicalMessage } from "@/types/chat";

function msg(sender: "person_a" | "person_b"): CanonicalMessage {
  return {
    id: "msg_00001",
    timestamp: "2025-01-05T09:00:00.000Z",
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

describe("ingestion edge cases (task 11.1)", () => {
  it("blocks binary / non-WhatsApp files", () => {
    const r = assessParseability(0, 120);
    expect(r.kind).toBe("blocked");
    expect(r.banner).toMatch(/Unsupported file format/);
  });

  it("maps single-participant errors to the exact required copy", () => {
    const r = assessParserError(
      new ParserError("SINGLE_PARTICIPANT_DETECTED", "x")
    );
    expect(r.banner).toBe(
      "Only 1 participant detected. DecodeUs requires a two-person conversation."
    );
  });

  it("warns (not blocks) on >95% skew", () => {
    const messages = [...Array(96).fill(null).map(() => msg("person_a")), ...Array(4).fill(null).map(() => msg("person_b"))];
    const r = assessSkew(messages);
    expect(r.kind).toBe("warning");
    expect(r.banner).toMatch(/Highly unbalanced/);
  });

  it("passes balanced chats cleanly", () => {
    const messages = [msg("person_a"), msg("person_b")];
    expect(assessSkew(messages).kind).toBe("ok");
  });
});

describe("gemini retry with exponential backoff (task 11.2)", () => {
  it("retries 429s with 1s/2s/4s delays then succeeds", async () => {
    const sleeps: number[] = [];
    let calls = 0;
    const result = await withGeminiRetry(
      async () => {
        calls++;
        if (calls < 3) {
          throw Object.assign(new Error("429 rate limit"), { status: 429 });
        }
        return "ok";
      },
      { sleep: async (ms) => void sleeps.push(ms) }
    );
    expect(result).toBe("ok");
    expect(sleeps).toEqual([1000, 2000]);
  });

  it("throws immediately on non-retryable errors", async () => {
    const fn = vi.fn(async () => {
      throw new Error("validation boom");
    });
    await expect(withGeminiRetry(fn, { sleep: async () => {} })).rejects.toThrow("validation boom");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("classifies retryable errors correctly", () => {
    expect(isRetryableGeminiError({ status: 429 })).toBe(true);
    expect(isRetryableGeminiError({ status: 503 })).toBe(true);
    expect(isRetryableGeminiError(new Error("overloaded"))).toBe(true);
    expect(isRetryableGeminiError(new Error("bad request"))).toBe(false);
  });
});
