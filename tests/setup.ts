import "@testing-library/jest-dom/vitest";

// Mock Web Worker for Node/jsdom test environment.
// Real Worker logic is tested via direct function imports.
class MockWorker {
  onmessage: ((e: MessageEvent) => void) | null = null;
  postMessage(_msg: unknown): void {}
  terminate(): void {}
}

if (!(globalThis as Record<string, unknown>).Worker) {
  (globalThis as Record<string, unknown>).Worker = MockWorker;
}

// Minimal ResizeObserver polyfill for chart components (recharts) under jsdom.
if (typeof (globalThis as Record<string, unknown>).ResizeObserver === "undefined") {
  class RO {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }
  (globalThis as Record<string, unknown>).ResizeObserver = RO;
}
