"use client";

interface RelatedEntityAlertProps {
  distributorName: string;
  holderName: string;
  sharedParent: string;
}

export default function RelatedEntityAlert({
  distributorName,
  holderName,
  sharedParent,
}: RelatedEntityAlertProps) {
  return (
    <div className="animate-fade-in-up bg-[var(--surface)] border border-[var(--info)]/30 rounded-xl p-6 w-full">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[var(--info)] text-lg">&#9889;</span>
        <h3 className="font-display font-bold text-sm uppercase tracking-widest text-[var(--info)]">
          Related Entity Detected
        </h3>
      </div>

      <p className="font-mono text-sm text-[var(--text-mid)] leading-relaxed">
        Your distributor ({distributorName}) and the rights holder ({holderName})
        share a parent company ({sharedParent}).
      </p>

      <p className="font-mono text-sm text-[var(--text-mid)] mt-3 leading-relaxed">
        This may help or hurt your negotiation — internal deals can move faster,
        but the rights holder may price higher knowing the project is affiliated.
      </p>

      <div className="mt-5 pt-4 border-t border-[var(--border)]">
        <p className="font-mono text-xs text-[var(--text-dim)]">
          Recommend: Have your attorney flag this in the clearance request letter.
        </p>
      </div>
    </div>
  );
}
