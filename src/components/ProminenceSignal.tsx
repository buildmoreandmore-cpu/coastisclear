"use client";

interface ProminenceSignalProps {
  originalTimingStart: string;
  originalTimingEnd: string;
  newTimingStart: string;
  newTimingEnd: string;
  signal: "high" | "moderate" | "low";
  description: string;
  originalDuration: number;
  newDuration: number;
  prominence: number;
}

export default function ProminenceSignal({
  originalTimingStart,
  originalTimingEnd,
  newTimingStart,
  newTimingEnd,
  signal,
  description,
  originalDuration,
  newDuration,
  prominence,
}: ProminenceSignalProps) {
  const signalColor =
    signal === "high"
      ? "var(--danger)"
      : signal === "moderate"
        ? "var(--warning)"
        : "var(--success)";

  return (
    <div
      className="animate-fade-in-up bg-[var(--surface)] border rounded-xl p-6 w-full"
      style={{ borderColor: `${signalColor}33` }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span style={{ color: signalColor }} className="text-lg">
          &#9889;
        </span>
        <h3
          className="font-display font-bold text-sm uppercase tracking-widest"
          style={{ color: signalColor }}
        >
          Usage Signal
        </h3>
      </div>

      <div className="space-y-2 font-mono text-sm">
        <div className="flex gap-4">
          <span className="text-[var(--text-dim)] w-24 shrink-0 text-right">
            Original
          </span>
          <span className="text-[var(--text)]">
            {originalTimingStart} – {originalTimingEnd} ({originalDuration}s
            sampled)
          </span>
        </div>
        <div className="flex gap-4">
          <span className="text-[var(--text-dim)] w-24 shrink-0 text-right">
            New track
          </span>
          <span className="text-[var(--text)]">
            {newTimingStart} – {newTimingEnd} ({newDuration}s featured)
          </span>
        </div>
        <div className="flex gap-4">
          <span className="text-[var(--text-dim)] w-24 shrink-0 text-right">
            Prominence
          </span>
          <span className="text-[var(--text)]">
            ~{Math.round(prominence * 100)}% of new composition
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[var(--border)]">
        <p className="font-mono text-sm" style={{ color: signalColor }}>
          {signal === "high" ? "High" : signal === "moderate" ? "Moderate" : "Low"}{" "}
          use detected. {description}
        </p>
      </div>
    </div>
  );
}
