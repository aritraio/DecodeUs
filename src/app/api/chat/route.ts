/**
 * POST /api/chat — "Ask Your Chat" grounded Q&A.
 * Answers strictly from provided excerpts; abstains when evidence is thin.
 */
import { NextRequest, NextResponse } from "next/server";
import { GEMINI_MODEL, getGeminiClient, isMockMode } from "@/lib/gemini/client";
import { CHAT_SYSTEM_PROMPT, buildChatUserPrompt } from "@/lib/gemini/prompts";
import { withGeminiRetry } from "@/lib/gemini/retry";
import { applyGuardrailFilter } from "@/lib/gemini/guardrail-filter";
import { chatRequestSchema } from "@/lib/server/validation";
import { CHAT_LIMIT, checkRateLimit, getClientIp } from "@/lib/server/rate-limiter";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 30;

const chatAnswerSchema = z.object({
  answer: z.string(),
  confidence: z.enum(["HIGH", "MODERATE", "LOW", "INSUFFICIENT_EVIDENCE"]),
  supportingExcerptIds: z.array(z.string()),
});

const INSUFFICIENT = "Insufficient evidence in the chat history to determine this pattern.";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ip = getClientIp(req.headers);
  const limit = checkRateLimit(`chat:${ip}`, CHAT_LIMIT.max, CHAT_LIMIT.windowMs);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded.", code: "RATE_LIMITED" },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body.", code: "INVALID_JSON" },
      { status: 400 }
    );
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Request validation failed.", code: "VALIDATION_ERROR", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { query, relevantExcerpts } = parsed.data;

  if (relevantExcerpts.length === 0) {
    return NextResponse.json(
      { answer: INSUFFICIENT, confidence: "INSUFFICIENT_EVIDENCE", supportingExcerptIds: [] },
      { status: 200 }
    );
  }

  if (isMockMode()) {
    const ids = relevantExcerpts.slice(0, 3).map((e) => e.id);
    return NextResponse.json(
      {
        answer: `Based on the ${relevantExcerpts.length} most relevant excerpt(s) provided, the chat contains directly related dialogue. Review the cited receipts for the full context. (Mock answer — connect GEMINI_API_KEY for live reasoning.)`,
        confidence: "MODERATE",
        supportingExcerptIds: ids,
      },
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
            parts: [
              {
                text: buildChatUserPrompt({
                  query,
                  relevantExcerpts,
                  conversationMetadata: parsed.data.conversationMetadata,
                }),
              },
            ],
          },
        ],
        config: {
          systemInstruction: CHAT_SYSTEM_PROMPT,
          responseMimeType: "application/json",
        },
      })
    );

    const text = response.text?.trim() ?? "";
    const json = JSON.parse(text);
    const validated = chatAnswerSchema.safeParse(json);
    if (!validated.success) {
      throw new Error("Chat output failed schema validation.");
    }
    const filtered = applyGuardrailFilter(validated.data.answer);
    return NextResponse.json(
      { ...validated.data, answer: filtered.cleanText },
      { status: 200 }
    );
  } catch (err) {
    void err;
    console.error("[api/chat] inference error");
    return NextResponse.json(
      { error: "Question answering failed. Please retry shortly.", code: "INFERENCE_ERROR" },
      { status: 500 }
    );
  }
}
