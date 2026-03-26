import { NextResponse } from "next/server";
import { generateLetter } from "@/lib/claude";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      newSongTitle,
      sampledSongTitle,
      originalArtist,
      sampleUseDescription,
      originalTimingStart,
      originalTimingEnd,
      newTimingStart,
      newTimingEnd,
      intendedUse,
      releaseContext,
      distributorName,
      rightsType,
      holderName,
      contactName,
      department,
      writers,
      publisher,
      administrator,
    } = body;

    if (!sampledSongTitle || !originalArtist || !rightsType || !holderName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const letter = await generateLetter({
      newSongTitle: newSongTitle || "Untitled",
      sampledSongTitle,
      originalArtist,
      sampleUseDescription,
      originalTimingStart,
      originalTimingEnd,
      newTimingStart,
      newTimingEnd,
      intendedUse: intendedUse || "Commercial release",
      releaseContext,
      distributorName,
      rightsType,
      holderName,
      contactName,
      department,
      writers,
      publisher,
      administrator,
    });

    return NextResponse.json({ letter });
  } catch (e) {
    console.error("Letter generation error:", e);
    return NextResponse.json(
      { error: "Failed to generate letter" },
      { status: 500 }
    );
  }
}
