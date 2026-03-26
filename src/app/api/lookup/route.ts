import { NextResponse } from "next/server";
import { queryInternalDB } from "@/lib/lookup/internal";
import { inferOwnership } from "@/lib/claude";
import { mergeResults } from "@/lib/lookup/merge";
import { lookupDemoData } from "@/lib/demo-data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      songTitle,
      originalArtist,
      originalTimingStart,
      originalTimingEnd,
      newTimingStart,
      newTimingEnd,
      distributorName,
    } = body;

    if (!songTitle || !originalArtist) {
      return NextResponse.json(
        { error: "Song title and artist are required" },
        { status: 400 }
      );
    }

    // Step 1: Check demo data first (works without Supabase)
    const demoMatch = lookupDemoData(songTitle, originalArtist);
    if (demoMatch) {
      const merged = mergeResults({
        internal: {
          master: demoMatch.master,
          publishing: demoMatch.publishing,
          isProductionLibrary: demoMatch.isProductionLibrary,
          libraryName: demoMatch.libraryName,
          flatBuyoutEligible: demoMatch.flatBuyoutEligible,
        },
        claude: null,
        originalTimingStart,
        originalTimingEnd,
        newTimingStart,
        newTimingEnd,
        distributorName,
      });
      return NextResponse.json(merged);
    }

    // Step 2: Query internal Supabase database
    let internalResult = null;
    try {
      internalResult = await queryInternalDB(songTitle, originalArtist);
    } catch (e) {
      console.error("Internal DB lookup failed:", e);
    }

    // If we got internal results, merge and return
    if (internalResult?.master || internalResult?.publishing) {
      const merged = mergeResults({
        internal: internalResult,
        claude: null,
        originalTimingStart,
        originalTimingEnd,
        newTimingStart,
        newTimingEnd,
        distributorName,
      });
      return NextResponse.json(merged);
    }

    // Step 3: Claude inference as fallback
    let claudeResult = null;
    try {
      claudeResult = await inferOwnership({
        songTitle,
        artist: originalArtist,
      });
    } catch (e) {
      console.error("Claude inference failed:", e);
    }

    // Step 4: Merge results
    const merged = mergeResults({
      internal: internalResult,
      claude: claudeResult,
      originalTimingStart,
      originalTimingEnd,
      newTimingStart,
      newTimingEnd,
      distributorName,
    });

    return NextResponse.json(merged);
  } catch (e) {
    console.error("Lookup error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
