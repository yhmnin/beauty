/**
 * Multi-source discovery engine.
 * Searches the real web for design content from authoritative sources.
 */

export interface DiscoveredItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  sourceUrl: string;
  sourceName: string;
  creator?: string;
  year?: string;
  credit?: string;
  score: number;
  mediaType: "image" | "video" | "text";
  raw?: Record<string, unknown>;
}

// ── Wikimedia Commons API ──

export async function searchWikimedia(query: string, limit = 8): Promise<DiscoveredItem[]> {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: `${query} design OR architecture OR art`,
    gsrnamespace: "6", // File namespace
    gsrlimit: String(limit),
    prop: "imageinfo",
    iiprop: "url|extmetadata|size",
    iiurlwidth: "600",
    format: "json",
    origin: "*",
  });

  try {
    const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`);
    if (!res.ok) return [];
    const data = await res.json();

    const pages = data.query?.pages;
    if (!pages) return [];

    return Object.values(pages)
      .filter((p: any) => p.imageinfo?.[0]?.thumburl)
      .map((p: any, i: number) => {
        const info = p.imageinfo[0];
        const meta = info.extmetadata || {};
        return {
          id: `wiki-${p.pageid}`,
          title: cleanWikiTitle(p.title),
          description: stripHtml(meta.ImageDescription?.value || ""),
          imageUrl: info.thumburl || info.url,
          sourceUrl: info.descriptionurl || `https://commons.wikimedia.org/wiki/${p.title}`,
          sourceName: "Wikimedia Commons",
          creator: stripHtml(meta.Artist?.value || ""),
          year: meta.DateTimeOriginal?.value?.slice(0, 4) || "",
          credit: meta.Credit?.value ? stripHtml(meta.Credit?.value) : "Wikimedia Commons / CC",
          score: 0.7 - i * 0.03,
          mediaType: "image" as const,
        };
      })
      .filter((item) => item.imageUrl && !item.imageUrl.includes(".svg"));
  } catch {
    return [];
  }
}

// ── V&A Museum API ──

export async function searchVAndA(query: string, limit = 6): Promise<DiscoveredItem[]> {
  const params = new URLSearchParams({
    q: query,
    images_exist: "true",
    page_size: String(limit),
    order_by: "relevance",
  });

  try {
    const res = await fetch(`https://api.vam.ac.uk/v2/objects/search?${params}`);
    if (!res.ok) return [];
    const data = await res.json();

    return (data.records || [])
      .filter((r: any) => r._images?._iiif_image_base_url)
      .map((r: any, i: number) => ({
        id: `va-${r.systemNumber}`,
        title: r._primaryTitle || r.objectType || "Untitled",
        description: [r._primaryMaker?.name, r._primaryDate, r._primaryPlace].filter(Boolean).join(", "),
        imageUrl: `${r._images._iiif_image_base_url}/full/600,/0/default.jpg`,
        sourceUrl: `https://collections.vam.ac.uk/item/${r.systemNumber}/`,
        sourceName: "Victoria & Albert Museum",
        creator: r._primaryMaker?.name || "",
        year: r._primaryDate || "",
        credit: `V&A Museum, ${r.systemNumber}`,
        score: 0.8 - i * 0.03,
        mediaType: "image" as const,
      }));
  } catch {
    return [];
  }
}

// ── Rijksmuseum API ──

export async function searchRijksmuseum(query: string, apiKey: string, limit = 6): Promise<DiscoveredItem[]> {
  if (!apiKey) return [];

  const params = new URLSearchParams({
    key: apiKey,
    q: query,
    ps: String(limit),
    imgonly: "true",
    format: "json",
    s: "relevance",
  });

  try {
    const res = await fetch(`https://www.rijksmuseum.nl/api/en/collection?${params}`);
    if (!res.ok) return [];
    const data = await res.json();

    return (data.artObjects || [])
      .filter((o: any) => o.webImage?.url)
      .map((o: any, i: number) => ({
        id: `rijks-${o.objectNumber}`,
        title: o.title || "Untitled",
        description: o.longTitle || "",
        imageUrl: o.webImage.url.replace("=s0", "=s600"),
        sourceUrl: o.links?.web || `https://www.rijksmuseum.nl/en/collection/${o.objectNumber}`,
        sourceName: "Rijksmuseum",
        creator: o.principalOrFirstMaker || "",
        year: o.dating?.sortingDate?.toString() || "",
        credit: `Rijksmuseum, ${o.objectNumber}`,
        score: 0.75 - i * 0.03,
        mediaType: "image" as const,
      }));
  } catch {
    return [];
  }
}

// ── Web Search via Serper.dev (or fallback to direct search) ──

export async function searchWeb(query: string, apiKey: string, limit = 8): Promise<DiscoveredItem[]> {
  if (!apiKey) return searchWebFallback(query, limit);

  try {
    const res = await fetch("https://google.serper.dev/images", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: `${query} design high quality`,
        num: limit,
      }),
    });

    if (!res.ok) return searchWebFallback(query, limit);
    const data = await res.json();

    return (data.images || []).map((img: any, i: number) => ({
      id: `web-${i}-${Date.now()}`,
      title: img.title || "",
      description: img.source || "",
      imageUrl: img.imageUrl,
      sourceUrl: img.link || img.imageUrl,
      sourceName: extractDomain(img.link || ""),
      creator: "",
      year: "",
      credit: `Image from ${extractDomain(img.link || "")}`,
      score: 0.6 - i * 0.03,
      mediaType: "image" as const,
    }));
  } catch {
    return searchWebFallback(query, limit);
  }
}

async function searchWebFallback(query: string, limit: number): Promise<DiscoveredItem[]> {
  // Use Wikimedia as fallback when no Serper key
  return searchWikimedia(query, limit);
}

// ── Orchestrator: search all sources in parallel ──

export interface DiscoveryOptions {
  query: string;
  sources?: ("wikimedia" | "vanda" | "rijks" | "web")[];
  mediaType?: "image" | "video" | "text" | "all";
  limit?: number;
  serperKey?: string;
  rijksKey?: string;
}

export async function discoverContent(opts: DiscoveryOptions): Promise<DiscoveredItem[]> {
  const { query, sources = ["wikimedia", "vanda", "web"], limit = 12 } = opts;

  const searches: Promise<DiscoveredItem[]>[] = [];

  if (sources.includes("wikimedia")) {
    searches.push(searchWikimedia(query, 8));
  }
  if (sources.includes("vanda")) {
    searches.push(searchVAndA(query, 6));
  }
  if (sources.includes("rijks") && opts.rijksKey) {
    searches.push(searchRijksmuseum(query, opts.rijksKey, 6));
  }
  if (sources.includes("web")) {
    searches.push(searchWeb(query, opts.serperKey || "", 8));
  }

  const results = await Promise.allSettled(searches);

  const allItems: DiscoveredItem[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") {
      allItems.push(...r.value);
    }
  }

  // Deduplicate by image URL
  const seen = new Set<string>();
  const unique = allItems.filter((item) => {
    if (seen.has(item.imageUrl)) return false;
    seen.add(item.imageUrl);
    return true;
  });

  // Sort by score
  unique.sort((a, b) => b.score - a.score);

  return unique.slice(0, limit);
}

// ── Helpers ──

function cleanWikiTitle(title: string): string {
  return title
    .replace(/^File:/, "")
    .replace(/\.(jpg|jpeg|png|gif|svg|tif|tiff)$/i, "")
    .replace(/_/g, " ")
    .trim();
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "";
  }
}
