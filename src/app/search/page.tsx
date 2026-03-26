"use client";

import { Suspense, useState, useCallback, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import TypedPrompt from "@/components/TypedPrompt";
import OptionPills from "@/components/OptionPills";
import ScanningState from "@/components/ScanningState";
import OwnershipCard from "@/components/OwnershipCard";
import InterpolationCard from "@/components/InterpolationCard";
import FlatBuyoutCard from "@/components/FlatBuyoutCard";
import RelatedEntityAlert from "@/components/RelatedEntityAlert";
import ProminenceSignal from "@/components/ProminenceSignal";
import LetterModal from "@/components/LetterModal";
import Toast from "@/components/Toast";
import type { SearchState, LookupResponse, PipelineItem, PipelineStep } from "@/types";

const STEP_NAMES_MAP: Record<number, string> = {
  0: "Email Confirm",
  1: "Request Letter Sent",
  2: "Quote & Expiration Date",
  3: "Confirmation Letter Sent/Signed",
  4: "Check Request Sent",
  5: "Check Received",
  6: "Payment Letter Sent",
  7: "Credits Received",
  8: "Splits Confirmed",
  9: "Contract Sent",
};

function createSteps(): PipelineStep[] {
  return Array.from({ length: 10 }, (_, i) => ({
    stepNumber: i,
    stepName: STEP_NAMES_MAP[i],
    completed: false,
  }));
}

const DURATION_OPTIONS = [
  { value: "under_5s", label: "Under 5 seconds" },
  { value: "5_15s", label: "5–15 seconds" },
  { value: "15_plus", label: "15+ seconds" },
];

const USE_OPTIONS = [
  { value: "commercial", label: "Commercial release" },
  { value: "independent", label: "Independent / DIY release" },
  { value: "non_commercial", label: "Non-commercial / personal" },
  { value: "sync", label: "Sync / film / TV" },
];

const RELEASE_OPTIONS = [
  { value: "major_label", label: "Major Label" },
  { value: "independent_label", label: "Independent Label" },
  { value: "self_released", label: "Self-Released / DIY" },
  { value: "distributor", label: "Through a Distributor" },
  { value: "unknown", label: "Not sure yet" },
];

const SAMPLE_USE_TAGS = [
  "Loops throughout",
  "Used once",
  "Chopped / flipped",
  "Background texture",
  "Main hook / melody",
  "Drum / percussion only",
  "Filtered / processed",
  "Used as-is",
];

export default function SearchPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <SearchPage />
    </Suspense>
  );
}

