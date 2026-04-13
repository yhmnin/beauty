/**
 * Dynamic image resolver.
 * 
 * Instead of static Wikimedia URLs that break, this module resolves images
 * dynamically by searching multiple sources and caching results.
 * 
 * Strategy (Cosmos-inspired):
 *   1. Check local cache (resolved-images.json)
 *   2. If miss: search Wikimedia Commons API for the person/work name
 *   3. If miss: search V&A Museum API
 *   4. If miss: use Google image search via Serper (if key available)
 *   5. Cache the result for future use
 */

import { searchWikimedia, searchVAndA, searchWeb } from "./sources";

export interface ResolvedImage {
  url: string;
  source: string;
  credit: string;
  resolvedAt: number;
  query: string;
}

// In-memory cache (persists for server lifetime)
const imageCache = new Map<string, ResolvedImage>();

// Search query templates for different content types
const SEARCH_QUERIES: Record<string, string> = {
  // People — search for their most iconic work
  "dieter-rams": "Braun SK4 record player Dieter Rams design",
  "tadao-ando": "Church of the Light Tadao Ando architecture interior",
  "charlotte-perriand": "Charlotte Perriand LC4 chaise longue furniture",
  "kenya-hara": "Kenya Hara MUJI design white",
  "carlo-scarpa": "Carlo Scarpa Brion Cemetery architecture detail",
  "lucie-rie": "Lucie Rie ceramic bowl pottery",
  "josef-muller-brockmann": "Josef Muller-Brockmann Musica Viva poster Swiss design",
  "axel-vervoordt": "Axel Vervoordt interior design wabi-sabi",
  "naoto-fukasawa": "Naoto Fukasawa MUJI wall mounted CD player",
  "peter-zumthor": "Peter Zumthor Therme Vals thermal bath architecture",
  "shoji-hamada": "Shoji Hamada pottery Mashiko ceramics",
  "bruno-munari": "Bruno Munari Falkland lamp design",
  "irma-boom": "Irma Boom SHV Think Book design",
  "charles-ray-eames": "Eames Lounge Chair Herman Miller design classic",
  "john-pawson": "John Pawson minimalist architecture interior",
  "kuramata-shiro": "Shiro Kuramata How High the Moon chair design",
  "yanagi-sori": "Sori Yanagi Butterfly Stool plywood design",
  "tanaka-ikko": "Ikko Tanaka Nihon Buyo poster graphic design",
  "kenzo-tange": "Kenzo Tange Yoyogi National Gymnasium Tokyo architecture",
  "sanaa": "SANAA 21st Century Museum Kanazawa glass architecture",
  "isozaki-arata": "Arata Isozaki architecture Palau Sant Jordi",
  "ando-azuma": "Toyo Ito Sendai Mediatheque architecture",
  "sugiura-kohei": "Kohei Sugiura book design Japanese typography",
  "yokoo-tadanori": "Tadanori Yokoo poster psychedelic Japanese graphic design",
  "uchida-shigeru": "Shigeru Uchida September Chair furniture design",
  "kenmochi-isamu": "Isamu Kenmochi rattan round chair Japanese",
  "hara-hiromu": "Hiromu Hara NIPPON magazine graphic design",
  "awazu-kiyoshi": "Kiyoshi Awazu poster graphic design Japanese",
  "nagai-kazumasa": "Kazumasa Nagai poster animal illustration design",
  "kikuchi-nobuyoshi": "Nobuyoshi Kikuchi book jacket design Japanese",

  // Works
  "braun-sk4": "Braun SK4 Phonosuper record player Snow White Coffin",
  "church-of-the-light": "Church of the Light Tadao Ando cross concrete interior",
  "therme-vals": "Therme Vals Peter Zumthor indoor pool stone",
  "eames-lounge": "Eames Lounge Chair 670 rosewood leather Herman Miller",
  "brion-cemetery": "Brion Cemetery Carlo Scarpa San Vito architecture",
  "butterfly-stool": "Sori Yanagi Butterfly Stool Tendo Mokko plywood",
  "miss-blanche": "Shiro Kuramata Miss Blanche chair acrylic roses",
  "how-high-the-moon": "Shiro Kuramata How High the Moon steel mesh chair",
  "nihon-buyo-poster": "Ikko Tanaka Nihon Buyo poster geometric geisha",
  "yoyogi-gymnasium": "Yoyogi National Gymnasium Kenzo Tange Tokyo Olympics 1964",
  "sendai-mediatheque": "Sendai Mediatheque Toyo Ito transparent architecture",
  "21c-museum-kanazawa": "21st Century Museum Contemporary Art Kanazawa SANAA glass circle",
  "muji-cd-player": "MUJI wall mounted CD player Naoto Fukasawa",
  "falkland-lamp": "Bruno Munari Falkland lamp Danese",
  "606-shelving": "606 Universal Shelving System Dieter Rams Vitsoe",
  "musica-viva-poster": "Musica Viva poster Josef Muller-Brockmann Zurich",
  "shv-think-book": "Irma Boom SHV Think Book 2136 pages",

  // Movements
  "bauhaus": "Bauhaus Dessau building Walter Gropius architecture",
  "mingei": "Japanese Mingei folk craft pottery ceramics",
  "swiss-style": "Swiss International Typographic Style poster grid",
  "wabi-sabi": "Wabi-sabi Japanese aesthetics kintsugi repair",
  "mid-century-modern": "Mid-century modern furniture Eames design",

  // Events
  "expo-70": "Expo 70 Osaka Tower of the Sun Taro Okamoto",
  "milan-salone": "Salone del Mobile Milan furniture fair",
  "bauhaus-founding": "Bauhaus school Weimar 1919 founding building",
};

