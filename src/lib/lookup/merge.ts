import type { OwnershipResult, LookupResponse } from "@/types";

interface MergeInput {
  internal: {
    master: OwnershipResult | null;
    publishing: OwnershipResult | null;
    isProductionLibrary: boolean;
    libraryName?: string;
    flatBuyoutEligible: boolean;
  } | null;
  claude: {
    master: {
      holder: string;
      label?: string;
      producer?: string;
      confidence: "high" | "medium" | "low";
      reasoning: string;
    };
    publishing: {
      holder: string;
      publisher?: string;
      administrator?: string;
      writers?: string[];
      confidence: "high" | "medium" | "low";
      reasoning: string;
    };
  } | null;
  originalTimingStart?: string;
  originalTimingEnd?: string;
  newTimingStart?: string;
  newTimingEnd?: string;
  totalTrackLength?: number;
  distributorName?: string;
}

function parseTime(t: string): number {
  const parts = t.split(":").map(Number);
  return parts.length === 2 ? parts[0] * 60 + parts[1] : 0;
}

function claudeConfidenceToNumber(c: "high" | "medium" | "low"): number {
  if (c === "high") return 40;
  if (c === "medium") return 30;
  return 20;
}

export function mergeResults(input: MergeInput): LookupResponse {
  let master: OwnershipResult | null = null;
  let publishing: OwnershipResult | null = null;

  // Master: prefer internal, fall back to Claude
  if (input.internal?.master) {
    master = input.internal.master;
  } else if (input.claude?.master) {
    master = {
      holder: input.claude.master.holder,
      type: "master",
      confidence: claudeConfidenceToNumber(input.claude.master.confidence),
      source: "claude_inference",
      contactName: input.claude.master.producer ? `Producer: ${input.claude.master.producer}` : undefined,
    };
  }

  // Publishing: prefer internal, fall back to Claude
  if (input.internal?.publishing) {
    publishing = input.internal.publishing;
  } else if (input.claude?.publishing) {
    publishing = {
      holder: input.claude.publishing.holder,
      administrator: input.claude.publishing.administrator,
      type: "publishing",
      confidence: claudeConfidenceToNumber(input.claude.publishing.confidence),
      source: "claude_inference",
      writers: input.claude.publishing.writers?.map((name) => ({
        name,
        approval_required: true,
      })),
    };
  }

  // Interpolation: recommend if master blocked or low confidence
  const interpolationRecommended =
    (master?.noSamplePolicy === true) ||
    (master !== null && master.confidence < 40) ||
    master === null;

  // Flat buyout: eligible for production libraries, independent owners, or high-confidence small samples
  const isProductionLibrary = input.internal?.isProductionLibrary || false;
  const flatBuyoutEligible =
    input.internal?.flatBuyoutEligible ||
    isProductionLibrary;

  // Production library info
  if (isProductionLibrary && master) {
    master.isProductionLibrary = true;
    master.libraryName = input.internal?.libraryName;
  }
  if (isProductionLibrary && publishing) {
    publishing.isProductionLibrary = true;
    publishing.libraryName = input.internal?.libraryName;
  }

  // Prominence signal from timing data
  let prominenceSignal: LookupResponse["prominenceSignal"];
  if (input.originalTimingStart && input.originalTimingEnd && input.newTimingStart && input.newTimingEnd) {
    const origStart = parseTime(input.originalTimingStart);
    const origEnd = parseTime(input.originalTimingEnd);
    const newStart = parseTime(input.newTimingStart);
    const newEnd = parseTime(input.newTimingEnd);
    const originalDuration = origEnd - origStart;
    const newDuration = newEnd - newStart;
    const totalLength = input.totalTrackLength || 210; // default 3:30
    const prominence = newDuration / totalLength;

    let signal: "high" | "moderate" | "low";
    let description: string;
    if (prominence > 0.25) {
      signal = "high";
      description = "Sample is prominent. Expect full rate.";
    } else if (prominence > 0.1) {
      signal = "moderate";
      description = "Moderate use. Fee reduction may be negotiable.";
    } else {
      signal = "low";
      description = "Brief use. Flat fee or reduction likely available.";
    }

    prominenceSignal = { originalDuration, newDuration, prominence, signal, description };
  }

  // Related entity detection
  let relatedEntity: LookupResponse["relatedEntity"];
  if (input.distributorName && (master || publishing)) {
    const distributorParents: Record<string, string> = {
      "the orchard": "Sony Music Entertainment",
      "awal": "Sony Music Entertainment",
      "virgin music": "Universal Music Group",
      "caroline": "Universal Music Group",
      "ada": "Warner Music Group",
    };
    const distLower = input.distributorName.toLowerCase();
    const distParent = distributorParents[distLower];
    if (distParent) {
      const holderToCheck = master?.holder || publishing?.holder || "";
      const holderParents: Record<string, string> = {
        "sony music publishing": "Sony Music Entertainment",
        "sony/atv": "Sony Music Entertainment",
        "columbia": "Sony Music Entertainment",
        "rca": "Sony Music Entertainment",
        "epic": "Sony Music Entertainment",
        "universal music publishing": "Universal Music Group",
        "interscope": "Universal Music Group",
        "def jam": "Universal Music Group",
        "republic": "Universal Music Group",
        "capitol": "Universal Music Group",
        "warner chappell": "Warner Music Group",
        "atlantic": "Warner Music Group",
        "elektra": "Warner Music Group",
      };
      const holderLower = holderToCheck.toLowerCase();
      const holderParent = holderParents[holderLower];
      if (holderParent && holderParent === distParent) {
        relatedEntity = {
          distributorName: input.distributorName,
          holderName: holderToCheck,
          sharedParent: distParent,
        };
      }
    }
  }

  return {
    master,
    publishing,
    interpolationRecommended,
    flatBuyoutEligible,
    relatedEntity,
    prominenceSignal,
  };
}
