/**
 * Mock fixture loader — serves the canonical synthetic report for
 * offline development and Gemini-outage fallback. NEVER real user data.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { IntelligenceReport } from "@/types/report";

let cached: IntelligenceReport | null = null;

export function loadMockReport(): IntelligenceReport {
  if (cached) return cached;
  const raw = readFileSync(join(process.cwd(), "tests/fixtures/mock-report.json"), "utf-8");
  cached = JSON.parse(raw) as IntelligenceReport;
  return cached;
}

/** Test helper — clear the module cache. */
export function resetMockCache(): void {
  cached = null;
}
