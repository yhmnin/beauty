/**
 * Taste-aware discovery: uses the user's taste profile to refine
 * and personalize web discovery queries.
 */

import type { TasteProfileData, TasteInterest } from "@/lib/ai/taste-profile";
import { discoverContent, type DiscoveredItem, type DiscoveryOptions } from "./sources";
import { filterAndRank } from "@/lib/ai/aesthetic-filter";

export function buildTasteQuery(
  baseQuery: string,
  profile: TasteProfileData
): string {
  const topInterests = profile.interests
    .slice(0, 3)
    .map((i) => i.label)
    .filter((label) => !baseQuery.toLowerCase().includes(label.toLowerCase()));

  if (topInterests.length === 0) return baseQuery;

  // Add the user's top aesthetic affinities to refine the query
  return `${baseQuery} ${topInterests.join(" ")}`;
}

export function selectSourcesForTaste(
  profile: TasteProfileData
): ("wikimedia" | "vanda" | "rijks" | "web")[] {
  const sources: ("wikimedia" | "vanda" | "rijks" | "web")[] = ["wikimedia", "web"];

  const hasEuropean = profile.interests.some((i) =>
    ["swiss", "bauhaus", "scandinavian", "dutch", "italian", "belgian"].some((k) =>
      i.label.toLowerCase().includes(k)
    )
  );

  const hasClassical = profile.interests.some((i) =>
    ["ceramics", "painting", "sculpture", "classical"].some((k) =>
      i.label.toLowerCase().includes(k)
    )
  );

  if (hasEuropean || hasClassical) {
    sources.push("vanda", "rijks");
  } else {
    sources.push("vanda");
  }

  return sources;
}

export function boostByTaste(
  items: DiscoveredItem[],
  profile: TasteProfileData
): DiscoveredItem[] {
  if (profile.interests.length === 0) return items;

  return items.map((item) => {
    let boost = 0;
    const searchableText = `${item.title} ${item.description} ${item.creator} ${item.sourceName}`.toLowerCase();

    for (const interest of profile.interests) {
      if (searchableText.includes(interest.label.toLowerCase())) {
        boost += interest.intensity * 0.15;
      }
    }

    return { ...item, score: item.score + boost };
  }).sort((a, b) => b.score - a.score);
}

export async function tasteAwareDiscover(
  query: string,
  profile: TasteProfileData,
  opts?: Partial<DiscoveryOptions>
): Promise<DiscoveredItem[]> {
  const refinedQuery = buildTasteQuery(query, profile);
  const sources = selectSourcesForTaste(profile);

  const raw = await discoverContent({
    query: refinedQuery,
    sources,
    limit: 20,
    ...opts,
  });

  const filtered = filterAndRank(raw, 0.3, 16);
  const boosted = boostByTaste(filtered, profile);

  return boosted.slice(0, opts?.limit || 10);
}

export function extractInterestsFromDiscovery(
  items: DiscoveredItem[]
): { label: string; intensity: number }[] {
  const freq = new Map<string, number>();

  for (const item of items) {
    if (item.creator) {
      freq.set(item.creator, (freq.get(item.creator) || 0) + 1);
    }
    const words = `${item.title} ${item.description}`.toLowerCase().split(/\s+/);
    const designTerms = words.filter((w) =>
      w.length > 4 && !["image", "photo", "commons", "wikimedia", "museum", "https", "about"].includes(w)
    );
    for (const term of designTerms.slice(0, 3)) {
      freq.set(term, (freq.get(term) || 0) + 0.3);
    }
  }

  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, count]) => ({
      label,
      intensity: Math.min(1, count / items.length),
    }));
}