function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialSong = searchParams.get("song") || "";

  const [state, setState] = useState<SearchState>({
    step: 0,
    newSongTitle: "",
    sampledSongTitle: initialSong,
    originalArtist: "",
    referenceUrl: "",
    originalTimingStart: "",
    originalTimingEnd: "",
    newTimingStart: "",
    newTimingEnd: "",
    sampleUseDescription: "",
    sampleUseTags: [],
    intendedUse: "",
    releaseContext: "",
    distributorName: "",
    lookupResults: null,
    lookupStatus: "idle",
  });

  const [typingDone, setTypingDone] = useState(false);
  const [letterModalOpen, setLetterModalOpen] = useState(false);
  const [letterLoading, setLetterLoading] = useState(false);
  const [masterLetter, setMasterLetter] = useState<string | undefined>();
  const [publishingLetter, setPublishingLetter] = useState<string | undefined>();
  const [toast, setToast] = useState({ visible: false, message: "" });
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const update = (partial: Partial<SearchState>) =>
    setState((s) => ({ ...s, ...partial }));

  const nextStep = () => {
    setTypingDone(false);
    update({ step: state.step + 1 });
  };

  const onTypingComplete = useCallback(() => {
    setTypingDone(true);
  }, []);

  useEffect(() => {
    if (typingDone && inputRef.current) {
      inputRef.current.focus();
    }
    if (typingDone && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [typingDone]);

  // Auto-fire lookup when we reach scanning step
  useEffect(() => {
    if (state.step === 8 && state.lookupStatus === "idle") {
      runLookup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.step]);

  const runLookup = async () => {
    update({ lookupStatus: "scanning" });
    try {
      const res = await fetch("/api/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          songTitle: state.sampledSongTitle,
          originalArtist: state.originalArtist,
          originalTimingStart: state.originalTimingStart,
          originalTimingEnd: state.originalTimingEnd,
          newTimingStart: state.newTimingStart,
          newTimingEnd: state.newTimingEnd,
          distributorName: state.distributorName,
        }),
      });
      const data: LookupResponse = await res.json();
      update({ lookupResults: data, lookupStatus: "done" });
    } catch {
      update({ lookupStatus: "error", errorMessage: "Lookup failed. Please try again." });
    }
  };

  const generateLetters = async () => {
    setLetterModalOpen(true);
    setLetterLoading(true);
    setMasterLetter(undefined);
    setPublishingLetter(undefined);

    const base = {
      newSongTitle: state.newSongTitle,
      sampledSongTitle: state.sampledSongTitle,
      originalArtist: state.originalArtist,
      sampleUseDescription: state.sampleUseDescription,
      originalTimingStart: state.originalTimingStart,
      originalTimingEnd: state.originalTimingEnd,
      newTimingStart: state.newTimingStart,
      newTimingEnd: state.newTimingEnd,
      intendedUse: state.intendedUse,
      releaseContext: state.releaseContext,
      distributorName: state.distributorName,
    };

    try {
      const results = state.lookupResults;
      const promises = [];

      if (results?.master) {
        promises.push(
          fetch("/api/letter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...base,
              rightsType: "master",
              holderName: results.master.holder,
              contactName: results.master.contactName,
              department: results.master.department,
            }),
          })
            .then((r) => r.json())
            .then((d) => setMasterLetter(d.letter))
        );
      }

      if (results?.publishing) {
        promises.push(
          fetch("/api/letter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...base,
              rightsType: "publishing",
              holderName: results.publishing.holder,
              contactName: results.publishing.contactName,
              department: results.publishing.department,
              writers: results.publishing.writers?.map((w) => w.name),
              publisher: results.publishing.holder,
              administrator: results.publishing.administrator,
            }),
          })
            .then((r) => r.json())
            .then((d) => setPublishingLetter(d.letter))
        );
      }

      await Promise.all(promises);
    } catch {
      // Silently fail individual letters
    } finally {
      setLetterLoading(false);
    }
  };

  const addToPipeline = () => {
    const results = state.lookupResults;
    const item: PipelineItem = {
      id: uuidv4(),
      newSongTitle: state.newSongTitle,
      sampledSongTitle: state.sampledSongTitle,
      originalArtist: state.originalArtist,
      referenceUrl: state.referenceUrl || undefined,
      originalTimingStart: state.originalTimingStart || undefined,
      originalTimingEnd: state.originalTimingEnd || undefined,
      newTimingStart: state.newTimingStart || undefined,
      newTimingEnd: state.newTimingEnd || undefined,
      sampleUseDescription: state.sampleUseDescription || undefined,
      sampleUseTags: state.sampleUseTags.length ? state.sampleUseTags : undefined,
      intendedUse: state.intendedUse,
      releaseContext: state.releaseContext || undefined,
      distributorName: state.distributorName || undefined,
      master: {
        rightsType: "master",
        holder: results?.master?.holder || "Unknown",
        administrator: results?.master?.administrator,
        email: results?.master?.email,
        steps: createSteps(),
        status: "active",
      },
      publishing: {
        rightsType: "publishing",
        holder: results?.publishing?.holder || "Unknown",
        administrator: results?.publishing?.administrator,
        email: results?.publishing?.email,
        steps: createSteps(),
        status: "active",
      },
      letterDrafted: !!(masterLetter || publishingLetter),
      masterLetter,
      publishingLetter,
      activityLog: [
        {
          action: "Ownership identified",
          performedBy: "Clear Wax",
          performedAt: new Date().toISOString(),
        },
        {
          action: "Added to pipeline",
          performedBy: "you",
          performedAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem("clearwax_pipeline") || "[]");
      existing.push(item);
      localStorage.setItem("clearwax_pipeline", JSON.stringify(existing));
      setToast({ visible: true, message: "Saved to your pipeline" });
    } catch {
      setToast({ visible: true, message: "Could not save — storage may be full" });
    }
  };

  const handleTextSubmit = (field: keyof SearchState, value: string) => {
    if (!value.trim()) return;
    update({ [field]: value.trim() } as Partial<SearchState>);
    nextStep();
  };

  const handleTagToggle = (tag: string) => {
    const tags = state.sampleUseTags.includes(tag)
      ? state.sampleUseTags.filter((t) => t !== tag)
      : [...state.sampleUseTags, tag];
    update({ sampleUseTags: tags });
  };

  // Determine if distributor step should be skipped
  const needsDistributor = state.releaseContext === "distributor" || state.releaseContext === "independent_label";

  const renderStep = () => {
    switch (state.step) {
      // Step 0: New song title
      case 0:
        return (
          <StepContainer key={0}>
            <TypedPrompt text="What's the name of your new song?" onComplete={onTypingComplete} />
            {typingDone && (
              <TextInput
                ref={inputRef}
                placeholder='e.g. "Waste No Time"'
                onSubmit={(v) => handleTextSubmit("newSongTitle", v)}
              />
            )}
          </StepContainer>
        );

      // Step 1: Sampled song title
      case 1:
        return (
          <StepContainer key={1}>
            <TypedPrompt text="What's the name of the song you're sampling?" onComplete={onTypingComplete} />
            {typingDone && (
              <TextInput
                ref={inputRef}
                defaultValue={state.sampledSongTitle}
                placeholder='e.g. "Think" — James Brown'
                onSubmit={(v) => handleTextSubmit("sampledSongTitle", v)}
              />
            )}
          </StepContainer>
        );

      // Step 2: Original artist
      case 2:
        return (
          <StepContainer key={2}>
            <TypedPrompt text="Who's the original artist?" onComplete={onTypingComplete} />
            {typingDone && (
              <TextInput
                ref={inputRef}
                placeholder="e.g. James Brown"
                onSubmit={(v) => handleTextSubmit("originalArtist", v)}
              />
            )}
          </StepContainer>
        );

      // Step 3: Reference URL
      case 3:
        return (
          <StepContainer key={3}>
            <TypedPrompt text="Can you drop a link to the original track?" onComplete={onTypingComplete} />
            {typingDone && (
              <div className="mt-6 space-y-3">
                <TextInput
                  ref={inputRef}
                  placeholder="YouTube, Spotify, or SoundCloud link"
                  onSubmit={(v) => handleTextSubmit("referenceUrl", v)}
                />
                <button
                  onClick={nextStep}
                  className="font-mono text-xs text-[var(--text-dim)] hover:text-[var(--text-mid)] transition-colors"
                >
                  Skip — I don&apos;t have a link right now
                </button>
              </div>
            )}
          </StepContainer>
        );

      // Step 4: Original timing
      case 4:
        return (
          <StepContainer key={4}>
            <TypedPrompt
              text="Where in the original track does your sample start and end?"
              onComplete={onTypingComplete}
            />
            {typingDone && (
              <TimingInput
                onSubmit={(start, end) => {
                  update({ originalTimingStart: start, originalTimingEnd: end });
                  nextStep();
                }}
                helperText="The timestamp in the original recording"
              />
            )}
          </StepContainer>
        );

      // Step 5: New timing
      case 5:
        return (
          <StepContainer key={5}>
            <TypedPrompt
              text="Where does this sample appear in your new track?"
              onComplete={onTypingComplete}
            />
            {typingDone && (
              <TimingInput
                onSubmit={(start, end) => {
                  update({ newTimingStart: start, newTimingEnd: end });
                  nextStep();
                }}
                helperText="Where the sample plays in your song"
              />
            )}
          </StepContainer>
        );

      // Step 6: Sample use description
      case 6:
        return (
          <StepContainer key={6}>
            <TypedPrompt text="Describe how you're using the sample." onComplete={onTypingComplete} />
            {typingDone && (
              <div className="mt-6 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_USE_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-1.5 rounded-full font-mono text-xs transition-all ${
                        state.sampleUseTags.includes(tag)
                          ? "bg-[var(--accent)] text-[var(--bg)] border border-[var(--accent)]"
                          : "border border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--border-active)] hover:text-[var(--text-mid)]"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <textarea
                  ref={textareaRef}
                  placeholder='e.g. "The main melody loops throughout the chorus"'
                  rows={3}
                  className="w-full bg-transparent border-none outline-none font-mono text-lg text-[var(--text)] placeholder:text-[var(--text-dim)] caret-gray-500 resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      const val = (e.target as HTMLTextAreaElement).value;
                      update({ sampleUseDescription: val });
                      nextStep();
                    }
                  }}
                />
                <button
                  onClick={() => nextStep()}
                  className="font-mono text-xs text-[var(--text-dim)] hover:text-[var(--text-mid)] transition-colors"
                >
                  {state.sampleUseTags.length > 0 ? "Continue with selected tags" : "Skip"}
                </button>
              </div>
            )}
          </StepContainer>
        );

      // Step 7A: Intended use
      case 7:
        return (
          <StepContainer key={7}>
            <TypedPrompt text="What's this for?" onComplete={onTypingComplete} />
            {typingDone && (
              <OptionPills
                options={USE_OPTIONS}
                onSelect={(v) => {
                  update({ intendedUse: v });
                  // Go to release context step
                  setTypingDone(false);
                  update({ step: 7.5 } as any);
                }}
              />
            )}
          </StepContainer>
        );

      // Step 7.5: Release context (implemented as step 7.5, rendered when step rounds)
      default:
        if (state.step === 7.5) {
          return (
            <StepContainer key="7.5">
              <TypedPrompt text="Who's releasing this?" onComplete={onTypingComplete} />
              {typingDone && (
                <OptionPills
                  options={RELEASE_OPTIONS}
                  onSelect={(v) => {
                    update({ releaseContext: v });
                    if (v === "distributor" || v === "independent_label") {
                      setTypingDone(false);
                      update({ step: 7.75 } as any);
                    } else {
                      setTypingDone(false);
                      update({ step: 8 });
                    }
                  }}
                />
              )}
            </StepContainer>
          );
        }

        if (state.step === 7.75) {
          return (
            <StepContainer key="7.75">
              <TypedPrompt text="Which one?" onComplete={onTypingComplete} />
              {typingDone && (
                <TextInput
                  ref={inputRef}
                  placeholder="e.g. The Orchard, DistroKid, TuneCore"
                  onSubmit={(v) => {
                    update({ distributorName: v });
                    setTypingDone(false);
                    update({ step: 8 });
                  }}
                />
              )}
            </StepContainer>
          );
        }

        // Step 8: Scanning
        if (state.step === 8 && state.lookupStatus !== "done") {
          return (
            <StepContainer key={8}>
              <ScanningState
                phases={[
                  "Searching internal rights database...",
                  "Analyzing ownership data...",
                  "Building clearance profile...",
                ]}
                onComplete={() => {
                  if (state.lookupStatus === "done") {
                    update({ step: 9 });
                  }
                  // If not done yet, the useEffect will handle transition
                }}
              />
            </StepContainer>
          );
        }

        // Step 9: Results
        if (state.step === 8 && state.lookupStatus === "done") {
          update({ step: 9 });
          return null;
        }

        if (state.step === 9) {
          const results = state.lookupResults;
          return (
            <StepContainer key={9}>
              <TypedPrompt
                text={`Here's what we found for "${state.sampledSongTitle}" by ${state.originalArtist}.`}
                onComplete={onTypingComplete}
              />

              {typingDone && (
                <div className="mt-8 space-y-6 w-full">
                  {/* Prominence Signal */}
                  {results?.prominenceSignal && (
                    <ProminenceSignal
                      originalTimingStart={state.originalTimingStart}
                      originalTimingEnd={state.originalTimingEnd}
                      newTimingStart={state.newTimingStart}
                      newTimingEnd={state.newTimingEnd}
                      signal={results.prominenceSignal.signal}
                      description={results.prominenceSignal.description}
                      originalDuration={results.prominenceSignal.originalDuration}
                      newDuration={results.prominenceSignal.newDuration}
                      prominence={results.prominenceSignal.prominence}
                    />
                  )}

                  {/* Related Entity Alert */}
                  {results?.relatedEntity && (
                    <RelatedEntityAlert
                      distributorName={results.relatedEntity.distributorName}
                      holderName={results.relatedEntity.holderName}
                      sharedParent={results.relatedEntity.sharedParent}
                    />
                  )}

                  {/* Publishing Card */}
                  {results?.publishing && (
                    <OwnershipCard data={results.publishing} delay={0} />
                  )}

                  {/* Master Card */}
                  {results?.master && (
                    <OwnershipCard data={results.master} delay={200} />
                  )}

                  {/* Interpolation Card */}
                  {results?.interpolationRecommended && <InterpolationCard />}

                  {/* Flat Buyout Card */}
                  {results?.flatBuyoutEligible && <FlatBuyoutCard />}

                  {/* No results */}
                  {!results?.master && !results?.publishing && (
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
                      <p className="font-mono text-sm text-[var(--text-mid)]">
                        No ownership data found. Try checking the song title and artist spelling,
                        or contact us for manual research.
                      </p>
                    </div>
                  )}

                  {/* Disclaimer */}
                  <p className="font-mono text-xs text-[var(--text-dim)] text-center">
                    We find who owns it and how to reach them. You handle the deal.
                    <br />
                    Rates vary. These are industry benchmarks, not quotes.
                  </p>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      onClick={generateLetters}
                      className="flex-1 px-6 py-3 bg-[var(--accent)] text-[var(--bg)] font-mono text-sm rounded-lg hover:bg-[var(--accent)]/90 transition-colors"
                    >
                      Draft Clearance Letter
                    </button>
                    <button
                      onClick={addToPipeline}
                      className="flex-1 px-6 py-3 border border-[var(--border-active)] text-[var(--text)] font-mono text-sm rounded-lg hover:bg-[var(--accent-soft)] transition-colors"
                    >
                      Add to Pipeline
                    </button>
                    <button
                      onClick={() => router.push("/search")}
                      className="flex-1 px-6 py-3 border border-[var(--border)] text-[var(--text-mid)] font-mono text-sm rounded-lg hover:border-[var(--border-active)] hover:text-[var(--accent)] transition-colors"
                    >
                      Search Another
                    </button>
                  </div>
                </div>
              )}
            </StepContainer>
          );
        }

        // Error state
        if (state.lookupStatus === "error") {
          return (
            <StepContainer key="error">
              <p className="font-mono text-sm text-[var(--danger)]">
                {state.errorMessage || "Something went wrong. Please try again."}
              </p>
              <button
                onClick={() => {
                  update({ lookupStatus: "idle", step: 8 });
                }}
                className="mt-4 px-6 py-3 border border-[var(--border-active)] text-[var(--text)] font-mono text-sm rounded-lg"
              >
                Retry
              </button>
            </StepContainer>
          );
        }

        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl">
        {/* Progress dots */}
        <div className="flex gap-1.5 justify-center mb-12">
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                i <= Math.floor(state.step) ? "bg-[var(--accent)]" : "bg-[var(--text-dim)]"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>

      <LetterModal
        isOpen={letterModalOpen}
        onClose={() => setLetterModalOpen(false)}
        masterLetter={masterLetter}
        publishingLetter={publishingLetter}
        isLoading={letterLoading}
      />

      <Toast
        visible={toast.visible}
        message={toast.message}
        onDismiss={() => setToast({ visible: false, message: "" })}
      />
    </div>
  );
}

