/**
 * Integration tests for POST /api/analyze (task 05.4).
 * MOCK_MODE — no Gemini quota consumed, no network egress.
 */
import { describe, expect, it, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { resetRateLimits } from "@/lib/server/rate-limiter";
import { resetMockCache } from "@/lib/server/mock-report";
import { POST as analyzePOST } from "@/app/api/analyze/route";
import { runFullPipeline } from "@/lib/parser/pipeline";
import { readFileSync } from "node:fs";
import { join } from "node:path";

vi.stubEnv("MOCK_MODE", "true");

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function buildAnalyzeBody() {
  const raw = readFileSync(
    join(process.cwd(), "tests/fixtures/synthetic/synthetic-balanced-couple.txt"),
    "utf-8"
  );
  const { metrics, excerpts } = runFullPipeline(raw);
  return {
    relationshipType: "romantic",
    optionalConcern: "I feel like they have become emotionally distant recently.",
    deterministicMetrics: metrics,
    contextExcerpts: excerpts.slice(0, 3),
  };
}

describe("/api/analyze (task 05.4)", () => {
  beforeEach(() => {
    resetRateLimits();
    resetMockCache();
  });

  it("returns the structured mock report in MOCK_MODE", async () => {
    const res = await analyzePOST(makeRequest(buildAnalyzeBody()));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.fingerprint.communication).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(json.signals)).toBe(true);
    expect(Array.isArray(json.patternLoops)).toBe(true);
  });

  it("rejects invalid bodies with 400", async () => {
    const res = await analyzePOST(makeRequest({ nope: true }));
    expect(res.status).toBe(400);
  });

  it("rejects oversized payloads with 400", async () => {
    const body = buildAnalyzeBody() as Record<string, unknown>;
    body.optionalConcern = "x".repeat(5000);
    const res = await analyzePOST(makeRequest(body));
    // Zod max(2000) on optionalConcern → 400
    expect(res.status).toBe(400);
  });

  it("enforces 5/hr/IP rate limiting", async () => {
    const body = buildAnalyzeBody();
    for (let i = 0; i < 5; i++) {
      const r = await analyzePOST(makeRequest(body));
      expect(r.status).toBe(200);
    }
    const limited = await analyzePOST(makeRequest(body));
    expect(limited.status).toBe(429);
  });
});
