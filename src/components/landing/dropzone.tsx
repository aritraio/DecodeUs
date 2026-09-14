"use client";

import * as React from "react";
import { useAnalysis } from "@/lib/store/analysis-context";
import { ErrorBanner, friendlyErrorMessage } from "@/components/landing/error-banner";
import { parseFileInline } from "@/lib/parser/worker-client";
import { assessSkew } from "@/lib/parser/error-handler";

const MAX_FILE_BYTES = 50 * 1024 * 1024;

/**
 * Read an uploaded file as text across runtimes: modern `.text()`,
 * then `.arrayBuffer()`, then legacy FileReader (jsdom/test envs).
 */
async function readFileText(file: File): Promise<string> {
  const f = file as File & {
    text?: () => Promise<string>;
    arrayBuffer?: () => Promise<ArrayBuffer>;
  };
  if (typeof f.text === "function") return f.text();
  if (typeof f.arrayBuffer === "function") {
    return new TextDecoder().decode(await f.arrayBuffer());
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () =>
      reject(reader.error ?? new Error("File read failed."));
    reader.readAsText(file);
  });
}

/**
 * WhatsApp .txt drag-and-drop zone.
 * 4px dashed border + dot matrix; solid black on drag-over.
 * Validates type/size, then dispatches to the parse worker (inline
 * fallback when Workers are unavailable, e.g. tests / SSR).
 */
export function Dropzone(): React.JSX.Element {
  const { setParsing, setStats, setError, setProgress, progress, stage, error, errorCode, reset } =
    useAnalysis();
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = React.useCallback(
    async (file: File) => {
      if (!file.name.toLowerCase().endsWith(".txt")) {
        setError(
          "Unsupported file format. Please upload a WhatsApp .txt chat export.",
          "INVALID_TYPE"
        );
        return;
      }
      if (file.size > MAX_FILE_BYTES) {
        setError("File too large. Maximum 50MB per chat export.", "FILE_TOO_LARGE");
        return;
      }
      setParsing();
      try {
        const text = await readFileText(file);
        // Prefer the real Web Worker; fall back to the identical inline
        // pipeline when Workers are unavailable or fail at runtime
        // (e.g. CSP-blocked workers, tests / SSR).
        let result;
        try {
          if (typeof Worker === "undefined") throw new Error("no-worker");
          const { parseFileViaWorker } = await import("@/lib/parser/worker-client");
          try {
            result = await parseFileViaWorker(text, { onProgress: setProgress });
          } catch {
            result = await parseFileInline(text);
            setProgress(100);
          }
        } catch {
          result = await parseFileInline(text);
          setProgress(100);
        }
        // Extreme single-sender skew (>95%) continues with a bilateral-
        // evidence warning banner instead of blocking ingestion.
        const skew = assessSkew(result.messages);
        setStats({ ...result, warning: skew.kind === "warning" ? skew.banner : null });
      } catch (err) {
        const e = err as Error & { code?: string };
        setError(
          friendlyErrorMessage(e.code ?? null, e.message || "Parsing failed."),
          e.code ?? "PARSE_FAILED"
        );
      }
    },
    [setError, setParsing, setProgress, setStats]
  );

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload WhatsApp chat export (.txt, up to 50MB)"
        data-testid="dropzone"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files?.[0];
          if (f) void handleFile(f);
        }}
        className={`cursor-pointer rounded-none border-4 border-dashed p-12 text-center transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-swiss-accent md:p-20 ${
          dragging
            ? "border-black bg-black text-white"
            : "swiss-dots border-black bg-swiss-muted text-black hover:border-swiss-accent hover:bg-white"
        }`}
      >
        <div
          aria-hidden="true"
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-none border-2 ${
            dragging ? "border-white" : "border-black"
          }`}
        >
          <span className="text-3xl font-black">↑</span>
        </div>
        <p className="mt-4 text-2xl font-black uppercase tracking-tight">
          Drop your WhatsApp .txt export
        </p>
        <p className="mt-2 text-xs uppercase tracking-widest opacity-70">
          .txt only · up to 50MB · 100% parsed in your browser
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".txt"
          aria-hidden="true"
          tabIndex={-1}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
            e.target.value = "";
          }}
        />
      </div>

      {(stage === "parsing") && (
        <div className="mt-4 border-2 border-black bg-white p-4" role="status" aria-label="Parsing progress">
          <div className="flex justify-between font-mono text-[10px] font-black uppercase tracking-widest">
            <span>Parsing locally…</span>
            <span data-testid="parse-progress">{progress}%</span>
          </div>
          <div className="mt-2 h-3 w-full border-2 border-black bg-swiss-muted">
            <div className="h-full bg-swiss-accent transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {stage === "error" && error && (
        <ErrorBanner message={error} code={errorCode} onDismiss={reset} className="mt-4" />
      )}
    </div>
  );
}
