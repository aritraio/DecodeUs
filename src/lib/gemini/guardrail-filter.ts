/**
 * Post-processing ethical guardrail filter (task 11.3).
 * Scans Gemini outputs for prohibited psychiatric/diagnostic verdicts and
 * rephrases them into objective behavioral language. Never throws away
 * content silently — replacements preserve sentence structure.
 */

export const PROHIBITED_TERMS = [
  "narcissist",
  "narcissistic",
  "sociopath",
  "sociopathic",
  "psychopath",
  "psychopathic",
  "borderline",
  "bipolar",
  "gaslighter",
  "gaslighting",
  "toxic",
] as const;

/** Objective behavioral substitutes keyed by prohibited term. */
const REPLACEMENTS: Record<string, string> = {
  narcissist: "pattern of redirecting conflict toward the other person's shortcomings",
  narcissistic: "conflict-redirecting",
  sociopath: "pattern of disregarding stated agreements",
  sociopathic: "agreement-disregarding",
  psychopath: "pattern of disregarding stated agreements",
  psychopathic: "agreement-disregarding",
  borderline: "pattern of intense fluctuation in message tone",
  bipolar: "pattern of fluctuation in message tone",
  gaslighter: "pattern of denying previously stated agreements",
  gaslighting: "denial of previously stated agreements",
  toxic: "repeated friction",
};

export interface GuardrailResult {
  cleanText: string;
  violations: string[];
  hadViolations: boolean;
}

/** Scan + rephrase a single text blob. Case-preserving for sentence starts. */
export function applyGuardrailFilter(text: string): GuardrailResult {
  const violations: string[] = [];
  let cleanText = text;
  for (const term of PROHIBITED_TERMS) {
    const re = new RegExp(`\\b${term}\\b`, "gi");
    if (re.test(cleanText)) {
      violations.push(term);
      const replacement = REPLACEMENTS[term] ?? "observed behavioral pattern";
      cleanText = cleanText.replace(new RegExp(`\\b${term}\\b`, "gi"), (m) =>
        /^[A-Z]/.test(m) ? capitalize(replacement) : replacement
      );
    }
  }
  return { cleanText, violations, hadViolations: violations.length > 0 };
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Recursively sanitize every string in a Gemini report payload. */
export function sanitizeReport<T>(report: T): { report: T; violations: string[] } {
  const violations = new Set<string>();
  const walk = (value: unknown): unknown => {
    if (typeof value === "string") {
      const r = applyGuardrailFilter(value);
      r.violations.forEach((v) => violations.add(v));
      return r.cleanText;
    }
    if (Array.isArray(value)) return value.map(walk);
    if (value && typeof value === "object") {
      return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, walk(v)]));
    }
    return value;
  };
  return { report: walk(report) as T, violations: [...violations] };
}
