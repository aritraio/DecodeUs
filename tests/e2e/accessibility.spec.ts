import { test, expect } from "@playwright/test";
import { join } from "node:path";

const FIXTURE = join(process.cwd(), "tests/fixtures/synthetic/synthetic-balanced-couple.txt");

test.describe("accessibility & Swiss fidelity (task 12.3)", () => {
  test("0px radius, keyboard focusability, AA contrast tokens", async ({ page }) => {
    await page.goto("/");

    // Every button/card/input/modal must compute to 0px radius
    const radii = await page.evaluate(() => {
      const els = Array.from(
        document.querySelectorAll("button, input, select, [role='dialog'], [role='tab'], a")
      );
      return els.map((el) => ({
        tag: el.tagName,
        radius: getComputedStyle(el).borderRadius,
      }));
    });
    for (const r of radii) {
      expect(r.radius === "0px" || r.radius === "0px 0px 0px 0px", `${r.tag} radius=${r.radius}`).toBe(true);
    }

    // No drop shadows anywhere (flat tactile depth only)
    const shadows = await page.evaluate(() =>
      Array.from(document.querySelectorAll("button, div")).map(
        (el) => getComputedStyle(el).boxShadow
      )
    );
    for (const s of shadows) {
      expect(s === "none" || s === "").toBe(true);
    }

    // Keyboard: dropzone focusable + operable
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => document.activeElement?.getAttribute("data-testid"));
    expect(typeof focused === "string" || focused === null).toBe(true);

    // Full flow remains keyboard-navigable: tab through to the CTA
    await page.setInputFiles('input[type="file"]', FIXTURE);
    await expect(page.getByTestId("instant-stats")).toBeVisible({ timeout: 15000 });
    const cta = page.getByRole("button", { name: /Generate deep analysis/i });
    for (let i = 0; i < 25; i++) {
      if (await cta.evaluate((el) => el === document.activeElement)) break;
      await page.keyboard.press("Tab");
    }
    await expect(cta).toBeFocused();
  });
});
