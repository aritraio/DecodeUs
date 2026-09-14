/**
 * Integration tests for POST /api/chat (task 05.5).
 * MOCK_MODE — no Gemini quota consumed.
 */
import { describe, expect, it, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { resetRateLimits } from "@/lib/server/rate-limiter";
import { POST as chatPOST } from "@/app/api/chat/route";
import { runFullPipeline } from "@/lib/parser/pipeline";
import { readFileSync } from "node:fs";
import { join } from "node:path";

vi.stubEnv("MOCK_MODE", "true");

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("/api/chat (task 05.5)", () => {
  beforeEach(() => {
    resetRateLimits();
  });

  it("answers from excerpts with citations in MOCK_MODE", async () => {
    const raw = readFileSync(
      join(process.cwd(), "tests/fixtures/synthetic/synthetic-balanced-couple.txt"),
      "utf-8"
    );
    const { excerpts } = runFullPipeline(raw);
    const res = await chatPOST(
      makeRequest({
        query: "Who usually apologizes first after an argument?",
        relevantExcerpts: excerpts.slice(0, 2),
        conversationMetadata: { totalDays: 60, totalMessages: 261 },
      })
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(typeof json.answer).toBe("string");
    expect(Array.isArray(json.supportingExcerptIds)).toBe(true);
  });

  it("abstains with INSUFFICIENT_EVIDENCE when no excerpts match", async () => {
    const res = await chatPOST(
      makeRequest({
        query: "Who apologizes first?",
        relevantExcerpts: [],
        conversationMetadata: { totalDays: 60, totalMessages: 10 },
      })
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.answer).toMatch(/insufficient evidence/i);
    expect(json.confidence).toBe("INSUFFICIENT_EVIDENCE");
  });

  it("rejects empty queries with 400", async () => {
    const res = await chatPOST(
      makeRequest({
        query: "",
        relevantExcerpts: [],
        conversationMetadata: {},
      })
    );
    expect(res.status).toBe(400);
  });
});
