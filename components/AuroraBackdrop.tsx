"use client";

/** Aurora + vignette + grain — camada atmosférica leve (sem partículas 2D). */
export default function AuroraBackdrop() {
  return (
    <div
      aria-hidden
      className="aurora-backdrop pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="frozen-bg absolute inset-0" />
      <div className="frozen-aurora absolute inset-0" />
      <div className="frozen-aurora frozen-aurora--alt absolute inset-0" />
      <div className="frozen-vignette absolute inset-0" />
      <div className="frozen-grain absolute inset-0" />
    </div>
  );
}
