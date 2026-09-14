import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { IntelligenceReport } from "@/types/report";

const SYN_DIR = join(process.cwd(), "tests/fixtures/synthetic");

describe("synthetic fixtures (task 01.2)", () => {
  const expected = [
    "synthetic-balanced-couple.txt",
    "synthetic-avoidant-pursuer.txt",
    "synthetic-high-conflict.txt",
    "synthetic-multiline-ios.txt",
    "synthetic-android-24h.txt",
  ];

  it("all five canonical fixtures exist with >200 lines each", () => {
    for (const file of expected) {
      const content = readFileSync(join(SYN_DIR, file), "utf-8");
      const lines = content.split("\n").filter((l) => l.trim().length > 0);
      expect(lines.length, `${file} line count`).toBeGreaterThan(200);
    }
  });

  it("fixtures directory contains no real PII markers", () => {
    const files = readdirSync(SYN_DIR);
    expect(files.length).toBeGreaterThanOrEqual(5);
    // Synthetic names only — guard against accidental real data commits
    for (const file of files) {
      const content = readFileSync(join(SYN_DIR, file), "utf-8");
      expect(content).not.toMatch(/@gmail\.com|@yahoo\.com/i);
    }
  });
});

describe("mock report fixture (task 01.3)", () => {
  it("conforms to canonical report schema", () => {
    const raw = readFileSync(join(process.cwd(), "tests/fixtures/mock-report.json"), "utf-8");
    const report = JSON.parse(raw) as IntelligenceReport;

    // fingerprint: 7 dims 0-100 + summary
    const dims = [
      "communication",
      "emotionalReciprocity",
      "conflictHandling",
      "effortBalance",
      "affection",
      "consistency",
      "boundaries",
    ] as const;
    for (const d of dims) {
      expect(report.fingerprint[d]).toBeGreaterThanOrEqual(0);
      expect(report.fingerprint[d]).toBeLessThanOrEqual(100);
    }
    expect(typeof report.fingerprint.summary).toBe("string");

    // signals
    expect(report.signals.length).toBeGreaterThan(0);
    for (const s of report.signals) {
      expect(["GREEN", "RED", "AMBER"]).toContain(s.type);
      expect(["HIGH", "MODERATE", "LOW", "INSUFFICIENT_EVIDENCE"]).toContain(s.confidence);
      expect(s.evidenceExcerptIds.length).toBeGreaterThan(0);
    }

    // pattern loops + reality checks + wrapped highlights
    expect(report.patternLoops.length).toBeGreaterThan(0);
    expect(report.realityChecks.length).toBeGreaterThan(0);
    for (const rc of report.realityChecks) {
      expect(["SUPPORTED_BY_DATA", "PARTIALLY_SUPPORTED", "DEBUNKED_BY_DATA"]).toContain(rc.verdict);
    }
    expect(report.wrappedHighlights.relationshipVibeTitle.length).toBeGreaterThan(0);
  });
});