// ─── Helper Components ───

function StepContainer({ children, key: k }: { children: React.ReactNode; key: string | number }) {
  return (
    <motion.div
      key={k}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

import { forwardRef } from "react";

const TextInput = forwardRef<
  HTMLInputElement,
  {
    placeholder: string;
    onSubmit: (value: string) => void;
    defaultValue?: string;
  }
>(function TextInput({ placeholder, onSubmit, defaultValue }, ref) {
  const [value, setValue] = useState(defaultValue || "");

  return (
    <div className="mt-6 animate-fade-in-up">
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSubmit(value);
          }
        }}
        className="w-full bg-transparent border-none outline-none font-mono text-lg text-[var(--text)] placeholder:text-[var(--text-dim)] caret-gray-500"
      />
    </div>
  );
});

function TimingInput({
  onSubmit,
  helperText,
}: {
  onSubmit: (start: string, end: string) => void;
  helperText: string;
}) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const endRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mt-6 animate-fade-in-up space-y-3">
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          placeholder="0:04"
          className="w-20 bg-transparent border-none outline-none font-mono text-lg text-[var(--text)] text-center placeholder:text-[var(--text-dim)] caret-gray-500 border-b border-b-[var(--text-dim)]"
          style={{ borderBottom: '1px solid var(--text-dim)' }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "Tab") {
              e.preventDefault();
              endRef.current?.focus();
            }
          }}
        />
        <span className="font-mono text-[var(--text-dim)]">to</span>
        <input
          ref={endRef}
          type="text"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          placeholder="0:12"
          className="w-20 bg-transparent border-none outline-none font-mono text-lg text-[var(--text)] text-center placeholder:text-[var(--text-dim)] caret-gray-500"
          style={{ borderBottom: '1px solid var(--text-dim)' }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSubmit(start, end);
            }
          }}
        />
      </div>
      <p className="font-mono text-xs text-[var(--text-dim)]">{helperText}</p>
      <div className="flex gap-3">
        <button
          onClick={() => onSubmit(start, end)}
          disabled={!start || !end}
          className="font-mono text-xs text-[var(--text-mid)] hover:text-[var(--accent)] disabled:opacity-30 transition-colors"
        >
          Continue
        </button>
        <button
          onClick={() => onSubmit("", "")}
          className="font-mono text-xs text-[var(--text-dim)] hover:text-[var(--text-mid)] transition-colors"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
