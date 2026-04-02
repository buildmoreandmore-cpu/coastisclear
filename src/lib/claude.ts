import OpenAI from "openai";

function getClient(): OpenAI | null {
  if (!process.env.MINIMAX_API_KEY) return null;
  return new OpenAI({
    apiKey: process.env.MINIMAX_API_KEY,
    baseURL: "https://api.minimax.io/v1",
  });
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

    const response = await client.chat.completions.create({
      model: "MiniMax-M2",
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

    let text = response.choices[0]?.message?.content || "";
    // Strip <think> blocks (closed or unclosed if model hit token limit)
    text = text.replace(/<think>[\s\S]*?<\/think>\s*/g, "").trim();
    text = text.replace(/<think>[\s\S]*/g, "").trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    return JSON.parse(jsonMatch[0]) as OwnershipInference;
  } catch (e) {
    console.error("MiniMax inference failed:", e);
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
  const writersLine = context.writers?.length ? ` (writers: ${context.writers.join(", ")})` : "";
  const timingLine = context.originalTimingStart && context.originalTimingEnd
    ? `\n\nThe sample is taken from approximately ${context.originalTimingStart} to ${context.originalTimingEnd} in the original recording.`
    : "";
  const newTimingLine = context.newTimingStart && context.newTimingEnd
    ? ` In the new composition, the sample appears from ${context.newTimingStart} to ${context.newTimingEnd}.`
    : "";
  const distLine = context.distributorName ? ` through ${context.distributorName}` : "";
  const releaseType = context.releaseContext === "self_released" ? "self-released" : (context.releaseContext || context.intendedUse.toLowerCase());

  return `${date}

${contactLine}
[Address]

Dear ${context.contactName || "Licensing Department"},

I am writing to request permission to sample the track "${context.sampledSongTitle}" by ${context.originalArtist}${writersLine} for use in the upcoming [ARTIST NAME] track titled "${context.newSongTitle}."

The sample will be used in a ${context.intendedUse.toLowerCase()} capacity, with a ${releaseType} distribution planned for [RELEASE DATE]${distLine}. This release is intended for digital platforms only.${timingLine}${newTimingLine}

We would greatly appreciate any information regarding:

- The current ${context.rightsType === "master" ? "master recording owner" : "publisher and/or rights holder"} for "${context.sampledSongTitle}" by ${context.originalArtist}
- ${context.rightsType === "master" ? "Any associated publishing rights that may need to be cleared" : "Any associated master recording rights that may need to be cleared"}
- A quote for the sample clearance or proposed terms for our use

We are committed to a fair and transparent negotiation and are open to discussing terms that reflect the scope of this project. Please let us know if you require any additional materials, such as a reference copy of our track or documentation regarding our intended use.

We look forward to your response and hope to resolve this matter promptly.

Sincerely,

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

  try {
    const response = await client.chat.completions.create({
      model: "MiniMax-M2",
      max_tokens: 2048,
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

    let text = response.choices[0]?.message?.content || "";
    // Strip any <think>...</think> blocks from the response
    text = text.replace(/<think>[\s\S]*?<\/think>\s*/g, "").trim();
    return text || generateDemoLetter(context);
  } catch {
    return generateDemoLetter(context);
  }
}
