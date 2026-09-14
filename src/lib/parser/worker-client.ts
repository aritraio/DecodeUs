/**
 * Browser Web Worker client for off-thread WhatsApp parsing.
 * Wraps `src/workers/parse.worker.ts` with a promise API + progress callback.
 * Per task 02.4.
 */
import type { CanonicalMessage, ConversationMetadata } from "@/types/chat";
import type { DeterministicMetrics } from "@/types/metrics";
import type { ContextExcerpt } from "@/types/chat";

export type WorkerOutbound =
  | { type: "PARSE_PROGRESS"; progress: number }
  | { type: "PARSE_COMPLETE"; messages: CanonicalMessage[]; metadata: ConversationMetadata }
  | { type: "STATS_READY"; metrics: DeterministicMetrics; metadata: ConversationMetadata }
  | {
      type: "EXCERPTS_READY";
      payload: { excerpts: ContextExcerpt[]; metrics: DeterministicMetrics };
    }
  | { type: "PARSE_ERROR"; error: string; code: string };

export type WorkerInbound = { type: "PARSE_FILE"; fileContent: string };

export interface ParseCallbacks {
  onProgress?: (progress: number) => void;
}

export interface FullParseResult {
  messages: CanonicalMessage[];
  metadata: ConversationMetadata;
  metrics: DeterministicMetrics;
  excerpts: ContextExcerpt[];
}

/**
 * Dispatch file content to the parse worker and resolve with the full
 * pipeline result (messages + stats + excerpts).
 */
export function parseFileViaWorker(
  fileContent: string,
  callbacks: ParseCallbacks = {}
): Promise<FullParseResult> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("@/workers/parse.worker", import.meta.url), {
      type: "module",
    });
    let messages: CanonicalMessage[] | null = null;
    let metadata: ConversationMetadata | null = null;
    let metrics: DeterministicMetrics | null = null;

    worker.onmessage = (event: MessageEvent<WorkerOutbound>) => {
      const msg = event.data;
      if (msg.type === "PARSE_PROGRESS") {
        callbacks.onProgress?.(msg.progress);
      } else if (msg.type === "PARSE_COMPLETE") {
        messages = msg.messages;
        metadata = msg.metadata;
      } else if (msg.type === "STATS_READY") {
        metrics = msg.metrics;
        if (metadata === null) metadata = msg.metadata;
      } else if (msg.type === "EXCERPTS_READY") {
        worker.terminate();
        if (!messages || !metadata || !metrics) {
          reject(new Error("Worker finished without complete pipeline state."));
          return;
        }
        resolve({ messages, metadata, metrics, excerpts: msg.payload.excerpts });
      } else if (msg.type === "PARSE_ERROR") {
        worker.terminate();
        const err = new Error(msg.error) as Error & { code?: string };
        err.code = msg.code;
        reject(err);
      }
    };

    worker.onerror = (e) => {
      worker.terminate();
      reject(new Error(`Parse worker failed: ${e.message}`));
    };

    const inbound: WorkerInbound = { type: "PARSE_FILE", fileContent };
    worker.postMessage(inbound);
  });
}

/**
 * Synchronous in-thread fallback (used in tests and non-Worker runtimes).
 * Runs the exact same pipeline functions the worker executes.
 */
export async function parseFileInline(fileContent: string): Promise<FullParseResult> {
  const { runFullPipeline } = await import("@/lib/parser/pipeline");
  return runFullPipeline(fileContent);
}
