import OpenAI from "openai";
import type { DiscoveredItem } from "@/lib/discovery/sources";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ProvenanceData {
  creator: string;
  title: string;
  year: string;
  medium: string;
  location: string;
  source: string;
  sourceUrl: string;
  culturalContext: string;
  credit: string;
  narrativeCaption: string;
}

export async function generateProvenance(
  item: DiscoveredItem
): Promise<ProvenanceData> {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your_openai_api_key_here") {
    return fallbackProvenance(item);
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an art and design provenance researcher. Given an image and its source metadata, identify:
- creator (artist/designer/architect name)
- title (of the work)
- year (creation date)
- medium (materials/technique)
- location (where the work exists)
- culturalContext (design movement, school, or tradition)
- credit (photo credit line)
- narrativeCaption (a 1-2 sentence poetic description suitable for a design curator)

Respond ONLY with valid JSON. If uncertain, provide best guess with (attributed) suffix.`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Identify this design/art work:
Title from source: "${item.title}"
Source: ${item.sourceName} (${item.sourceUrl})
Description: "${item.description}"
Creator hint: "${item.creator || "unknown"}"
Year hint: "${item.year || "unknown"}"`,
            },
            {
              type: "image_url",
              image_url: { url: item.imageUrl, detail: "low" },
            },
          ],
        },
      ],
      max_tokens: 400,
      temperature: 0.3,
    });

    const text = response.choices[0]?.message?.content || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        creator: parsed.creator || item.creator || "",
        title: parsed.title || item.title,
        year: parsed.year || item.year || "",
        medium: parsed.medium || "",
        location: parsed.location || "",
        source: item.sourceName,
        sourceUrl: item.sourceUrl,
        culturalContext: parsed.culturalContext || "",
        credit: parsed.credit || item.credit || `${item.sourceName}`,
        narrativeCaption: parsed.narrativeCaption || item.description,
      };
    }
  } catch (e) {
    console.error("Provenance generation failed:", e);
  }

  return fallbackProvenance(item);
}

function fallbackProvenance(item: DiscoveredItem): ProvenanceData {
  return {
    creator: item.creator || "",
    title: item.title,
    year: item.year || "",
    medium: "",
    location: "",
    source: item.sourceName,
    sourceUrl: item.sourceUrl,
    culturalContext: "",
    credit: item.credit || item.sourceName,
    narrativeCaption: item.description,
  };
}

export async function batchProvenance(
  items: DiscoveredItem[],
  maxParallel = 3
): Promise<Map<string, ProvenanceData>> {
  const results = new Map<string, ProvenanceData>();

  // Process in batches to avoid rate limits
  for (let i = 0; i < items.length; i += maxParallel) {
    const batch = items.slice(i, i + maxParallel);
    const provenances = await Promise.allSettled(
      batch.map((item) => generateProvenance(item))
    );

    batch.forEach((item, j) => {
      const result = provenances[j];
      results.set(
        item.id,
        result.status === "fulfilled" ? result.value : fallbackProvenance(item)
      );
    });
  }

  return results;
}
