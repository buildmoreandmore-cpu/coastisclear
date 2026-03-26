import type { OwnershipResult } from "@/types";

interface DemoRecord {
  songTitle: string;
  artist: string;
  master: OwnershipResult;
  publishing: OwnershipResult;
  isProductionLibrary: boolean;
  libraryName?: string;
  flatBuyoutEligible: boolean;
}

const DEMO_RECORDS: DemoRecord[] = [
  {
    songTitle: "dawn mist",
    artist: "stringtonics",
    isProductionLibrary: true,
    libraryName: "APM Music",
    flatBuyoutEligible: false,
    master: {
      holder: "Peer Music",
      type: "master",
      confidence: 95,
      source: "internal",
      contactName: "Mark Spier",
      email: "mspier@peermusic.com",
      department: "Licensing",
      avgFee: "$2,500 flat",
      avgResponseWeeks: "1–3 weeks",
      lastVerified: "2020-04-09",
      isProductionLibrary: true,
      libraryName: "APM Music",
    },
    publishing: {
      holder: "Bruton Music Ltd",
      administrator: "APM Music",
      type: "publishing",
      confidence: 98,
      source: "internal",
      contactName: "C. Marks",
      email: "cmarks@apmmusic.com",
      phone: "(323) 461-3211",
      address: "6255 Sunset Blvd, Suite 900, Hollywood, CA 90028",
      department: "Licensing",
      writers: [
        { name: "Barry Forgie", pro: "ASCAP", approval_required: true },
      ],
      pro: "ASCAP",
      avgFee: "$2,500 flat",
      avgResponseWeeks: "1–3 weeks",
      lastVerified: "2020-04-10",
      isProductionLibrary: true,
      libraryName: "APM Music",
    },
  },
  {
    songTitle: "witches tears",
    artist: "tangoman",
    isProductionLibrary: true,
    libraryName: "APM Music",
    flatBuyoutEligible: true,
    master: {
      holder: "APM Music",
      type: "master",
      confidence: 85,
      source: "internal",
      email: "licensing@apmmusic.com",
      phone: "(323) 461-3211",
      department: "Licensing",
      avgFee: "Flat buyout negotiable — $500–$3,000",
      avgResponseWeeks: "1–3 weeks",
      isProductionLibrary: true,
      libraryName: "APM Music",
    },
    publishing: {
      holder: "APM Music",
      type: "publishing",
      confidence: 85,
      source: "internal",
      email: "licensing@apmmusic.com",
      phone: "(323) 461-3211",
      department: "Licensing",
      avgFee: "Flat buyout negotiable — $500–$3,000",
      avgResponseWeeks: "1–3 weeks",
      isProductionLibrary: true,
      libraryName: "APM Music",
    },
  },
  {
    songTitle: "could it be",
    artist: "tevin campbell",
    isProductionLibrary: false,
    flatBuyoutEligible: false,
    master: {
      holder: "Warner Records",
      type: "master",
      confidence: 88,
      source: "internal",
      email: "sampleclearance@wmg.com",
      department: "Sample Licensing",
      address: "1633 Broadway, New York, NY 10019",
      avgFee: "10–20% gross royalty",
      avgResponseWeeks: "6–10 weeks",
    },
    publishing: {
      holder: "Sony Music Publishing",
      type: "publishing",
      confidence: 88,
      source: "internal",
      email: "licensing@sonymusicpub.com",
      department: "Sample Licensing",
      writers: [
        { name: "Tevin Campbell", approval_required: true },
        { name: "Babyface", pro: "ASCAP", approval_required: true },
      ],
      avgFee: "$2,500–$5,000 + 50% publishing stake",
      avgResponseWeeks: "4–8 weeks",
    },
  },
  {
    songTitle: "quiet reflection",
    artist: "dick walter",
    isProductionLibrary: true,
    libraryName: "APM Music",
    flatBuyoutEligible: false,
    master: {
      holder: "APM Music",
      type: "master",
      confidence: 98,
      source: "internal",
      email: "licensing@apmmusic.com",
      phone: "(323) 461-3211",
      address: "6255 Sunset Blvd, Suite 900, Hollywood, CA 90028",
      department: "Licensing",
      avgFee: "$1,500 recoupable advance",
      avgResponseWeeks: "1–3 weeks",
      isProductionLibrary: true,
      libraryName: "APM Music",
    },
    publishing: {
      holder: "APM Music",
      type: "publishing",
      confidence: 98,
      source: "internal",
      contactName: "Tia Sommer",
      email: "Tiasommer@apmmusic.com",
      phone: "(323) 461-3211",
      address: "6255 Sunset Blvd, Suite 900, Hollywood, CA 90028",
      department: "Licensing",
      writers: [
        { name: "Dick Walter", approval_required: true },
        { name: "Eugene Cines", approval_required: true },
      ],
      avgFee: "$1,500 recoupable + 50% interest in new composition",
      avgResponseWeeks: "1–3 weeks",
      isProductionLibrary: true,
      libraryName: "APM Music",
    },
  },
  {
    songTitle: "think",
    artist: "james brown",
    isProductionLibrary: false,
    flatBuyoutEligible: false,
    master: {
      holder: "Universal Music Group",
      type: "master",
      confidence: 90,
      source: "internal",
      email: "sampleclearance@umusic.com",
      department: "Sample Licensing",
      avgFee: "$5,000–$25,000 + points",
      avgResponseWeeks: "6–10 weeks",
    },
    publishing: {
      holder: "Warner Chappell Music",
      type: "publishing",
      confidence: 85,
      source: "internal",
      email: "licensing@warnerchappell.com",
      department: "Sample Licensing & Clearance",
      address: "75 Rockefeller Plaza, New York, NY 10019",
      writers: [
        { name: "James Brown", deceased: true, approval_required: true },
      ],
      pro: "BMI",
      avgFee: "3–8% of publishing royalties",
      avgResponseWeeks: "4–8 weeks",
      deceased: true,
      estateContact: "James Brown Estate",
    },
  },
  {
    songTitle: "between the sheets",
    artist: "the isley brothers",
    isProductionLibrary: false,
    flatBuyoutEligible: false,
    master: {
      holder: "Universal Music Group",
      type: "master",
      confidence: 85,
      source: "internal",
      email: "sampleclearance@umusic.com",
      department: "Sample Licensing",
      avgFee: "$5,000–$25,000 + points",
      avgResponseWeeks: "6–10 weeks",
    },
    publishing: {
      holder: "Sony Music Publishing",
      type: "publishing",
      confidence: 80,
      source: "internal",
      email: "licensing@sonymusicpub.com",
      department: "Sample Licensing",
      writers: [
        { name: "Ronald Isley", pro: "ASCAP", approval_required: true },
        { name: "O'Kelly Isley", pro: "ASCAP", deceased: true, approval_required: true },
        { name: "Rudolph Isley", pro: "ASCAP", approval_required: true },
        { name: "Chris Jasper", pro: "ASCAP", approval_required: true },
        { name: "Marvin Isley", pro: "ASCAP", deceased: true, approval_required: true },
        { name: "Ernie Isley", pro: "ASCAP", approval_required: true },
      ],
      avgFee: "$2,500–$5,000 + 50% publishing",
      avgResponseWeeks: "4–8 weeks",
    },
  },
  {
    songTitle: "impeach the president",
    artist: "the honeydrippers",
    isProductionLibrary: false,
    flatBuyoutEligible: false,
    master: {
      holder: "Alaga Records",
      type: "master",
      confidence: 70,
      source: "internal",
      department: "Licensing",
      avgFee: "$3,000–$10,000",
      avgResponseWeeks: "4–8 weeks",
    },
    publishing: {
      holder: "Primary Wave Music",
      type: "publishing",
      confidence: 65,
      source: "internal",
      department: "Licensing",
      writers: [
        { name: "Roy Charles Hammond", approval_required: true },
      ],
      avgFee: "$2,500–$5,000 + negotiable",
      avgResponseWeeks: "4–8 weeks",
    },
  },
];

export function lookupDemoData(
  songTitle: string,
  artist: string
): DemoRecord | null {
  const titleLower = songTitle.toLowerCase().trim();
  const artistLower = artist.toLowerCase().trim();

  // Try exact match first
  let match = DEMO_RECORDS.find(
    (r) => r.songTitle === titleLower && r.artist === artistLower
  );

  // Try partial title match
  if (!match) {
    match = DEMO_RECORDS.find(
      (r) =>
        titleLower.includes(r.songTitle) || r.songTitle.includes(titleLower)
    );
  }

  // Try partial artist match
  if (!match) {
    match = DEMO_RECORDS.find(
      (r) =>
        artistLower.includes(r.artist) || r.artist.includes(artistLower)
    );
  }

  return match || null;
}
