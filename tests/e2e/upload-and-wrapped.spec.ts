import { test, expect } from "@playwright/test";
import { join } from "node:path";

const FIXTURE = join(process.cwd(), "tests/fixtures/synthetic/synthetic-balanced-couple.txt");

test.describe("upload → wrapped → dashboard (task 12.1)", () => {
  test("full user flow renders stats, story and all dashboard tabs", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto("/");
    await expect(page.getByText(/UNDERSTAND WHAT YOUR RELATIONSHIP/i)).toBeVisible();

    // Upload fixture through the hidden file input
    await page.setInputFiles('input[type="file"]', FIXTURE);

    // Instant stats preview (<1.5s budget asserted loosely at 15s for CI)
    await expect(page.getByTestId("instant-stats")).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/TOTAL MESSAGES/)).toBeVisible();

    // Generate deep analysis (mock mode → instant)
    await page.getByRole("button", { name: /Generate deep analysis/i }).click();

    // Wrapped story opens
    await expect(page.getByTestId("wrapped-container")).toBeVisible({ timeout: 20000 });
    await expect(page.getByTestId("wrapped-slide")).toHaveAttribute("data-slide", "0");

    // Keyboard through all 6 slides
    for (let i = 1; i <= 5; i++) {
      await page.keyboard.press("ArrowRight");
      await expect(page.getByTestId("wrapped-slide")).toHaveAttribute("data-slide", String(i));
    }
    // Step back once
    await page.keyboard.press("ArrowLeft");
    await expect(page.getByTestId("wrapped-slide")).toHaveAttribute("data-slide", "4");
    await page.keyboard.press("ArrowRight");

    // Exit to dashboard via final CTA
    await page.getByRole("button", { name: /Dashboard/i }).click();
    await expect(page.getByTestId("dashboard-layout")).toBeVisible();

    // All 5 tabs render
    for (const tab of ["01. FINGERPRINT", "02. SIGNALS & FLAGS", "03. PATTERN REPLAY", "04. REALITY CHECK", "05. ASK CHAT"]) {
      await page.getByRole("tab", { name: new RegExp(tab.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) }).click();
    }
    await expect(page.getByTestId("ask-chat-terminal")).toBeVisible();

    expect(errors).toEqual([]);
  });
});
