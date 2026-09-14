import { test, expect } from "@playwright/test";
import { join } from "node:path";

const FIXTURE = join(process.cwd(), "tests/fixtures/synthetic/synthetic-balanced-couple.txt");

/**
 * Privacy leak audit (task 12.2): intercept every outgoing request during
 * upload + analysis and assert zero unmasked PII reaches /api/analyze,
 * and no third-party egress occurs at all.
 */
test.describe("privacy leak check (task 12.2)", () => {
  test("no raw names, phones, or emails leave the browser", async ({ page }) => {
    const payloads: string[] = [];
    const thirdParty: string[] = [];

    await page.route("**/*", (route) => {
      const url = route.request().url();
      if (url.includes("/api/")) {
        const post = route.request().postData() ?? "";
        payloads.push(post);
      } else if (
        (url.startsWith("http://") || url.startsWith("https://")) &&
        !url.includes("localhost") &&
        !url.includes("127.0.0.1")
      ) {
        // Allow Next dev runtime + fonts; flag anything else
        if (!/fonts\.googleapis|fonts\.gstatic|vercel|nextjs/i.test(url)) {
          thirdParty.push(url);
        }
      }
      return route.continue();
    });

    await page.goto("/");
    await page.setInputFiles('input[type="file"]', FIXTURE);
    await expect(page.getByTestId("instant-stats")).toBeVisible({ timeout: 15000 });
    await page.getByRole("button", { name: /Generate deep analysis/i }).click();
    await expect(page.getByTestId("wrapped-container")).toBeVisible({ timeout: 20000 });

    expect(payloads.length).toBeGreaterThan(0);
    const joined = payloads.join("\n");
    // Original synthetic display names must never appear
    expect(joined).not.toContain("Alex Morgan");
    expect(joined).not.toContain("Jordan Lee");
    // No email addresses
    expect(joined).not.toMatch(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    // No phone-like digit groups with separators (timestamps and decimal
    // statistics are separator-free or colon-delimited, so they cannot match)
    expect(joined).not.toMatch(/\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}/);
    expect(thirdParty).toEqual([]);
  });
});
