/**
 * Exponential-backoff retry for Gemini API calls (task 11.2 shared helper).
 * Retries HTTP 429 / 503 with 1s → 2s → 4s delays.
 */

export interface RetryOptions {
  maxAttempts?: number;
  baseDelayMs?: number;
  retryableStatuses?: number[];
  sleep?: (ms: number) => Promise<void>;
}

const defaultSleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function isRetryableGeminiError(err: unknown): boolean {
  const e = err as { status?: number; code?: number; message?: string };
  const status = e?.status ?? e?.code;
  if (status === 429 || status === 503) return true;
  const msg = (e?.message ?? "").toLowerCase();
  return (
    msg.includes("429") ||
    msg.includes("rate limit") ||
    msg.includes("overloaded") ||
    msg.includes("503") ||
    msg.includes("unavailable")
  );
}

/** Execute fn with exponential backoff. Rethrows the last error when exhausted. */
export async function withGeminiRetry<T>(
  fn: () => Promise<T>,
  opts: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 4,
    baseDelayMs = 1000,
    sleep = defaultSleep,
  } = opts;
  let lastError: unknown = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === maxAttempts || !isRetryableGeminiError(err)) throw err;
      await sleep(baseDelayMs * 2 ** (attempt - 1));
    }
  }
  throw lastError;
}