export async function resolveImage(
  id: string,
  fallbackQuery?: string
): Promise<ResolvedImage | null> {
  // 1. Check cache
  const cached = imageCache.get(id);
  if (cached && Date.now() - cached.resolvedAt < 24 * 60 * 60 * 1000) {
    return cached;
  }

  const query = SEARCH_QUERIES[id] || fallbackQuery || id.replace(/-/g, " ");

  // 2. Search Wikimedia Commons
  try {
    const wikiResults = await searchWikimedia(query, 3);
    const good = wikiResults.find(
      (r) => r.imageUrl && !r.imageUrl.includes(".svg") && !r.imageUrl.includes("icon")
    );
    if (good) {
      const resolved: ResolvedImage = {
        url: good.imageUrl,
        source: "Wikimedia Commons",
        credit: good.credit || "Wikimedia / CC",
        resolvedAt: Date.now(),
        query,
      };
      imageCache.set(id, resolved);
      return resolved;
    }
  } catch {}

  // 3. Search V&A Museum
  try {
    const vaResults = await searchVAndA(query, 2);
    const good = vaResults.find((r) => r.imageUrl);
    if (good) {
      const resolved: ResolvedImage = {
        url: good.imageUrl,
        source: "V&A Museum",
        credit: good.credit || "V&A Collection",
        resolvedAt: Date.now(),
        query,
      };
      imageCache.set(id, resolved);
      return resolved;
    }
  } catch {}

  // 4. Web search fallback
  try {
    const webResults = await searchWeb(query, process.env.SERPER_API_KEY || "", 3);
    const good = webResults.find((r) => r.imageUrl);
    if (good) {
      const resolved: ResolvedImage = {
        url: good.imageUrl,
        source: good.sourceName || "Web",
        credit: `Image from ${good.sourceName}`,
        resolvedAt: Date.now(),
        query,
      };
      imageCache.set(id, resolved);
      return resolved;
    }
  } catch {}

  return null;
}

export async function batchResolveImages(
  ids: string[]
): Promise<Map<string, ResolvedImage>> {
  const results = new Map<string, ResolvedImage>();

  // Process in batches of 5 to avoid rate limits
  for (let i = 0; i < ids.length; i += 5) {
    const batch = ids.slice(i, i + 5);
    const promises = batch.map(async (id) => {
      const resolved = await resolveImage(id);
      if (resolved) results.set(id, resolved);
    });
    await Promise.allSettled(promises);

    // Brief pause between batches
    if (i + 5 < ids.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  return results;
}

export function getCachedImage(id: string): ResolvedImage | undefined {
  return imageCache.get(id);
}

export function getAllCachedImages(): Record<string, ResolvedImage> {
  return Object.fromEntries(imageCache.entries());
}
