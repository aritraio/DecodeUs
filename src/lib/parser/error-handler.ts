/**
 * Ingestion edge-case handlers (task 11.1, workflow.md §3).
 * Centralizes corrupt/single-participant/skew/date-format handling
 * so the dropzone, worker, and pipeline share one policy.
 */
import { ParserError } from "@/lib/parser/participant-detector";
import type { CanonicalMessage } from "@/types/chat";

export interface EdgeAssessment {
  kind: "ok" | "blocked" | "warning";
  banner: string | null;
  code: string | null;
}

/** Non-WhatsApp / binary detection: no parseable headers at all. */
export function assessParseability(headerCount: number, totalLines: number): EdgeAssessment {
  if (totalLines === 0) {
    return {
      kind: "blocked",
      banner: "Unsupported file format. Please upload a WhatsApp .txt chat export.",
      code: "EMPTY_CHAT",
    };
  }
  if (headerCount === 0) {
    return {
      kind: "blocked",
      banner: "Unsupported file format. Please upload a WhatsApp .txt chat export.",
      code: "UNPARSEABLE_CHAT",
    };
  }
  return { kind: "ok", banner: null, code: null };
}

/** Map ParserError codes to user-facing banners. */
export function assessParserError(err: unknown): EdgeAssessment {
  if (err instanceof ParserError) {
    if (err.code === "SINGLE_PARTICIPANT_DETECTED") {
      return {
        kind: "blocked",
        banner: "Only 1 participant detected. DecodeUs requires a two-person conversation.",
        code: err.code,
      };
    }
    if (err.code === "GROUP_CHAT_UNSUPPORTED") {
      return {
        kind: "blocked",
        banner: "Group chat detected. DecodeUs supports two-person conversations only.",
        code: err.code,
      };
    }
    return {
      kind: "blocked",
      banner: "Unsupported file format. Please upload a WhatsApp .txt chat export.",
      code: err.code,
    };
  }
  return {
    kind: "blocked",
    banner: "Parsing failed. Please verify the file is a WhatsApp .txt export.",
    code: "PARSE_FAILED",
  };
}

/**
 * Extreme skew check (>95% from one participant): continue with a
 * bilateral-evidence warning banner.
 */
export function assessSkew(messages: CanonicalMessage[]): EdgeAssessment {
  const human = messages.filter((m) => m.senderId !== "system");
  if (human.length === 0) {
    return { kind: "blocked", banner: "No human messages found in this export.", code: "EMPTY_CHAT" };
  }
  const a = human.filter((m) => m.senderId === "person_a").length;
  const share = Math.max(a, human.length - a) / human.length;
  if (share > 0.95) {
    return {
      kind: "warning",
      banner:
        "Highly unbalanced conversation sample. Certain reciprocity metrics will indicate insufficient bilateral evidence.",
      code: "EXTREME_SKEW",
    };
  }
  return { kind: "ok", banner: null, code: null };
}
