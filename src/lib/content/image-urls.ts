/**
 * Image URL resolution system.
 * 
 * V1.8: Dynamic resolution replaces static Wikimedia URLs.
 * 
 * Resolution chain:
 *   1. Dynamic resolver cache (from /api/resolve-image)
 *   2. Static fallback map (known-good URLs)
 *   3. Image proxy through /api/image?url=...
 *   4. Placeholder gradient (last resort)
 */

import { getCachedImage, type ResolvedImage } from "@/lib/discovery/image-resolver";

interface ImageEntry {
  url: string;
  source: string;
  credit: string;
}

// Static fallback — only for URLs we've manually verified are stable
const STATIC_FALLBACKS: Record<string, ImageEntry> = {
  "sugiura-kohei": {
    url: "https://sugiurakohei.musabi.ac.jp/common/images/howto/cap001.jpg",
    source: "Musashino Art University — Design Cosmos Archive",
    credit: "© SUGIURA Kohei / Musashino Art University Museum & Library",
  },
};

// Dynamic resolved image URLs (populated at runtime)
const resolvedCache = new Map<string, ImageEntry>();

/**
 * Get image URL for a content item.
 * Tries: dynamic cache → static fallback → null
 */
export function getImageUrl(id: string): string | null {
  // 1. Check runtime resolved cache
  const dynamicResult = getCachedImage(id);
  if (dynamicResult) return dynamicResult.url;

  // 2. Check local resolved cache
  const localCached = resolvedCache.get(id);
  if (localCached) return localCached.url;

  // 3. Check static fallbacks
  const staticEntry = STATIC_FALLBACKS[id];
  if (staticEntry) return staticEntry.url;

  return null;
}

/**
 * Get full image metadata (url + source + credit)
 */
export function getImageMeta(id: string): ImageEntry | undefined {
  const dynamicResult = getCachedImage(id);
  if (dynamicResult) {
    return {
      url: dynamicResult.url,
      source: dynamicResult.source,
      credit: dynamicResult.credit,
    };
  }

  const localCached = resolvedCache.get(id);
  if (localCached) return localCached;

  return STATIC_FALLBACKS[id];
}

/**
 * Store a resolved image in local cache
 */
export function cacheResolvedImage(id: string, entry: ImageEntry) {
  resolvedCache.set(id, entry);
}

/**
 * Legacy compatibility: REAL_IMAGES map
 * Now returns empty — images are resolved dynamically
 */
export const REAL_IMAGES: Record<string, string> = new Proxy(
  {} as Record<string, string>,
  {
    get(_target, prop: string) {
      return getImageUrl(prop) || undefined;
    },
  }
);

export function getAllImageMeta(): Record<string, ImageEntry> {
  const all: Record<string, ImageEntry> = { ...STATIC_FALLBACKS };
  for (const [k, v] of resolvedCache) {
    all[k] = v;
  }
  return all;
}
