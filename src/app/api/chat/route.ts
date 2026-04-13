import { NextRequest, NextResponse } from "next/server";
import { generateAestheticResponse } from "@/lib/ai/aesthetic-agent";
import { discoverContent } from "@/lib/discovery/sources";
import { filterAndRank } from "@/lib/ai/aesthetic-filter";
import type { ConversationMessage } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history } = body as {
      message: string;
      history?: ConversationMessage[];
    };

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your_openai_api_key_here") {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // Run local AI response and web discovery in parallel
    const [response, webResults] = await Promise.all([
      generateAestheticResponse(message, history || []),
      discoverContent({
        query: message,
        sources: ["wikimedia", "vanda", "web"],
        limit: 16,
        serperKey: process.env.SERPER_API_KEY,
        rijksKey: process.env.RIJKS_API_KEY,
      }).catch(() => []),
    ]);

    // Merge: local curated results + web discoveries
    const webFiltered = filterAndRank(Array.isArray(webResults) ? webResults : [], 0.35, 6);

    const discoveredContent = webFiltered.map((d) => ({
      id: d.id,
      title: d.title,
      description: d.description || "",
      imageUrl: d.imageUrl,
      category: "discovered",
      creator: d.creator || d.sourceName,
      year: d.year || "",
      tags: [d.sourceName],
      mediaType: "image" as const,
      sourceUrl: d.sourceUrl,
    }));

    return NextResponse.json({
      ...response,
      relatedContent: [
        ...(response.relatedContent || []),
        ...discoveredContent,
      ],
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
