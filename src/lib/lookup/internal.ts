import { createServerClient } from "@/lib/supabase";
import type { OwnershipResult } from "@/types";

interface InternalMatch {
  master: OwnershipResult | null;
  publishing: OwnershipResult | null;
  isProductionLibrary: boolean;
  libraryName?: string;
  flatBuyoutEligible: boolean;
}

export async function queryInternalDB(
  title: string,
  artist: string
): Promise<InternalMatch | null> {
  let supabase;
  try {
    supabase = createServerClient();
  } catch {
    // Supabase not configured — skip internal lookup
    return null;
  }

  // Query song_ownership with fuzzy matching
  const { data: songs, error } = await supabase
    .from("song_ownership")
    .select(
      `
      *,
      publisher:rights_holders!song_ownership_publisher_id_fkey(*),
      label:rights_holders!song_ownership_label_id_fkey(*)
    `
    )
    .or(`song_title.ilike.%${title}%,artist.ilike.%${artist}%`)
    .limit(5);

  if (error || !songs || songs.length === 0) return null;

  // Find best match (prefer exact title + artist match)
  const bestMatch =
    songs.find(
      (s: Record<string, string>) =>
        s.song_title.toLowerCase() === title.toLowerCase() &&
        s.artist.toLowerCase() === artist.toLowerCase()
    ) || songs[0];

  // Build master result — prefer rights_holders join, fall back to direct song fields
  const masterHolder = bestMatch.label?.name || bestMatch.master_owner;
  const master: OwnershipResult | null = masterHolder
    ? {
        holder: masterHolder,
        administrator: bestMatch.label?.administrator,
        type: "master",
        confidence: bestMatch.confidence_score || 60,
        source: "internal",
        contactName: bestMatch.master_contact || undefined,
        email: bestMatch.label?.email || bestMatch.master_email || undefined,
        phone: bestMatch.label?.phone,
        address: bestMatch.label?.address,
        department: bestMatch.label?.department || bestMatch.master_contact || undefined,
        avgFee: bestMatch.label?.avg_fee_master,
        avgResponseWeeks: bestMatch.label?.avg_response_weeks,
        noSamplePolicy: bestMatch.label?.no_sample_policy,
        deceased: bestMatch.label?.deceased,
        estateContact: bestMatch.label?.estate_contact,
        lastVerified: bestMatch.label?.contact_last_verified,
      }
    : null;

  // Build publishing result — prefer rights_holders join, fall back to direct song fields
  const pubHolder = bestMatch.publisher?.name || bestMatch.publisher_name;
  const publishing: OwnershipResult | null = pubHolder
    ? {
        holder: pubHolder,
        administrator: bestMatch.publisher?.administrator || bestMatch.publisher_admin || undefined,
        type: "publishing",
        confidence: bestMatch.confidence_score || 60,
        source: "internal",
        email: bestMatch.publisher?.email || bestMatch.publisher_contact || undefined,
        phone: bestMatch.publisher?.phone,
        address: bestMatch.publisher?.address,
        department: bestMatch.publisher?.department,
        writers: bestMatch.writers,
        pro: bestMatch.pro,
        proId: bestMatch.pro_id,
        avgFee: bestMatch.publisher?.avg_fee_publishing,
        avgResponseWeeks: bestMatch.publisher?.avg_response_weeks,
        noSamplePolicy: bestMatch.publisher?.no_sample_policy,
        deceased: bestMatch.publisher?.deceased,
        estateContact: bestMatch.publisher?.estate_contact,
        lastVerified: bestMatch.publisher?.contact_last_verified,
      }
    : null;

  return {
    master,
    publishing,
    isProductionLibrary: bestMatch.is_production_library || false,
    libraryName: bestMatch.library_name,
    flatBuyoutEligible: bestMatch.flat_buyout_eligible || false,
  };
}
