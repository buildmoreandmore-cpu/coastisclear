"use client";

interface QuoteTimerProps {
  expiration: string;
}

export default function QuoteTimer({ expiration }: QuoteTimerProps) {
  const expirationDate = new Date(expiration);
  const now = new Date();
  const diffMs = expirationDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  let color: string;
  let label: string;

  if (diffDays <= 0) {
    color = "var(--text)";
    label = "Quote expired. Re-initiate contact.";
  } else if (diffDays <= 6) {
    color = "var(--danger)";
    label = `Quote expiring — ${diffDays} day${diffDays !== 1 ? "s" : ""} left. Act now.`;
  } else if (diffDays <= 13) {
    color = "var(--warning)";
    label = `Quote expires soon — ${diffDays} days left`;
  } else {
    color = "var(--text-dim)";
    label = `Quote expires in ${diffDays} days`;
  }

  return (
    <div className="flex items-center gap-2 font-mono text-xs" style={{ color }}>
      <span>{diffDays <= 0 ? "\u26D4" : "\u23F1"}</span>
      <span>{label}</span>
      <span className="text-[var(--text-dim)]">
        — {expirationDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </span>
    </div>
  );
}
