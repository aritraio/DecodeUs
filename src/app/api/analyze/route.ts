/**
 * POST /api/analyze — primary semantic intelligence synthesis.
 * - Zod input validation, 4MB payload cap, 5/hr/IP rate limit.
 * - Gemini 2.5 Flash with strict responseSchema; mock fallback.
 * - Zero persistence: nothing written to disk or database.
 */
import { NextRequest, NextResponse } from "next/server";
import { GEMINI_MODEL, getGeminiClient, isMockMode } from "@/lib/gemini/client";
import { geminiReportSchema } from "@/lib/gemini/schemas";
import { ANALYZE_SYSTEM_PROMPT, buildAnalyzeUserPrompt } from "@/lib/gemini/prompts";
import { withGeminiRetry } from "@/lib/gemini/retry";
import { sanitizeReport } from "@/lib/gemini/guardrail-filter";
import { analyzeRequestSchema, intelligenceReportSchema } from "@/lib/server/validation";
import {
  ANALYZE_LIMIT,
  checkRateLimit,
  getClientIp,
} from "@/lib/server/rate-limiter";
import { loadMockReport } from "@/lib/server/mock-report";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BODY_BYTES = 4 * 1024 * 1024;

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Rate limit first (cheap, before body parsing)
  const ip = getClientIp(req.headers);
  const limit = checkRateLimit(`analyze:${ip}`, ANALYZE_LIMIT.max, ANALYZE_LIMIT.windowMs);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Max 5 analyses per hour.", code: "RATE_LIMITED" },
      { status: 429 }
    );
  }

  const rawText = await req.text();
  if (rawText.length > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "Payload too large. Maximum 4MB.", code: "PAYLOAD_TOO_LARGE" },
      { status: 400 }
    );
  }

  let body: unknown;
  try {
    body = JSON.parse(rawText);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body.", code: "INVALID_JSON" },
      { status: 400 }
    );
  }

  const parsed = analyzeRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Request validation failed.", code: "VALIDATION_ERROR", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Mock mode: deterministic synthetic fixture, no network egress
  if (isMockMode()) {
    const mock = loadMockReport();
    return NextResponse.json(
      { ...mock, _meta: { mock: true, model: "mock-fixture" } },
      { status: 200 }
    );
  }

  try {
    const ai = getGeminiClient();
    if (!ai) throw new Error("Gemini client unavailable.");

    const response = await withGeminiRetry(() =>
      ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [
          {
            role: "user",
            parts: [{ text: buildAnalyzeUserPrompt(parsed.data) }],
          },
        ],
        config: {
          systemInstruction: ANALYZE_SYSTEM_PROMPT,
          responseMimeType: "application/json",
          responseSchema: geminiReportSchema,
        },
      })
    );

    const text = response.text?.trim() ?? "";
    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch {
      throw new Error("Gemini returned non-JSON output.");
    }

    const validated = intelligenceReportSchema.safeParse(json);
    if (!validated.success) {
      throw new Error("Gemini output failed schema validation.");
    }

    // Ethical post-filter: strip any leaked diagnostic verdicts
    const { report } = sanitizeReport(validated.data);
    return NextResponse.json(report, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Inference failed.";
    const rateLimited =
      /429|rate limit|quota/i.test(message);
    if (rateLimited) {
      // Graceful fallback: deterministic mock + advisory note
      const mock = loadMockReport();
      return NextResponse.json(
        {
          ...mock,
          _meta: {
            mock: true,
            advisory: "AI semantic reasoning temporarily busy; showing empirical statistics only.",
          },
        },
        { status: 200 }
      );
    }
    // Never log request bodies — metadata only
    console.error("[api/analyze] inference error");
    return NextResponse.json(
      { error: "Analysis failed. Please retry shortly.", code: "INFERENCE_ERROR" },
      { status: 500 }
    );
  }
}
