"use client";

import * as React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import type { RelationshipFingerprint } from "@/types/report";

const DIM_LABELS: Array<{ key: keyof Omit<RelationshipFingerprint, "summary">; label: string }> = [
  { key: "communication", label: "COMM" },
  { key: "emotionalReciprocity", label: "EMOTION" },
  { key: "conflictHandling", label: "CONFLICT" },
  { key: "effortBalance", label: "EFFORT" },
  { key: "affection", label: "AFFECT" },
  { key: "consistency", label: "CONSIST" },
  { key: "boundaries", label: "BOUND" },
];

/**
 * Monochrome + Swiss Red radar for the 7-pillar fingerprint.
 */
export function FingerprintRadar({ fingerprint }: { fingerprint: RelationshipFingerprint }): React.JSX.Element {
  const data = DIM_LABELS.map((d) => ({
    dimension: d.label,
    score: fingerprint[d.key],
    full: 100,
  }));
  return (
    <div className="h-72 w-full rounded-none border-2 border-black bg-white p-2" data-testid="fingerprint-radar">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="75%">
          <PolarGrid stroke="#000000" strokeOpacity={0.25} />
          <PolarAngleAxis dataKey="dimension" tick={{ fill: "#000000", fontSize: 10, fontWeight: 900 }} />
          <Radar dataKey="full" stroke="#E5E5E5" fill="#F2F2F2" fillOpacity={1} />
          <Radar dataKey="score" stroke="#FF3000" fill="#000000" fillOpacity={0.85} strokeWidth={2} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
