import { describe, expect, it } from "vitest";
import {
  ANDROID_PATTERN,
  IOS_PATTERN,
  classifyBody,
  matchMessageHeader,
  normalizeToISO,
} from "@/lib/parser/regex-patterns";

describe("regex matchers (task 02.1)", () => {
  const iosCases = [
    "[14/09/2026, 10:14:22] Maya Lin: Are we still meeting at 4?",
    "[14/09/2026, 10:14:22 AM] Maya Lin: Are we still meeting at 4?",
    "[14/09/2026, 10:14 PM] Alex Rivera: Yes, leaving now",
    "[14.09.2026, 10:14:22] Anna Schmidt: Hallo zusammen",
    "[14-09-2026, 09:05:01] John Doe: Morning!",
    "[9/4/2026, 9:05 AM] Sam: single digits",
    "[2026-09-14, 10:14:22] Yuki Tanaka: year first",
    "[12/31/2026, 11:59:59 PM] US Format: late night",
  ];
  const androidCases = [
    "14/09/2026, 10:14 - Alex Rivera: Yes, leaving right now.",
    "14/09/2026, 10:14:22 - Alex Rivera: with seconds",
    "14.09.2026, 22:14 - Anna: 24h dots",
    "14-09-2026, 09:05 - John Doe: dashes",
    "14/09/2026, 10:14 PM - Night Owl: 12h android",
    "05/01/2025, 09:00 - Alex Morgan: encryption notice test",
  ];

  it("matches iOS bracket variations", () => {
    for (const line of iosCases) {
      expect(IOS_PATTERN.test(line), line).toBe(true);
      const h = matchMessageHeader(line);
      expect(h?.format).toBe("ios");
      expect(h?.senderName.length).toBeGreaterThan(0);
    }
  });

  it("matches Android dash variations", () => {
    for (const line of androidCases) {
      expect(ANDROID_PATTERN.test(line), line).toBe(true);
      const h = matchMessageHeader(line);
      expect(h?.format).toBe("android");
    }
  });

  it("rejects continuation lines and junk", () => {
    expect(matchMessageHeader("And a third line to test stitching")).toBeNull();
    expect(matchMessageHeader("")).toBeNull();
    expect(matchMessageHeader("random text without timestamp")).toBeNull();
    expect(matchMessageHeader("[not a date] Someone: hi")).toBeNull();
  });

  it("handles names with spaces", () => {
    const h = matchMessageHeader("[14/09/2026, 10:14:22] Mary Jane Watson Parker: hello there");
    expect(h?.senderName).toBe("Mary Jane Watson Parker");
    expect(h?.body).toBe("hello there");
  });

  it("classifies system / media / deleted messages", () => {
    expect(classifyBody("Messages and calls are end-to-end encrypted. No one outside can read them.")).toBe("system");
    expect(classifyBody("<Media omitted>")).toBe("media_omitted");
    expect(classifyBody("image omitted")).toBe("media_omitted");
    expect(classifyBody("video omitted")).toBe("media_omitted");
    expect(classifyBody("This message was deleted")).toBe("deleted");
    expect(classifyBody("Are we still meeting at 4?")).toBe("text");
  });

  it("normalizes DD/MM, MM/DD and YYYY-MM-DD dates", () => {
    expect(normalizeToISO("14/09/2026", "10:14:22")).toBe("2026-09-14T10:14:22.000Z");
    expect(normalizeToISO("2026-09-14", "10:14:22")).toBe("2026-09-14T10:14:22.000Z");
    // 12h clock
    expect(normalizeToISO("09/14/2026", "10:14 PM")).toBe("2026-09-14T22:14:00.000Z");
    expect(normalizeToISO("09/14/26", "12:05 AM")).toBe("2026-09-14T00:05:00.000Z");
    // invalid
    expect(normalizeToISO("99/99/2026", "10:14")).toBeNull();
    expect(normalizeToISO("14/09/2026", "25:99")).toBeNull();
  });
});
