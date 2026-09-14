import * as React from "react";

/**
 * Fixed full-viewport archival paper noise overlay.
 * Purely decorative (aria-hidden) — pointer events disabled.
 */
export function NoiseOverlay(): React.JSX.Element {
  return <div aria-hidden="true" className="swiss-noise" />;
}
