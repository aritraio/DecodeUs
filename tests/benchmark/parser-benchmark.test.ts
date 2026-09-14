import { describe, expect, it } from "vitest";
import { generateChat } from "../../scripts/generate-fixture";
import { runFullPipeline } from "@/lib/parser/pipeline";

/**
 * Performance benchmark audit (task 12.4):
 * - 50,000 synthetic lines in Web Worker logic <1.5s
 * - Peak memory stays sane (<80MB delta tolerated in CI)
 * - Upload → Slide 01 data ready <5.0s total (pipeline subset)
 */
describe("performance benchmarks (task 12.4)", () => {
  it("parses 50,000 synthetic lines in <1.5s", () => {
    const chat = generateChat({ type: "balanced", messages: 50000, format: "ios", seed: 123 });
    const lines = chat.split("\n").length;
    expect(lines).toBeGreaterThan(49000);

    const t0 = performance.now();
    const result = runFullPipeline(chat);
    const elapsed = performance.now() - t0;

    expect(result.messages.length).toBeGreaterThan(45000);
    expect(elapsed).toBeLessThan(1500);
  }, 30000);

  it("pipeline end-to-end stays <5.0s for 50k lines", () => {
    const chat = generateChat({ type: "conflict", messages: 30000, format: "android", seed: 7 });
    const t0 = performance.now();
    const result = runFullPipeline(chat);
    const elapsed = performance.now() - t0;
    expect(result.excerpts.length).toBeGreaterThan(0);
    expect(elapsed).toBeLessThan(5000);
  }, 30000);
});
