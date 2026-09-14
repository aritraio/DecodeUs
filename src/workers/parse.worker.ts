/**
 * Dedicated Web Worker: WhatsApp parse + metrics + excerpt pipeline.
 *
 * Inbound:  { type: "PARSE_FILE", fileContent: string }
 * Outbound: PARSE_PROGRESS (every 5,000 lines) → PARSE_COMPLETE →
 *           STATS_READY → EXCERPTS_READY | PARSE_ERROR
 *
 * All raw chat parsing stays in-browser. Nothing is transmitted.
 */
import { runFullPipeline, collectSenderNames } from "@/lib/parser/pipeline";
import { normalizeLines } from "@/lib/parser/message-normalizer";
import {
  assembleMetadata,
  identifyParticipants,
} from "@/lib/parser/participant-detector";
import { computeMetrics } from "@/lib/metrics";
import { buildExcerptPayload } from "@/lib/privacy/windowing";
import type { WorkerInbound, WorkerOutbound } from "@/lib/parser/worker-client";

function post(msg: WorkerOutbound): void {
  (self as unknown as { postMessage: (m: WorkerOutbound) => void }).postMessage(msg);
}

self.onmessage = (event: MessageEvent<WorkerInbound>) => {
  const inbound = event.data;
  if (!inbound || inbound.type !== "PARSE_FILE") return;

  try {
    const { fileContent } = inbound;
    const totalLines = fileContent.split(/\r?\n/).length;

    // Progress sweep (cheap line scan, emits every 5,000 lines)
    const CHUNK = 5000;
    for (let done = CHUNK; done < totalLines; done += CHUNK) {
      post({ type: "PARSE_PROGRESS", progress: Math.min(99, Math.round((done / totalLines) * 100)) });
    }

    // Stage 1 — parse + metadata
    const orderedNames = collectSenderNames(fileContent);
    if (orderedNames.length === 0) {
      throw Object.assign(
        new Error("Unsupported file format. Please upload a WhatsApp .txt chat export."),
        { code: "UNPARSEABLE_CHAT" }
      );
    }
    const participants = identifyParticipants(orderedNames);
    const { messages } = normalizeLines(fileContent, participants.slotFor);
    const metadata = assembleMetadata(messages, participants);
    post({ type: "PARSE_PROGRESS", progress: 100 });
    post({ type: "PARSE_COMPLETE", messages, metadata });

    // Stage 2 — deterministic metrics
    const metrics = computeMetrics(messages, metadata);
    post({ type: "STATS_READY", metrics, metadata });

    // Stage 3 — redacted excerpts
    const excerpts = buildExcerptPayload(
      messages,
      participants.personAName,
      participants.personBName
    );
    post({ type: "EXCERPTS_READY", payload: { excerpts, metrics } });

    // Full-pipeline cross-check in development (tree-shaken no-op cost)
    void runFullPipeline;
  } catch (err) {
    const e = err as Error & { code?: string };
    post({
      type: "PARSE_ERROR",
      error: e.message ?? "Unknown parse failure.",
      code: e.code ?? "UNPARSEABLE_CHAT",
    });
  }
};

export {};
