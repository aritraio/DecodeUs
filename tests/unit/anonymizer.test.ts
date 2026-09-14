import { describe, expect, it } from "vitest";
import { redactPII } from "@/lib/privacy/anonymizer";

const A = "Alex Morgan";
const B = "Jordan Lee";

describe("PII redaction engine (task 04.1)", () => {
  it("masks international and local phone formats", () => {
    const cases = [
      "Call me at +1-555-123-4567 tomorrow",
      "My number is (555) 123-4567",
      "Reach me on 555.123.4567 please",
      "Dial +44 7700 900123 now",
    ];
    for (const c of cases) {
      const { sanitizedText, redactedCount } = redactPII(c, A, B);
      expect(sanitizedText).toContain("[PHONE_REDACTED]");
      expect(redactedCount).toBeGreaterThan(0);
      expect(sanitizedText).not.toMatch(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/);
    }
  });

  it("masks email addresses", () => {
    const { sanitizedText } = redactPII("Email me at alex.morgan+test@example.com ok?", A, B);
    expect(sanitizedText).toContain("[EMAIL_REDACTED]");
    expect(sanitizedText).not.toContain("example.com");
  });

  it("reduces URLs to hostname or redacted token", () => {
    const { sanitizedText } = redactPII(
      "See https://example.com/reset?token=abc123&user=1 now",
      A,
      B
    );
    expect(sanitizedText).toContain("[LINK: example.com]");
    expect(sanitizedText).not.toContain("token=abc123");
  });

  it("masks 13–16 digit financial strings", () => {
    const { sanitizedText } = redactPII("My card is 4111 1111 1111 1111 do not share", A, B);
    expect(sanitizedText).toContain("[FINANCIAL_REDACTED]");
  });

  it("pseudonymizes full names and first names case-insensitively", () => {
    const { sanitizedText } = redactPII(
      "ALEX MORGAN said hi. Alex, are you there? Jordan-Lee? Jordan lee replied.",
      A,
      B
    );
    expect(sanitizedText).not.toMatch(/alex morgan/i);
    expect(sanitizedText).toContain("Person A");
    expect(sanitizedText).toContain("Person B");
  });

  it("handles names with punctuation safely", () => {
    const { sanitizedText } = redactPII("O'Brien called today", "O'Brien", B);
    expect(sanitizedText).toContain("Person A");
  });

  it("leaves clean text untouched with zero redactions", () => {
    const { sanitizedText, redactedCount } = redactPII(
      "Are we still meeting at 4? Hope your day is smooth.",
      A,
      B
    );
    expect(redactedCount).toBe(0);
    expect(sanitizedText).toBe("Are we still meeting at 4? Hope your day is smooth.");
  });
});
