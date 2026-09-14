import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AnalysisProvider } from "@/lib/store/analysis-context";
import { WrappedContainer } from "@/components/wrapped/wrapped-container";
import { Slide01Volume } from "@/components/wrapped/slides/slide-01-volume";
import { Slide02Initiative } from "@/components/wrapped/slides/slide-02-initiative";
import { Slide03Rhythm } from "@/components/wrapped/slides/slide-03-rhythm";
import { Slide04Lexicon } from "@/components/wrapped/slides/slide-04-lexicon";
import { runFullPipeline } from "@/lib/parser/pipeline";
import { loadMockReport } from "@/lib/server/mock-report";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as React from "react";
import { AnalysisProvider as P, useAnalysis } from "@/lib/store/analysis-context";

function SeededProvider({ children }: { children: React.ReactNode }) {
  return (
    <P>
      <Seeder>{children}</Seeder>
    </P>
  );
}

function Seeder({ children }: { children: React.ReactNode }) {
  const { setStats, setReady } = useAnalysis();
  const done = React.useRef(false);
  if (!done.current) {
    done.current = true;
    const raw = readFileSync(
      join(process.cwd(), "tests/fixtures/synthetic/synthetic-balanced-couple.txt"),
      "utf-8"
    );
    const result = runFullPipeline(raw);
    setStats(result);
    setReady(loadMockReport());
  }
  return <>{children}</>;
}

describe("wrapped story mode (tasks 08.1–08.7)", () => {
  it("navigates slides via buttons, tap zones and keyboard", () => {
    render(
      <SeededProvider>
        <WrappedContainer />
      </SeededProvider>
    );
    expect(screen.getByTestId("wrapped-container")).toBeInTheDocument();
    expect(screen.getByTestId("wrapped-slide")).toHaveAttribute("data-slide", "0");

    fireEvent.click(screen.getByTestId("wrapped-next-zone"));
    expect(screen.getByTestId("wrapped-slide")).toHaveAttribute("data-slide", "1");

    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(screen.getByTestId("wrapped-slide")).toHaveAttribute("data-slide", "2");

    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(screen.getByTestId("wrapped-slide")).toHaveAttribute("data-slide", "1");

    fireEvent.click(screen.getByTestId("wrapped-prev-zone"));
    expect(screen.getByTestId("wrapped-slide")).toHaveAttribute("data-slide", "0");
    expect(screen.getByTestId("progress-active")).toBeInTheDocument();
  });

  it("slide 01 shows massive volume metric", () => {
    const raw = readFileSync(
      join(process.cwd(), "tests/fixtures/synthetic/synthetic-balanced-couple.txt"),
      "utf-8"
    );
    const { metrics, metadata } = runFullPipeline(raw);
    render(
      <AnalysisProvider>
        <Slide01Volume metrics={metrics} metadata={metadata} />
      </AnalysisProvider>
    );
    expect(screen.getByText(String(metrics.volume.totalMessages))).toBeInTheDocument();
  });

  it("slide 02 handles balanced and skewed splits", () => {
    const raw = readFileSync(
      join(process.cwd(), "tests/fixtures/synthetic/synthetic-balanced-couple.txt"),
      "utf-8"
    );
    const { metrics, metadata } = runFullPipeline(raw);
    const { unmount } = render(
      <AnalysisProvider>
        <Slide02Initiative metrics={metrics} metadata={metadata} />
      </AnalysisProvider>
    );
    expect(screen.getByText(/conversation starts/i)).toBeInTheDocument();
    unmount();

    // skewed 80/20 synthetic
    const skewed = {
      ...metrics,
      initiation: {
        ...metrics.initiation,
        personA: { count: 80, percentage: 0.8 },
        personB: { count: 20, percentage: 0.2 },
      },
    };
    render(
      <AnalysisProvider>
        <Slide02Initiative metrics={skewed} metadata={metadata} />
      </AnalysisProvider>
    );
    expect(screen.getByText("80%")).toBeInTheDocument();
  });

  it("slide 03 maps hourly bars with red peak", () => {
    const raw = readFileSync(
      join(process.cwd(), "tests/fixtures/synthetic/synthetic-balanced-couple.txt"),
      "utf-8"
    );
    const { metrics, metadata } = runFullPipeline(raw);
    render(
      <AnalysisProvider>
        <Slide03Rhythm metrics={metrics} metadata={metadata} />
      </AnalysisProvider>
    );
    expect(screen.getByTestId("peak-bar").className).toMatch(/bg-swiss-accent/);
  });

  it("slide 04 renders emoji grid + counts", () => {
    const raw = readFileSync(
      join(process.cwd(), "tests/fixtures/synthetic/synthetic-balanced-couple.txt"),
      "utf-8"
    );
    const { metrics, metadata } = runFullPipeline(raw);
    render(
      <AnalysisProvider>
        <Slide04Lexicon metrics={metrics} metadata={metadata} />
      </AnalysisProvider>
    );
    expect(screen.getAllByText(/double-texts/i)).toHaveLength(2);
  });
});
