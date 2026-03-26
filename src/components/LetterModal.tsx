"use client";

import { useState, useEffect, useRef } from "react";

interface LetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  masterLetter?: string;
  publishingLetter?: string;
  isLoading: boolean;
}

export default function LetterModal({
  isOpen,
  onClose,
  masterLetter,
  publishingLetter,
  isLoading,
}: LetterModalProps) {
  const [activeTab, setActiveTab] = useState<"master" | "publishing">("publishing");
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentLetter =
    activeTab === "master" ? masterLetter : publishingLetter;

  const copyToClipboard = async () => {
    if (!currentLetter) return;
    await navigator.clipboard.writeText(currentLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadLetter = () => {
    if (!currentLetter) return;
    const blob = new Blob([currentLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clearance-letter-${activeTab}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative w-full max-w-2xl max-h-[80vh] bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden animate-fade-in-up mx-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <h2 className="font-display font-bold text-lg text-white">
            Clearance Letter
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--text-dim)] hover:text-white transition-colors font-mono text-sm"
          >
            Close
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--border)]">
          {masterLetter !== undefined && (
            <button
              onClick={() => setActiveTab("master")}
              className={`flex-1 px-4 py-3 font-mono text-xs uppercase tracking-wider transition-colors ${
                activeTab === "master"
                  ? "text-white border-b-2 border-white"
                  : "text-[var(--text-dim)] hover:text-[var(--text-mid)]"
              }`}
            >
              Master
            </button>
          )}
          {publishingLetter !== undefined && (
            <button
              onClick={() => setActiveTab("publishing")}
              className={`flex-1 px-4 py-3 font-mono text-xs uppercase tracking-wider transition-colors ${
                activeTab === "publishing"
                  ? "text-white border-b-2 border-white"
                  : "text-[var(--text-dim)] hover:text-[var(--text-mid)]"
              }`}
            >
              Publishing
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-[var(--surface2)] rounded animate-pulse"
                  style={{ width: `${60 + Math.random() * 40}%` }}
                />
              ))}
            </div>
          ) : currentLetter ? (
            <pre className="font-mono text-sm text-[var(--text)] whitespace-pre-wrap leading-relaxed">
              {currentLetter}
            </pre>
          ) : (
            <p className="font-mono text-sm text-[var(--text-dim)]">
              No letter generated for this side.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 py-4 border-t border-[var(--border)]">
          <button
            onClick={copyToClipboard}
            disabled={!currentLetter || isLoading}
            className="flex-1 px-4 py-2.5 bg-white text-[var(--bg)] font-mono text-sm rounded-lg hover:bg-white/90 disabled:opacity-30 transition-all"
          >
            {copied ? "Copied!" : "Copy to Clipboard"}
          </button>
          <button
            onClick={downloadLetter}
            disabled={!currentLetter || isLoading}
            className="flex-1 px-4 py-2.5 border border-[var(--border-active)] text-white font-mono text-sm rounded-lg hover:bg-[var(--accent-soft)] disabled:opacity-30 transition-all"
          >
            Download .txt
          </button>
        </div>
      </div>
    </div>
  );
}
