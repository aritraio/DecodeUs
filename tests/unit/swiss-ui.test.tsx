import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SwissCard } from "@/components/ui/swiss-card";
import { SwissButton } from "@/components/ui/swiss-button";
import { SignalBadge } from "@/components/ui/signal-badge";
import { SectionHeader } from "@/components/ui/section-header";
import { SwissHeader } from "@/components/layout/swiss-header";
import { NoiseOverlay } from "@/components/ui/noise-overlay";

describe("Swiss UI kit (tasks 06.1–06.5)", () => {
  it("SwissCard renders index label, variants and patterns", () => {
    const { container, rerender } = render(
      <SwissCard indexLabel="02. EFFORT BALANCE" variant="muted" pattern="grid">
        <span>body</span>
      </SwissCard>
    );
    expect(screen.getByText("02. EFFORT BALANCE")).toBeInTheDocument();
    const root = container.firstChild as HTMLElement;
    expect(root.className).toMatch(/rounded-none/);
    expect(root.className).toMatch(/border-black/);
    expect(root.className).toMatch(/swiss-grid-pattern/);

    rerender(
      <SwissCard variant="alert" pattern="dots">
        <span>alert</span>
      </SwissCard>
    );
    expect((container.firstChild as HTMLElement).className).toMatch(/border-swiss-accent/);
  });

  it("SwissButton exposes three variants and keyboard focus ring", () => {
    const { rerender } = render(<SwissButton variant="primary">Analyze</SwissButton>);
    const btn = screen.getByRole("button", { name: "Analyze" });
    expect(btn.className).toMatch(/bg-black/);
    expect(btn.className).toMatch(/rounded-none/);
    expect(btn.className).toMatch(/focus-visible:ring-swiss-accent/);

    rerender(<SwissButton variant="secondary">Back</SwissButton>);
    expect(screen.getByRole("button", { name: "Back" }).className).toMatch(/bg-white/);

    rerender(<SwissButton variant="accent">Launch</SwissButton>);
    expect(screen.getByRole("button", { name: "Launch" }).className).toMatch(/bg-swiss-accent/);
  });

  it("SignalBadge snapshots all three variants", () => {
    const { container } = render(
      <div>
        <SignalBadge type="green" title="Green signal" occurrences={142} />
        <SignalBadge type="red" title="Critical pattern" occurrences={14} />
        <SignalBadge type="mixed" title="Mixed signal" occurrences={7} />
      </div>
    );
    expect(screen.getByText("Green signal")).toBeInTheDocument();
    expect(screen.getByText("[142× OBSERVED]")).toBeInTheDocument();
    expect(container.innerHTML).toMatch(/bg-swiss-green/);
    expect(container.innerHTML).toMatch(/bg-swiss-accent/);
    expect(container.innerHTML).toMatch(/bg-swiss-amber/);
    // Zero radius everywhere: rounded-none allowed, soft radii forbidden
    expect(container.innerHTML).not.toMatch(/rounded-(sm|md|lg|xl|2xl|full)/);
    expect(container.innerHTML).not.toMatch(/shadow-/);
  });

  it("SectionHeader renders red numeral + title", () => {
    render(<SectionHeader index="01. FINGERPRINT" title="Relationship Fingerprint" meta="7 DIMENSIONS" />);
    expect(screen.getByText("01. FINGERPRINT").className).toMatch(/text-swiss-accent/);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Relationship Fingerprint");
  });

  it("Layout frame exposes privacy pill and noise overlay", () => {
    render(
      <div>
        <SwissHeader />
        <NoiseOverlay />
      </div>
    );
    expect(screen.getByText(/ZERO_KNOWLEDGE: ACTIVE/)).toBeInTheDocument();
    expect(screen.getByText(/DECODEUS/)).toBeInTheDocument();
  });
});
