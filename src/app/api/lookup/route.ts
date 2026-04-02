import { NextResponse } from "next/server";
import { queryInternalDB } from "@/lib/lookup/internal";
import { mergeResults } from "@/lib/lookup/merge";
import { createServerClient } from "@/lib/supabase";

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

    // Query internal Supabase database only — no AI guessing
    let internalResult = null;
    try {
      internalResult = await queryInternalDB(songTitle, originalArtist);
    } catch (e) {
      console.error("Internal DB lookup failed:", e);
    }

    // Log search request for admin dashboard
    try {
      const server = createServerClient();
      await server.from("search_requests").insert({
        song_title: songTitle,
        artist: originalArtist,
        found_in_db: !!(internalResult?.master || internalResult?.publishing),
        source: internalResult?.master ? "internal" : "none",
      });
    } catch {
      // Don't block the response if logging fails
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

    // Not in our database — return clean "not found"
    return NextResponse.json({
      master: null,
      publishing: null,
      notFound: true,
    });
  } catch (e) {
    console.error("Lookup error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
