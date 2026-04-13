import { NextRequest, NextResponse } from "next/server";
import { discoverContent } from "@/lib/discovery/sources";
import { filterAndRank } from "@/lib/ai/aesthetic-filter";
import { generateProvenance } from "@/lib/ai/provenance";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, sources, mediaType, limit, withProvenance } = body;

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Step 1: Multi-source discovery
    const raw = await discoverContent({
      query,
      sources: sources || ["wikimedia", "vanda", "web"],
      mediaType: mediaType || "all",
      limit: (limit || 12) * 2, // Fetch extra for filtering
      serperKey: process.env.SERPER_API_KEY,
      rijksKey: process.env.RIJKS_API_KEY,
    });

    // Step 2: Aesthetic quality filter
    const filtered = filterAndRank(raw, 0.35, limit || 12);

    // Step 3: Provenance for top results (optional, costs API calls)
    let items = filtered;
    if (withProvenance && filtered.length > 0) {
      const topItems = filtered.slice(0, 3);
      const provenances = await Promise.allSettled(
        topItems.map((item) => generateProvenance(item))
      );

      items = filtered.map((item, i) => {
        if (i < topItems.length && provenances[i].status === "fulfilled") {
          const prov = provenances[i].value;
          return {
            ...item,
            title: prov.title || item.title,
            creator: prov.creator || item.creator,
            year: prov.year || item.year,
            credit: prov.credit || item.credit,
            description: prov.narrativeCaption || item.description,
          };
        }
        return item;
      });
    }

    return NextResponse.json({
      query,
      count: items.length,
      items,
    });
  } catch (error) {
    console.error("Discovery error:", error);
    return NextResponse.json({ error: "Discovery failed" }, { status: 500 });
  }
}
