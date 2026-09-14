/**
 * Gemini client singleton + environment validation.
 * Server-side only — GEMINI_API_KEY must never reach client bundles.
 * Per task 05.1.
 */
import { GoogleGenAI } from "@google/genai";

export const GEMINI_MODEL = "gemini-2.5-flash";

let cached: GoogleGenAI | null = null;

/** True when offline mock mode is explicitly enabled. */
export function isMockMode(): boolean {
  return process.env.MOCK_MODE === "true" || !process.env.GEMINI_API_KEY;
}

/**
 * Return a configured GoogleGenAI instance, or null in mock mode.
 * In development without a key, callers must fall back to the
 * canonical mock fixture instead of throwing.
 */
export function getGeminiClient(): GoogleGenAI | null {
  if (isMockMode()) return null;
  if (!cached) {
    cached = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
  }
  return cached;
}

/** Human-readable boot validation message for logs. */
export function geminiBootStatus(): string {
  if (process.env.MOCK_MODE === "true") {
    return "decodeus: MOCK_MODE=true — serving synthetic fixture, no Gemini quota consumed.";
  }
  if (!process.env.GEMINI_API_KEY) {
    return "decodeus: GEMINI_API_KEY missing — mock fallback enabled. Set GEMINI_API_KEY in .env.local for live inference.";
  }
  return "decodeus: Gemini client configured (gemini-2.5-flash).";
}
