"use client";

export default function InterpolationCard() {
  return (
    <div className="animate-fade-in-up bg-[var(--surface)] border border-[var(--warning)]/30 rounded-xl p-6 w-full">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[var(--warning)] text-lg">&#9888;</span>
        <h3 className="font-display font-bold text-sm uppercase tracking-widest text-[var(--warning)]">
          Alternative: Interpolate the Sample
        </h3>
      </div>

      <p className="font-mono text-sm text-[var(--text-mid)] mb-4 leading-relaxed">
        Instead of sampling the original recording, re-record it to sound
        identical. This eliminates master clearance entirely.
      </p>

      <div className="space-y-2 font-mono text-sm">
        <div className="flex items-center gap-2">
          <span className="text-[var(--success)]">&#10003;</span>
          <span className="text-[var(--text)]">Master clearance no longer required</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[var(--success)]">&#10003;</span>
          <span className="text-[var(--text)]">Only publishing (composition) rights must be cleared</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[var(--success)]">&#10003;</span>
          <span className="text-[var(--text)]">Significantly reduces cost and complexity</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[var(--danger)]">&#10007;</span>
          <span className="text-[var(--text-mid)]">Still requires writer / publisher approval</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[var(--danger)]">&#10007;</span>
          <span className="text-[var(--text-mid)]">Get attorney sign-off on the re-recording</span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-[var(--border)]">
        <p className="font-mono text-xs text-[var(--text-dim)]">
          Estimated savings: 40–60% of total clearance cost
        </p>
      </div>
    </div>
  );
}
