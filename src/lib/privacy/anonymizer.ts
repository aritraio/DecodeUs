/**
 * Client-side PII redaction engine (privacy firewall).
 * NOTHING raw may reach /api/analyze without passing through here.
 * Per privacy-security.md §2 and task 04.1.
 */

export interface RedactionResult {
  sanitizedText: string;
  redactedCount: number;
}

const PHONE_REGEX = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
/** Generic international numbers with explicit '+' prefix (e.g. +44 7700 900123). */
const PHONE_INTL_REGEX = /\+\d[\d\s().-]{6,}\d\b/g;
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const URL_REGEX = /https?:\/\/[^\s)]+/g;
// 13–16 digit runs (spaces/dashes allowed) → financial
const FINANCIAL_REGEX = /\b(?:\d[ -]?){13,16}\b/g;
// Street addresses: number + street words + (street|st|avenue|ave|road|rd|lane|ln|drive|dr|boulevard|blvd|court|ct|place|pl|terrace|trail|parkway|circle|cir|way)
const ADDRESS_REGEX =
  /\b\d{1,5}\s+[A-Za-z0-9.'-]{2,}(?:\s+[A-Za-z0-9.'-]{2,}){0,4}\s+(street|st\.?|avenue|ave\.?|road|rd\.?|lane|ln\.?|drive|dr\.?|boulevard|blvd\.?|court|ct\.?|place|pl\.?|terrace|trail|parkway|circle|cir\.?|way)\b[^\n,]*(?:,?\s*[A-Za-z .'-]*\b\d{5}(?:-\d{4})?)?/gi;

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Aggressive client-side redaction. Order: phones → emails → URLs →
 * financial → addresses → participant pseudonyms.
 */
export function redactPII(
  text: string,
  personAName: string,
  personBName: string
): RedactionResult {
  let redactedCount = 0;
  let sanitized = text;

  sanitized = sanitized.replace(PHONE_REGEX, () => {
    redactedCount++;
    return "[PHONE_REDACTED]";
  });

  sanitized = sanitized.replace(PHONE_INTL_REGEX, () => {
    redactedCount++;
    return "[PHONE_REDACTED]";
  });

  sanitized = sanitized.replace(EMAIL_REGEX, () => {
    redactedCount++;
    return "[EMAIL_REDACTED]";
  });

  sanitized = sanitized.replace(URL_REGEX, (url) => {
    redactedCount++;
    try {
      const parsed = new URL(url.replace(/[.,;:!?)]+$/, ""));
      return `[LINK: ${parsed.hostname}]`;
    } catch {
      return "[LINK_REDACTED]";
    }
  });

  sanitized = sanitized.replace(FINANCIAL_REGEX, (m) => {
    const digits = m.replace(/\D/g, "");
    if (digits.length >= 13 && digits.length <= 16) {
      redactedCount++;
      return "[FINANCIAL_REDACTED]";
    }
    return m;
  });

  sanitized = sanitized.replace(ADDRESS_REGEX, () => {
    redactedCount++;
    return "[ADDRESS_REDACTED]";
  });

  // Participant pseudonymization (case-insensitive, whole-word).
  // Also map first-name tokens so "Alex" alone still resolves.
  const names: Array<[string, string]> = [
    [personAName, "Person A"],
    [personBName, "Person B"],
  ];
  for (const [real, pseudo] of names) {
    if (!real || real.trim().length < 2) continue;
    const full = escapeRegExp(real.trim());
    const before = redactedCount;
    sanitized = sanitized.replace(new RegExp(`\\b${full}\\b`, "gi"), pseudo);
    // Count replacements crudely via length delta guard
    if (sanitized.includes(pseudo)) redactedCount += 0; // pseudonym swaps are privacy, not PII-counted
    void before;
    const first = escapeRegExp(real.trim().split(/\s+/)[0]);
    if (first.length >= 2) {
      sanitized = sanitized.replace(new RegExp(`\\b${first}\\b`, "gi"), pseudo);
    }
  }

  return { sanitizedText: sanitized, redactedCount };
}
