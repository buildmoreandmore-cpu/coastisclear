import Anthropic from "@anthropic-ai/sdk";

function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  return new Anthropic();
}

interface OwnershipContext {
  songTitle: string;
  artist: string;
  partialData?: {
    masterHolder?: string;
    publishingHolder?: string;
    writers?: string[];
    label?: string;
    publisher?: string;
  };
}

interface OwnershipInference {
  master: {
    holder: string;
    label?: string;
    confidence: "high" | "medium" | "low";
    reasoning: string;
  };
  publishing: {
    holder: string;
    publisher?: string;
    writers?: string[];
    confidence: "high" | "medium" | "low";
    reasoning: string;
  };
}

export async function inferOwnership(
  context: OwnershipContext
): Promise<OwnershipInference | null> {
  const client = getClient();
  if (!client) return null;

  try {
    const partialInfo = context.partialData
      ? `\nPartial data already found:\n${JSON.stringify(context.partialData, null, 2)}`
      : "";

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are a music industry rights analyst. Given the following song information, infer the most likely master recording owner (label) and publishing rights holder (publisher).

Song: "${context.songTitle}" by ${context.artist}
${partialInfo}

Return ONLY valid JSON in this exact format:
{
  "master": {
    "holder": "Label name",
    "label": "Specific label imprint if known",
    "confidence": "high" or "medium" or "low",
    "reasoning": "Brief explanation"
  },
  "publishing": {
    "holder": "Publisher name",
    "publisher": "Specific publishing entity",
    "writers": ["Writer 1", "Writer 2"],
    "confidence": "high" or "medium" or "low",
    "reasoning": "Brief explanation"
  }
}

Base your inference on known industry relationships, catalog ownership history, and public knowledge about this artist's deals. If you're unsure, say so in the reasoning and set confidence to "low".`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    return JSON.parse(jsonMatch[0]) as OwnershipInference;
  } catch {
    console.error("Claude inference failed");
    return null;
  }
}

interface LetterContext {
  newSongTitle: string;
  sampledSongTitle: string;
  originalArtist: string;
  sampleUseDescription?: string;
  originalTimingStart?: string;
  originalTimingEnd?: string;
  newTimingStart?: string;
  newTimingEnd?: string;
  intendedUse: string;
  releaseContext?: string;
  distributorName?: string;
  rightsType: "master" | "publishing";
  holderName: string;
  contactName?: string;
  department?: string;
  writers?: string[];
  publisher?: string;
  administrator?: string;
}

function generateDemoLetter(context: LetterContext): string {
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const contactLine = context.contactName
    ? `${context.contactName}\n${context.department || "Sample Licensing"}\n${context.holderName}`
    : `Sample Licensing Department\n${context.holderName}`;
  const writersLine = context.writers?.length ? `\nWritten by: ${context.writers.join(", ")}` : "";
  const publisherLine = context.publisher ? `\nPublisher: ${context.publisher}` : "";
  const adminLine = context.administrator ? ` (administered by ${context.administrator})` : "";
  const timingLine = context.originalTimingStart && context.originalTimingEnd
    ? `The portion sampled runs from approximately ${context.originalTimingStart} to ${context.originalTimingEnd} in the original recording.`
    : "";
  const newTimingLine = context.newTimingStart && context.newTimingEnd
    ? ` In the new composition, the sample appears from ${context.newTimingStart} to ${context.newTimingEnd}.`
    : "";
  const useLine = context.sampleUseDescription || "";
  const distLine = context.distributorName ? ` through ${context.distributorName}` : "";

  return `${date}

${contactLine}

RE: Sample Clearance Request — ${context.rightsType === "master" ? "Master Recording" : "Publishing/Composition"} Rights

Dear ${context.contactName || "Licensing Department"},

I am writing to formally request clearance for the use of a sample from "${context.sampledSongTitle}" by ${context.originalArtist} in a new composition titled "${context.newSongTitle}" by [ARTIST NAME].${writersLine}${publisherLine}${adminLine}

${timingLine}${newTimingLine}${useLine ? ` The sample is used as follows: ${useLine}` : ""}

The new track is intended for ${context.intendedUse.toLowerCase()} release${context.releaseContext ? ` (${context.releaseContext})` : ""}${distLine}. The anticipated release date is [RELEASE DATE].

We are requesting a quote for the ${context.rightsType === "master" ? "master use" : "mechanical and synchronization"} license for this sample. We are open to discussing terms including flat fee, royalty participation, or a combination thereof, and are prepared to negotiate in good faith.

Please let us know your standard clearance terms, including any applicable fees, royalty splits, credit requirements, and territory/term restrictions.

We appreciate your time and look forward to your response. Please feel free to reach out with any questions.

Respectfully,

[ARTIST NAME]
[ATTORNEY NAME]
[EMAIL]
[PHONE]`;
}

export async function generateLetter(context: LetterContext): Promise<string> {
  const client = getClient();
  if (!client) {
    return generateDemoLetter(context);
  }

  const timingInfo =
    context.originalTimingStart && context.originalTimingEnd
      ? `\nSample timing in original: ${context.originalTimingStart} – ${context.originalTimingEnd}`
      : "";
  const newTimingInfo =
    context.newTimingStart && context.newTimingEnd
      ? `\nSample appears in new track: ${context.newTimingStart} – ${context.newTimingEnd}`
      : "";
  const useDesc = context.sampleUseDescription
    ? `\nSample use description: ${context.sampleUseDescription}`
    : "";

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are a music industry clearance specialist. Draft a professional sample clearance request letter for the ${context.rightsType} rights.

Artist's new song: "${context.newSongTitle}"
Original track sampled: "${context.sampledSongTitle}" by ${context.originalArtist}
${context.writers?.length ? `Writers: ${context.writers.join(", ")}` : ""}
${context.publisher ? `Publisher: ${context.publisher}` : ""}
${context.administrator ? `Administered by: ${context.administrator}` : ""}
Rights holder (${context.rightsType}): ${context.holderName}
${context.contactName ? `Contact: ${context.contactName} at ${context.department || "Licensing"}` : ""}
Intended use: ${context.intendedUse}
${context.releaseContext ? `Release context: ${context.releaseContext}` : ""}
${context.distributorName ? `Distributor: ${context.distributorName}` : ""}
${timingInfo}${newTimingInfo}${useDesc}

The letter should:
1. Be addressed to ${context.contactName || "the licensing department"} at ${context.department || "Sample Licensing"}
2. Identify the original work precisely using any timing data provided
3. Describe the intended use clearly and honestly
4. Note the planned release context and distributor if provided
5. Request a quote or clearance terms
6. Express willingness to negotiate in good faith
7. Be professional but conversational — music industry tone
8. Be under 350 words
9. Leave placeholders for: [ARTIST NAME], [RELEASE DATE], [LABEL/DISTRIBUTOR], [ATTORNEY NAME]

Output the letter only. No preamble. No explanation.`,
      },
    ],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}
