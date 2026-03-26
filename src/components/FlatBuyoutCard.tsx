"use client";

export default function FlatBuyoutCard() {
  return (
    <div className="animate-fade-in-up bg-[var(--surface)] border border-[var(--success)]/30 rounded-xl p-6 w-full">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[var(--success)] text-lg">&#128176;</span>
        <h3 className="font-display font-bold text-sm uppercase tracking-widest text-[var(--success)]">
          Flat Buyout May Be Available
        </h3>
      </div>

      <p className="font-mono text-sm text-[var(--text-mid)] mb-4 leading-relaxed">
        This rights holder is an independent owner or production library.
        A one-time flat fee may be negotiable — no ongoing royalty split required.
      </p>

      <div className="space-y-3 font-mono text-sm">
        <div className="flex gap-4">
          <span className="text-[var(--text-dim)] w-28 shrink-0 text-right">Typical range</span>
          <span className="text-white">$500 – $5,000</span>
        </div>
        <div className="flex gap-4">
          <span className="text-[var(--text-dim)] w-28 shrink-0 text-right">Coordination</span>
          <span className="text-white">Artist or attorney can reach out directly</span>
        </div>
        <div className="flex gap-4">
          <span className="text-[var(--text-dim)] w-28 shrink-0 text-right">What you save</span>
          <span className="text-white">No % of publishing, no points on master, no intermediary fee</span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-[var(--border)]">
        <p className="font-mono text-xs text-[var(--text-dim)]">
          Rates vary. These are industry benchmarks, not quotes.
        </p>
      </div>
    </div>
  );
}
