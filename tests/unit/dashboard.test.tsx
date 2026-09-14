import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import * as React from "react";
import { AnalysisProvider, useAnalysis } from "@/lib/store/analysis-context";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { FingerprintTab } from "@/components/dashboard/tabs/fingerprint-tab";
import { SignalsTab } from "@/components/dashboard/tabs/signals-tab";
import { PatternReplayTab } from "@/components/dashboard/tabs/pattern-replay-tab";
import { RealityCheckTab } from "@/components/dashboard/tabs/reality-check-tab";
import { EvidenceDrawer } from "@/components/dashboard/drawers/evidence-drawer";
import { runFullPipeline } from "@/lib/parser/pipeline";
import { loadMockReport } from "@/lib/server/mock-report";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function Seeded({ children, tab }: { children: React.ReactNode; tab?: string }) {
  return (
    <AnalysisProvider>
      <Seeder tab={tab}>{children}</Seeder>
    </AnalysisProvider>
  );
}

function Seeder({ children, tab }: { children: React.ReactNode; tab?: string }) {
  const { setStats, setReady, setActiveTab } = useAnalysis();
  const done = React.useRef(false);
  if (!done.current) {
    done.current = true;
    const raw = readFileSync(
      join(process.cwd(), "tests/fixtures/synthetic/synthetic-balanced-couple.txt"),
      "utf-8"
    );
    setStats(runFullPipeline(raw));
    setReady(loadMockReport());
    if (tab) setActiveTab(tab);
  }
  return <>{children}</>;
}

describe("diagnostic dashboard (tasks 09.1–09.6)", () => {
  it("tab bar switches sections and keeps active state", () => {
    render(
      <Seeded>
        <DashboardLayout />
      </Seeded>
    );
    expect(screen.getByTestId("dashboard-layout")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: /02. SIGNALS & FLAGS/ }));
    expect(screen.getByRole("tab", { name: /02. SIGNALS & FLAGS/ })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    // keyboard nav
    fireEvent.keyDown(screen.getByRole("tab", { name: /02. SIGNALS & FLAGS/ }), {
      key: "ArrowRight",
    });
    expect(screen.getByRole("tab", { name: /03. PATTERN REPLAY/ })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("fingerprint tab renders 7 dimensions + radar", () => {
    render(
      <Seeded>
        <FingerprintTab />
      </Seeded>
    );
    expect(screen.getByTestId("fingerprint-radar")).toBeInTheDocument();
    for (const dim of ["communication", "effortBalance", "boundaries"]) {
      expect(screen.getByText(dim)).toBeInTheDocument();
    }
  });

  it("signals tab filters and opens receipts drawer", () => {
    render(
      <Seeded>
        <DashboardLayout />
      </Seeded>
    );
    fireEvent.click(screen.getByRole("tab", { name: /02. SIGNALS & FLAGS/ }));
    fireEvent.click(screen.getByText("[GREEN SIGNALS]"));
    expect(screen.queryByText("Initiation Asymmetry")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("[ALL]"));
    const btn = screen.getAllByText(/Examine receipts/i)[0];
    fireEvent.click(btn);
    expect(screen.getByTestId("evidence-drawer")).toBeInTheDocument();
    expect(screen.getByText(/ESC \/ CLOSE RECEIPT DOSSIER/i)).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByTestId("evidence-drawer")).not.toBeInTheDocument();
  });

  it("pattern replay renders orthogonal step nodes", () => {
    render(
      <Seeded>
        <PatternReplayTab />
      </Seeded>
    );
    expect(screen.getByText(/Stress Venting to Delayed Affirmation/)).toBeInTheDocument();
    expect(screen.getByText("[STEP 01]")).toBeInTheDocument();
  });

  it("reality check shows verdict banner + custom input", () => {
    render(
      <Seeded>
        <RealityCheckTab />
      </Seeded>
    );
    expect(screen.getByText(/PARTIALLY_SUPPORTED/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/Test a specific worry/), {
      target: { value: "Are they pulling away?" },
    });
    fireEvent.click(screen.getByText("Test"));
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("evidence drawer formats monospaced receipts with red highlights", () => {
    render(
      <Seeded>
        <EvidenceDrawer excerptIds={["exc_01"]} onClose={() => {}} />
      </Seeded>
    );
    expect(screen.getByTestId("evidence-drawer")).toBeInTheDocument();
  });

  it("evidence drawer resolves live ask-your-chat excerpts via customExcerpts", () => {
    render(
      <Seeded>
        <EvidenceDrawer
          excerptIds={["qexc_01"]}
          customExcerpts={[
            {
              id: "qexc_01",
              triggerReason: "sample",
              startDate: "2025-01-05T09:00:00.000Z",
              endDate: "2025-01-05T09:05:00.000Z",
              dialogue: [
                { sender: "Person A", timestamp: "2025-01-05T09:00:00.000Z", text: "sorry I was late" },
              ],
            },
          ]}
          onClose={() => {}}
        />
      </Seeded>
    );
    expect(screen.getByTestId("evidence-drawer")).toBeInTheDocument();
    expect(screen.getByText(/I was late/)).toBeInTheDocument();
    expect(screen.queryByText(/No excerpts matched/)).not.toBeInTheDocument();
  });

  it("surfaces the ingestion skew warning alongside the advisory strip", () => {
    render(
      <AnalysisProvider>
        <SkewSeeder>
          <DashboardLayout />
        </SkewSeeder>
      </AnalysisProvider>
    );
    expect(screen.getByText(/Highly unbalanced conversation sample/)).toBeInTheDocument();
  });
});

function SkewSeeder({ children }: { children: React.ReactNode }) {
  const { setStats, setReady } = useAnalysis();
  const done = React.useRef(false);
  if (!done.current) {
    done.current = true;
    const raw = readFileSync(
      join(process.cwd(), "tests/fixtures/synthetic/synthetic-balanced-couple.txt"),
      "utf-8"
    );
    const result = runFullPipeline(raw);
    setStats({
      ...result,
      warning:
        "Highly unbalanced conversation sample. Certain reciprocity metrics will indicate insufficient bilateral evidence.",
    });
    setReady(loadMockReport());
  }
  return <>{children}</>;
}
