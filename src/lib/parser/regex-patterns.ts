/**
 * Multi-locale WhatsApp export regex matchers.
 * Handles iOS bracket format, Android dash format, 12h/24h clocks,
 * international date delimiters (/, ., -), and system messages.
 * Per architecture.md §2.1 and task 02.1.
 */

/** iOS: [14/09/2026, 10:14:22 AM] Maya Lin: message */
export const IOS_PATTERN =
  /^\[(\d{1,4}[\/.-]\d{1,2}[\/.-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[APap][Mm])?)\]\s+([^:]+):\s+(.*)$/;

/** Android: 14/09/2026, 10:14 - Alex Rivera: message */
export const ANDROID_PATTERN =
  /^(\d{1,4}[\/.-]\d{1,2}[\/.-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[APap][Mm])?)\s+-\s+([^:]+):\s+(.*)$/;

export interface ParsedHeader {
  datePart: string;
  timePart: string;
  senderName: string;
  body: string;
  format: "ios" | "android";
}

/**
 * Try iOS then Android matchers against a single line.
 * Returns null for continuation lines / system lines without sender.
 */
export function matchMessageHeader(line: string): ParsedHeader | null {
  let m = IOS_PATTERN.exec(line);
  if (m) {
    return {
      datePart: m[1],
      timePart: m[2],
      senderName: m[3].trim(),
      body: m[4],
      format: "ios",
    };
  }
  m = ANDROID_PATTERN.exec(line);
  if (m) {
    return {
      datePart: m[1],
      timePart: m[2],
      senderName: m[3].trim(),
      body: m[4],
      format: "android",
    };
  }
  return null;
}

/** System/metadata message classifiers. */
const MEDIA_PATTERNS = [
  /<\s*media omitted\s*>/i,
  /\bimage omitted\b/i,
  /\bvideo omitted\b/i,
  /\bsticker omitted\b/i,
  /\bgif omitted\b/i,
  /\bdocument omitted\b/i,
  /\baudio omitted\b/i,
];

const DELETED_PATTERNS = [/this message was deleted/i, /message deleted/i, /you deleted this message/i];

const SYSTEM_PATTERNS = [
  /messages and calls are end-to-end encrypted/i,
  /created group/i,
  /added .* to the group/i,
  /removed .* from/i,
  /changed the (group|subject)/i,
  /changed this group's icon/i,
  /you (joined|left|were added)/i,
  /security code changed/i,
];

export type ClassifiedType = "text" | "media_omitted" | "deleted" | "system";

/** Classify a message body into text / media_omitted / deleted / system. */
export function classifyBody(body: string): ClassifiedType {
  const t = body.trim();
  if (SYSTEM_PATTERNS.some((re) => re.test(t))) return "system";
  if (MEDIA_PATTERNS.some((re) => re.test(t))) return "media_omitted";
  if (DELETED_PATTERNS.some((re) => re.test(t))) return "deleted";
  return "text";
}

// ---------------------------------------------------------------------------
// International date normalizer → ISO 8601 UTC
// ---------------------------------------------------------------------------

function splitDate(datePart: string): [string, string, string] | null {
  const parts = datePart.split(/[\/.-]/);
  if (parts.length !== 3) return null;
  return [parts[0].trim(), parts[1].trim(), parts[2].trim()];
}

function parseTime(timePart: string): { hour: number; minute: number; second: number } | null {
  const m = /(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([APap][Mm])?/.exec(timePart.trim());
  if (!m) return null;
  let hour = parseInt(m[1], 10);
  const minute = parseInt(m[2], 10);
  const second = m[3] ? parseInt(m[3], 10) : 0;
  const ampm = m[4]?.toUpperCase();
  if (ampm === "AM" && hour === 12) hour = 0;
  if (ampm === "PM" && hour !== 12) hour += 12;
  if (hour > 23 || minute > 59 || second > 59) return null;
  return { hour, minute, second };
}

/**
 * Normalize international date + time parts into an ISO 8601 UTC string.
 *
 * Heuristics (tried in order):
 *  1. YYYY-MM-DD (first component has 4 digits → year first)
 *  2. DD/MM/YYYY vs MM/DD/YYYY disambiguation: if first > 12 → DD/MM;
 *     if second > 12 → MM/DD; else default DD/MM (WhatsApp majority locale).
 *
 * Returns null when unparseable.
 */
export function normalizeToISO(datePart: string, timePart: string): string | null {
  const split = splitDate(datePart);
  const t = parseTime(timePart);
  if (!split || !t) return null;
  const [p1, p2, p3] = split;

  let year: number;
  let month: number;
  let day: number;

  if (p1.length === 4) {
    // YYYY-MM-DD
    year = parseInt(p1, 10);
    month = parseInt(p2, 10);
    day = parseInt(p3, 10);
  } else {
    year = parseInt(p3, 10);
    if (p3.length === 2) year += year >= 70 ? 1900 : 2000;
    const a = parseInt(p1, 10);
    const b = parseInt(p2, 10);
    if (a > 12 && b <= 12) {
      day = a;
      month = b;
    } else if (b > 12 && a <= 12) {
      month = a;
      day = b;
    } else {
      // Ambiguous — default DD/MM/YYYY (most common WhatsApp locale)
      day = a;
      month = b;
    }
  }

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null;
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  const d = new Date(Date.UTC(year, month - 1, day, t.hour, t.minute, t.second));
  if (Number.isNaN(d.getTime())) return null;
  // Guard against overflow normalization (e.g. Feb 30 → Mar 2)
  if (d.getUTCFullYear() !== year || d.getUTCMonth() !== month - 1 || d.getUTCDate() !== day) {
    return null;
  }
  return d.toISOString();
}
