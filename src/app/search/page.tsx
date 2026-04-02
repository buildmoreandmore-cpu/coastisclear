"use client";

import { Suspense, useState, useCallback, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getAuthClient } from "@/lib/supabase";
import { AnimatePresence, motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import TypedPrompt from "@/components/TypedPrompt";
import OptionPills from "@/components/OptionPills";
import ScanningState from "@/components/ScanningState";
import OwnershipCard from "@/components/OwnershipCard";
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

  const STORAGE_KEY = "clearthewax_search_state";

  const requireAuth = async (onAuthed: () => void) => {
    const supabase = getAuthClient();
    if (!supabase) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      router.push("/login?redirect=/search");
      return;
    }
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      router.push("/login?redirect=/search");
    } else {
      onAuthed();
    }
  };

  const [state, setState] = useState<SearchState>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        sessionStorage.removeItem(STORAGE_KEY);
        try {
          const parsed = JSON.parse(saved) as SearchState;
          // Restore to results page (step 4) so they see their results
          return { ...parsed, step: 4, lookupStatus: "done" };
        } catch { /* fall through */ }
      }
    }
    return {
      step: 0,
      requestorName: "",
      requestorCompany: "",
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
    };
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

  const prevStep = () => {
    if (state.step <= 0) return;
    setTypingDone(false);
    const prev = state.step === 9.5 ? 9 : Math.floor(state.step) - 1;
    // Don't go back past results (step 4)
    if (prev < 5 && state.step >= 5) {
      update({ step: 4 });
      return;
    }
    update({ step: prev });
  };

  const onTypingComplete = useCallback(() => {
    setTypingDone(true);
  }, []);

  useEffect(() => {
    if (typingDone && inputRef.current) inputRef.current.focus();
    if (typingDone && textareaRef.current) textareaRef.current.focus();
  }, [typingDone]);

  // Auto-fire lookup when we reach scanning step (step 3)
  useEffect(() => {
    if (state.step === 3 && state.lookupStatus === "idle") {
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
      // Silently fail
    } finally {
      setLetterLoading(false);
    }
  };

  const addToPipeline = () => {
    const results = state.lookupResults;
    const item: PipelineItem = {
      id: uuidv4(),
      requestorName: state.requestorName || undefined,
      requestorCompany: state.requestorCompany || undefined,
      newSongTitle: state.newSongTitle || state.sampledSongTitle,
      sampledSongTitle: state.sampledSongTitle,
      originalArtist: state.originalArtist,
      referenceUrl: state.referenceUrl || undefined,
      originalTimingStart: state.originalTimingStart || undefined,
      originalTimingEnd: state.originalTimingEnd || undefined,
      newTimingStart: state.newTimingStart || undefined,
      newTimingEnd: state.newTimingEnd || undefined,
      sampleUseDescription: state.sampleUseDescription || undefined,
      sampleUseTags: state.sampleUseTags.length ? state.sampleUseTags : undefined,
      intendedUse: state.intendedUse || "independent",
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
          performedBy: "Clear the Wax",
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
      const existing = JSON.parse(localStorage.getItem("clearthewax_pipeline") || "[]");
      existing.push(item);
      localStorage.setItem("clearthewax_pipeline", JSON.stringify(existing));
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

  const needsDistributor = state.releaseContext === "distributor" || state.releaseContext === "independent_label";

  // Determine which phase we're in for progress display
  const inLetterMode = state.step >= 5;
  const totalDots = inLetterMode ? 13 : 4;

  const renderStep = () => {
    switch (state.step) {
      // ─── PHASE 1: SEARCH (2 steps → results) ───

      // Step 0: Song title
      case 0:
        return (
          <StepContainer key={0}>
            <TypedPrompt text="What song are you sampling?" onComplete={onTypingComplete} />
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

      // Step 1: Artist
      case 1:
        return (
          <StepContainer key={1}>
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

      // Step 2: Reference link (optional)
      case 2:
        return (
          <StepContainer key={2}>
            <TypedPrompt text="Drop a link to the original track." onComplete={onTypingComplete} />
            {typingDone && (
              <div className="mt-6 space-y-3">
                <TextInput
                  ref={inputRef}
                  placeholder="Spotify, YouTube, or Apple Music link"
                  onSubmit={(v) => handleTextSubmit("referenceUrl", v)}
                />
                <button
                  onClick={nextStep}
                  className="font-mono text-xs text-[var(--text-dim)] hover:text-[var(--text-mid)] transition-colors"
                >
                  Skip — search without a link
                </button>
              </div>
            )}
          </StepContainer>
        );

      // Step 3: Scanning
      case 3:
        if (state.lookupStatus === "done") {
          update({ step: 4 });
          return null;
        }
        return (
          <StepContainer key={3}>
            <ScanningState
              phases={[
                "Searching verified rights database...",
                "Matching ownership records...",
                "Building clearance profile...",
              ]}
              onComplete={() => {
                if (state.lookupStatus === "done") {
                  update({ step: 4 });
                }
              }}
            />
          </StepContainer>
        );

      // Step 4: Results
      case 4: {
        const results = state.lookupResults;
        return (
          <StepContainer key={3}>
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

                {/* Publishing Card */}
                {results?.publishing && (
                  <OwnershipCard data={results.publishing} delay={0} />
                )}

                {/* Master Card */}
                {results?.master && (
                  <OwnershipCard data={results.master} delay={200} />
                )}

                {/* No results */}
                {!results?.master && !results?.publishing && (
                  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 text-center space-y-3">
                    <p className="font-display font-bold text-lg text-[var(--text)]">
                      Not in our database yet
                    </p>
                    <p className="font-mono text-sm text-[var(--text-mid)]">
                      We don&apos;t have verified ownership data for this song.
                      Double-check the spelling, or reach out and we&apos;ll research it manually.
                    </p>
                    <a
                      href="mailto:clearthewaxmusic@gmail.com?subject=Song%20Research%20Request"
                      className="inline-block font-mono text-sm text-[var(--accent)] hover:opacity-70 transition-opacity"
                    >
                      clearthewaxmusic@gmail.com
                    </a>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-col gap-3 pt-4">
                  {(results?.master || results?.publishing) && (
                    <>
                      <button
                        onClick={() => requireAuth(() => {
                          setTypingDone(false);
                          update({ step: 5 });
                        })}
                        className="w-full px-6 py-3 bg-[var(--accent)] text-[var(--bg)] font-mono text-sm rounded-lg hover:bg-[var(--accent)]/90 transition-colors"
                      >
                        Draft Clearance Letter
                      </button>
                      <p className="font-mono text-xs text-[var(--text-dim)] text-center -mt-1">
                        We&apos;ll ask a few details about your project to generate a ready-to-send letter.
                      </p>
                    </>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => requireAuth(addToPipeline)}
                      className="flex-1 px-6 py-3 border border-[var(--border-active)] text-[var(--text)] font-mono text-sm rounded-lg hover:bg-[var(--accent-soft)] transition-colors"
                    >
                      Add to Pipeline
                    </button>
                    <button
                      onClick={() => {
                        setState({
                          step: 0,
                          requestorName: "",
                          requestorCompany: "",
                          newSongTitle: "",
                          sampledSongTitle: "",
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
                        setTypingDone(false);
                        setMasterLetter(undefined);
                        setPublishingLetter(undefined);
                      }}
                      className="flex-1 px-6 py-3 border border-[var(--border)] text-[var(--text-mid)] font-mono text-sm rounded-lg hover:border-[var(--border-active)] hover:text-[var(--accent)] transition-colors"
                    >
                      Search Another
                    </button>
                  </div>
                </div>
              </div>
            )}
          </StepContainer>
        );
      }

      // ─── PHASE 2: LETTER DETAILS (optional, only if they clicked "Draft Letter") ───

      // Step 5: Your name
      case 5:
        return (
          <StepContainer key={5}>
            <TypedPrompt text="What's your name?" onComplete={onTypingComplete} />
            {typingDone && (
              <TextInput
                ref={inputRef}
                placeholder="e.g. Jordan Ellis"
                onSubmit={(v) => handleTextSubmit("requestorName", v)}
              />
            )}
          </StepContainer>
        );

      // Step 6: Company
      case 6:
        return (
          <StepContainer key={6}>
            <TypedPrompt text="What label or company are you with?" onComplete={onTypingComplete} />
            {typingDone && (
              <div className="mt-6 space-y-3">
                <TextInput
                  ref={inputRef}
                  placeholder="e.g. Alien Music, Inc."
                  onSubmit={(v) => handleTextSubmit("requestorCompany", v)}
                />
                <button
                  onClick={nextStep}
                  className="font-mono text-xs text-[var(--text-dim)] hover:text-[var(--text-mid)] transition-colors"
                >
                  Independent — no label
                </button>
              </div>
            )}
          </StepContainer>
        );

      // Step 7: New song title
      case 7:
        return (
          <StepContainer key={7}>
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

      // Step 8: Intended use
      case 8:
        return (
          <StepContainer key={8}>
            <TypedPrompt text="What's this for?" onComplete={onTypingComplete} />
            {typingDone && (
              <OptionPills
                options={USE_OPTIONS}
                onSelect={(v) => {
                  update({ intendedUse: v });
                  nextStep();
                }}
              />
            )}
          </StepContainer>
        );

      // Step 9: Release context
      case 9:
        return (
          <StepContainer key={9}>
            <TypedPrompt text="Who's releasing this?" onComplete={onTypingComplete} />
            {typingDone && (
              <OptionPills
                options={RELEASE_OPTIONS}
                onSelect={(v) => {
                  update({ releaseContext: v });
                  if (v === "distributor" || v === "independent_label") {
                    setTypingDone(false);
                    update({ step: 9.5 } as any);
                  } else {
                    nextStep();
                  }
                }}
              />
            )}
          </StepContainer>
        );

      // Step 10: Original timing
      case 10:
        return (
          <StepContainer key={10}>
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

      // Step 11: New timing
      case 11:
        return (
          <StepContainer key={11}>
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

      // Step 12: Sample use description + tags → then generate letter
      case 12:
        return (
          <StepContainer key={12}>
            <TypedPrompt text="Describe how you're using the sample." onComplete={onTypingComplete} />
            {typingDone && (
              <div className="mt-6 space-y-4">
                <div className="flex flex-wrap justify-center gap-2">
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
                  className="w-full bg-transparent border-none outline-none font-mono text-lg text-[var(--text)] placeholder:text-[var(--text-dim)] caret-[var(--text)] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      const val = (e.target as HTMLTextAreaElement).value;
                      update({ sampleUseDescription: val });
                      generateLetters();
                    }
                  }}
                />
                <button
                  onClick={() => {
                    generateLetters();
                  }}
                  className="font-mono text-sm text-[var(--accent)] hover:opacity-70 transition-colors"
                >
                  {state.sampleUseTags.length > 0 ? "Generate Letter" : "Skip & Generate Letter"}
                </button>
              </div>
            )}
          </StepContainer>
        );

      default:
        // Distributor sub-step
        if (state.step === 9.5) {
          return (
            <StepContainer key="9.5">
              <TypedPrompt text="Which one?" onComplete={onTypingComplete} />
              {typingDone && (
                <TextInput
                  ref={inputRef}
                  placeholder="e.g. The Orchard, DistroKid, TuneCore"
                  onSubmit={(v) => {
                    update({ distributorName: v });
                    setTypingDone(false);
                    update({ step: 10 });
                  }}
                />
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
                  update({ lookupStatus: "idle", step: 3 });
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
          {Array.from({ length: totalDots }, (_, i) => {
            const stepIndex = inLetterMode ? i : i;
            return (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                  stepIndex <= Math.floor(state.step) ? "bg-[var(--accent)]" : "bg-[var(--text-dim)]"
                }`}
              />
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>

        {/* Back button */}
        {state.step > 0 && state.step !== 3 && state.step !== 4 && state.step < 13 && (
          <button
            onClick={prevStep}
            className="mt-8 font-mono text-xs text-[var(--text-dim)] hover:text-[var(--text-mid)] transition-colors"
          >
            &larr; back
          </button>
        )}
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
      className="w-full flex flex-col items-center text-center"
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
    <div className="mt-6 animate-fade-in-up w-full">
      <div className="flex items-center gap-2">
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
          className="flex-1 bg-transparent border-none outline-none font-mono text-lg text-[var(--text)] placeholder:text-[var(--text-dim)] caret-[var(--text)] text-center"
        />
        {value.trim() && (
          <button
            onClick={() => onSubmit(value)}
            className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-[var(--accent)] text-[var(--bg)] hover:opacity-80 transition-opacity"
            aria-label="Next"
          >
            &rarr;
          </button>
        )}
      </div>
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
    <div className="mt-6 animate-fade-in-up space-y-3 w-full flex flex-col items-center">
      <div className="flex items-center justify-center gap-3">
        <input
          type="text"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          placeholder="0:04"
          className="w-20 bg-transparent border-none outline-none font-mono text-lg text-[var(--text)] text-center placeholder:text-[var(--text-dim)] caret-[var(--text)] border-b border-b-[var(--text-dim)]"
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
          className="w-20 bg-transparent border-none outline-none font-mono text-lg text-[var(--text)] text-center placeholder:text-[var(--text-dim)] caret-[var(--text)]"
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
      <div className="flex gap-3 justify-center">
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
