import { describe, expect, it } from "vitest";
import {
  PROHIBITED_TERMS,
  applyGuardrailFilter,
  sanitizeReport,
} from "@/lib/gemini/guardrail-filter";

describe("ethical guardrail filter (task 11.3)", () => {
  it("covers all seven prohibited verdict families", () => {
    const joined = PROHIBITED_TERMS.join(" ");
    for (const stem of ["narcissist", "sociopath", "psychopath", "borderline", "bipolar", "gaslight", "toxic"]) {
      expect(joined).toContain(stem);
    }
  });

  it("rephrases diagnostic labels into behavioral language", () => {
    const cases: Array<[string, RegExp]> = [
      ["Your partner is a narcissist.", /redirecting conflict/i],
      ["They are deliberately gaslighting you.", /denial of previously stated/i],
      ["This is such a toxic dynamic.", /friction/i],
      ["You are borderline obsessed.", /fluctuation/i],
    ];
    for (const [input, expected] of cases) {
      const r = applyGuardrailFilter(input);
      expect(r.hadViolations).toBe(true);
      expect(r.cleanText).toMatch(expected);
      for (const term of PROHIBITED_TERMS) {
        expect(r.cleanText.toLowerCase()).not.toContain(term);
      }
    }
  });

  it("leaves objective behavioral copy untouched", () => {
    const clean =
      "Repeated pattern of redirecting conflict back toward the other person's shortcomings.";
    const r = applyGuardrailFilter(clean);
    expect(r.hadViolations).toBe(false);
    expect(r.cleanText).toBe(clean);
  });

  it("sanitizes nested report payloads recursively", () => {
    const { report, violations } = sanitizeReport({
      signals: [
        { title: "Narcissist watch", description: "All calm here." },
      ],
    });
    expect(violations.length).toBeGreaterThan(0);
    expect(JSON.stringify(report).toLowerCase()).not.toContain("narcissist");
  });
});
