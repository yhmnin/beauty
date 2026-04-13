import type { DiscoveredItem } from "@/lib/discovery/sources";

/**
 * Aesthetic quality filter for discovered content.
 * Filters and ranks results by quality signals without requiring
 * an additional Vision API call (cost-efficient).
 */

interface QualitySignals {
  sourceAuthority: number;
  hasCreator: number;
  hasYear: number;
  titleQuality: number;
  imageUrlQuality: number;
}

const SOURCE_AUTHORITY: Record<string, number> = {
  "Victoria & Albert Museum": 0.95,
  Rijksmuseum: 0.95,
  "Wikimedia Commons": 0.7,
  "MoMA": 0.95,
  "archdaily.com": 0.85,
  "dezeen.com": 0.85,
  "designboom.com": 0.8,
  "metropolismag.com": 0.8,
  "wallpaper.com": 0.8,
  "pinterest.com": 0.4,
  "flickr.com": 0.5,
  "reddit.com": 0.3,
  "tumblr.com": 0.35,
};

function getSourceAuthority(sourceName: string): number {
  const lower = sourceName.toLowerCase();
  for (const [key, score] of Object.entries(SOURCE_AUTHORITY)) {
    if (lower.includes(key.toLowerCase())) return score;
  }
  return 0.5;
}

function assessTitleQuality(title: string): number {
  if (!title || title.length < 3) return 0;
  if (title.length > 200) return 0.2; // Probably garbage
  if (/^IMG_|^DSC_|^DSCF|^P\d{4}|^Screenshot/i.test(title)) return 0.1;
  if (/\d{3,}x\d{3,}/.test(title)) return 0.1; // Dimensions in title
  return Math.min(1, title.length / 50) * 0.8 + 0.2;
}

function assessImageUrl(url: string): number {
  const lower = url.toLowerCase();
  // Prefer high-resolution indicators
  if (/\/full\/|\/600,|\/800,|=s600|=s800/.test(lower)) return 0.9;
  // Avoid thumbnails
  if (/thumb|small|tiny|icon|avatar|logo/i.test(lower)) return 0.3;
  // Avoid stock photo watermarks
  if (/shutterstock|istock|gettyimages|123rf|depositphotos/.test(lower)) return 0.1;
  return 0.6;
}

export function scoreItem(item: DiscoveredItem): number {
  const signals: QualitySignals = {
    sourceAuthority: getSourceAuthority(item.sourceName),
    hasCreator: item.creator ? 0.9 : 0.3,
    hasYear: item.year ? 0.8 : 0.4,
    titleQuality: assessTitleQuality(item.title),
    imageUrlQuality: assessImageUrl(item.imageUrl),
  };

  return (
    signals.sourceAuthority * 0.35 +
    signals.hasCreator * 0.2 +
    signals.hasYear * 0.1 +
    signals.titleQuality * 0.15 +
    signals.imageUrlQuality * 0.2
  );
}

export function filterAndRank(
  items: DiscoveredItem[],
  minScore = 0.35,
  limit = 8
): DiscoveredItem[] {
  const scored = items.map((item) => ({
    item,
    aestheticScore: scoreItem(item),
  }));

  return scored
    .filter((s) => s.aestheticScore >= minScore)
    .sort((a, b) => b.aestheticScore - a.aestheticScore)
    .slice(0, limit)
    .map((s) => ({ ...s.item, score: s.aestheticScore }));
}
