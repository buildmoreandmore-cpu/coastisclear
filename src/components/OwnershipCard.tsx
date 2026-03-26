"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { OwnershipResult, Writer } from "@/types";

interface OwnershipCardProps {
  data: OwnershipResult;
  delay?: number;
}

export default function OwnershipCard({ data, delay = 0 }: OwnershipCardProps) {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    if (!data.email) return;
    await navigator.clipboard.writeText(data.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const confidenceColor =
    data.confidence >= 80
      ? "var(--success)"
      : data.confidence >= 40
        ? "var(--warning)"
        : "var(--danger)";

  const confidenceLabel =
    data.confidence >= 80
      ? "Found"
      : data.confidence >= 40
        ? "Partial Match"
        : "Not Verified";

  const isBlocked = data.noSamplePolicy;

  return (
    <div
      className="animate-fade-in-up bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 w-full"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display font-bold text-sm uppercase tracking-widest text-[var(--text-mid)]">
          {data.type === "master" ? "Master Recording" : "Publishing (Composition)"}
        </h3>
        <span
          className="flex items-center gap-1.5 font-mono text-xs px-3 py-1 rounded-full border"
          style={{
            color: isBlocked ? "var(--danger)" : confidenceColor,
            borderColor: isBlocked
              ? "rgba(229,72,77,0.3)"
              : `${confidenceColor}33`,
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: isBlocked ? "var(--danger)" : confidenceColor,
            }}
          />
          {isBlocked ? "No-Sample Policy" : confidenceLabel}
        </span>
      </div>

      {/* Production Library Badge */}
      {data.isProductionLibrary && (
        <div className="mb-4 px-3 py-2 bg-[var(--info)]/10 border border-[var(--info)]/20 rounded-lg">
          <p className="font-mono text-xs text-[var(--info)]">
            Production Library Track — {data.libraryName}
          </p>
        </div>
      )}

      {/* Deceased Writer Warning */}
      {data.deceased && (
        <div className="mb-4 px-3 py-2 bg-[var(--warning)]/10 border border-[var(--warning)]/20 rounded-lg">
          <p className="font-mono text-xs text-[var(--warning)]">
            Writer Deceased — Estate Contact Required
          </p>
        </div>
      )}

      {/* Low confidence warning */}
      {data.confidence < 60 && !isBlocked && (
        <div className="mb-4 px-3 py-2 bg-[var(--warning)]/10 border border-[var(--warning)]/20 rounded-lg">
          <p className="font-mono text-xs text-[var(--warning)]">
            Contact Unverified — Multiple sources searched
          </p>
        </div>
      )}

      {/* Data rows */}
      <div className="space-y-3 font-mono text-sm">
        {/* Writers (mandatory, top of card for publishing) */}
        {data.writers && data.writers.length > 0 && (
          <Row label="Writer(s)">
            <div className="space-y-1">
              {data.writers.map((w: Writer, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-white">{w.name}</span>
                  {w.pro && (
                    <span className="text-[var(--text-dim)] text-xs">
                      {w.pro}
                    </span>
                  )}
                  {w.deceased && (
                    <span className="text-[var(--warning)] text-xs">
                      Deceased
                    </span>
                  )}
                  {w.approval_obtained ? (
                    <span className="text-[var(--success)] text-xs">
                      Approved
                    </span>
                  ) : w.approval_required ? (
                    <span className="text-[var(--text-dim)] text-xs">
                      Pending
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </Row>
        )}

        <Row label={data.type === "master" ? "Owner" : "Publisher"}>
          <span className="text-white">{data.holder}</span>
        </Row>

        {data.administrator && (
          <Row label="Administered by">
            <span className="text-white">{data.administrator}</span>
          </Row>
        )}

        {data.pro && (
          <Row label="PRO">
            <span className="text-white">
              {data.pro}
              {data.proId && (
                <span className="text-[var(--text-dim)]"> · {data.proId}</span>
              )}
            </span>
          </Row>
        )}

        {/* Divider */}
        <div className="border-t border-[var(--border)] my-2" />

        {data.email && (
          <Row label="Contact">
            <div className="flex items-center gap-2 group">
              <span className="text-white">{data.email}</span>
              <button
                onClick={copyEmail}
                className="opacity-0 group-hover:opacity-100 text-[var(--text-dim)] hover:text-white text-xs transition-opacity"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </Row>
        )}

        {data.phone && (
          <Row label="Phone">
            <span className="text-white">{data.phone}</span>
          </Row>
        )}

        {data.address && (
          <Row label="Address">
            <span className="text-white">{data.address}</span>
          </Row>
        )}

        {data.department && (
          <Row label="Dept">
            <span className="text-white">{data.department}</span>
          </Row>
        )}

        {/* Fee info */}
        {data.avgFee && (
          <>
            <div className="border-t border-[var(--border)] my-2" />
            <Row label="Avg. Fee">
              <span className="text-white">{data.avgFee}</span>
            </Row>
          </>
        )}

        {data.avgResponseWeeks && (
          <Row label="Response">
            <span className="text-white">{data.avgResponseWeeks}</span>
          </Row>
        )}
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-[var(--border)] flex items-center justify-between">
        <p className="font-mono text-xs text-[var(--text-dim)]">
          Source: {data.source === "internal" ? "Internal Database" : "AI Inference"}
          {data.confidence > 0 && ` · ${data.confidence}% confidence`}
        </p>
        {data.lastVerified && (
          <p className="font-mono text-xs text-[var(--text-dim)]">
            Verified: {data.lastVerified}
          </p>
        )}
      </div>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <span className="text-[var(--text-dim)] w-28 shrink-0 text-right">
        {label}
      </span>
      <div className="flex-1">{children}</div>
    </div>
  );
}
