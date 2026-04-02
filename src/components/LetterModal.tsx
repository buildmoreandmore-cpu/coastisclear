"use client";

import { useState, useEffect, useRef } from "react";

interface LetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  masterLetter?: string;
  publishingLetter?: string;
  isLoading: boolean;
  onSave?: (masterLetter: string, publishingLetter: string) => void;
}

export default function LetterModal({
  isOpen,
  onClose,
  masterLetter,
  publishingLetter,
  isLoading,
  onSave,
}: LetterModalProps) {
  const [activeTab, setActiveTab] = useState<"master" | "publishing">("publishing");
  const [copied, setCopied] = useState(false);
  const [editedMaster, setEditedMaster] = useState("");
  const [editedPublishing, setEditedPublishing] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  // Sync edited text when letters come in
  useEffect(() => {
    if (masterLetter) setEditedMaster(masterLetter);
  }, [masterLetter]);

  useEffect(() => {
    if (publishingLetter) setEditedPublishing(publishingLetter);
  }, [publishingLetter]);

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
    activeTab === "master" ? editedMaster : editedPublishing;
  const setCurrentLetter =
    activeTab === "master" ? setEditedMaster : setEditedPublishing;

  const copyToClipboard = async () => {
    if (!currentLetter) return;
    await navigator.clipboard.writeText(currentLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPDF = () => {
    if (!currentLetter) return;
    // Generate a simple PDF using a print-friendly HTML page
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Clearance Letter - ${activeTab}</title>
        <style>
          body { font-family: 'Courier New', monospace; font-size: 12pt; line-height: 1.6; max-width: 700px; margin: 40px auto; padding: 40px; color: #1a1a1a; }
          @media print { body { margin: 0; padding: 20px; } }
        </style>
      </head>
      <body>
        <pre style="white-space: pre-wrap; font-family: 'Courier New', monospace;">${currentLetter.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `);
    printWindow.document.close();
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
        className="relative w-full max-w-2xl max-h-[85vh] bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden animate-fade-in-up mx-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <h2 className="font-display font-bold text-lg text-[var(--text)]">
            Clearance Letter
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--text-dim)] hover:text-[var(--text)] transition-colors font-mono text-sm"
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
                  ? "text-[var(--text)] border-b-2 border-[var(--accent)]"
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
                  ? "text-[var(--text)] border-b-2 border-[var(--accent)]"
                  : "text-[var(--text-dim)] hover:text-[var(--text-mid)]"
              }`}
            >
              Publishing
            </button>
          )}
        </div>

        {/* Editable hint */}
        {!isLoading && currentLetter && (
          <div className="px-6 pt-3">
            <p className="font-mono text-xs text-[var(--text-dim)]">
              Edit the letter below to fill in any missing details, then download as PDF.
            </p>
          </div>
        )}

        {/* Content — editable */}
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
            <textarea
              value={currentLetter}
              onChange={(e) => setCurrentLetter(e.target.value)}
              className="w-full bg-transparent font-mono text-sm text-[var(--text)] leading-relaxed outline-none resize-none min-h-[300px]"
              rows={20}
            />
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
            className="flex-1 px-4 py-2.5 border border-[var(--border-active)] text-[var(--text)] font-mono text-sm rounded-lg hover:bg-[var(--accent-soft)] disabled:opacity-30 transition-all"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={downloadPDF}
            disabled={!currentLetter || isLoading}
            className="flex-1 px-4 py-2.5 bg-[var(--accent)] text-[var(--bg)] font-mono text-sm rounded-lg hover:bg-[var(--accent)]/90 disabled:opacity-30 transition-all"
          >
            Download PDF
          </button>
          {onSave && (
            <button
              onClick={() => {
                onSave(editedMaster, editedPublishing);
                onClose();
              }}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 border border-[var(--success)]/50 text-[var(--success)] font-mono text-sm rounded-lg hover:bg-[var(--success)]/10 disabled:opacity-30 transition-all"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
