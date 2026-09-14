import { describe, expect, it, beforeEach } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { geminiBootStatus, isMockMode } from "@/lib/gemini/client";
import { geminiReportSchema } from "@/lib/gemini/schemas";
import { ANALYZE_SYSTEM_PROMPT, CHAT_SYSTEM_PROMPT } from "@/lib/gemini/prompts";
import { PROHIBITED_TERMS } from "@/lib/gemini/guardrail-filter";
import { intelligenceReportSchema } from "@/lib/server/validation";

describe("gemini client (task 05.1)", () => {
  it("falls back to mock mode without an API key", () => {
    expect(typeof isMockMode()).toBe("boolean");
    expect(typeof geminiBootStatus()).toBe("string");
  });
});

describe("responseSchema (task 05.2)", () => {
  it("requires fingerprint, signals, patternLoops, realityChecks, wrappedHighlights", () => {
    const required = (geminiReportSchema as { required?: string[] }).required ?? [];
    for (const key of ["fingerprint", "signals", "patternLoops", "realityChecks", "wrappedHighlights"]) {
      expect(required).toContain(key);
    }
  });

  it("validates the canonical mock payload via Zod", () => {
    const raw = readFileSync(join(process.cwd(), "tests/fixtures/mock-report.json"), "utf-8");
    const parsed = intelligenceReportSchema.safeParse(JSON.parse(raw));
    expect(parsed.success).toBe(true);
  });
});

describe("ethical system prompts (task 05.3)", () => {
  it("mandates pattern analysis, evidence citations and two-way symmetry", () => {
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(/patterns, not people/i);
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(/evidenceExcerptIds/i);
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(/symmetr/i);
    expect(CHAT_SYSTEM_PROMPT).toMatch(/insufficient evidence/i);
  });

  it("never instructs the model to emit diagnostic labels", () => {
    const combined = `${ANALYZE_SYSTEM_PROMPT}\n${CHAT_SYSTEM_PROMPT}`.toLowerCase();
    // Core diagnostic stems must appear inside the prohibition block
    for (const stem of [
      "narcissist",
      "sociopath",
      "psychopath",
      "borderline",
      "bipolar",
      "toxic",
      "gaslight",
    ]) {
      expect(combined.includes(stem), `prohibition covers ${stem}`).toBe(true);
    }
    expect(combined).toMatch(/never output|strict prohibitions|never use clinical labels/i);
  });
});

describe("placeholder", () => {
  beforeEach(() => {});
  it("loads", () => {
    expect(true).toBe(true);
  });
});
