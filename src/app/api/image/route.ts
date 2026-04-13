import { NextRequest, NextResponse } from "next/server";

const CACHE = new Map<string, { data: ArrayBuffer; type: string; ts: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour
const MAX_CACHE = 200;

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "url parameter required" }, { status: 400 });
  }

  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  // Check cache
  const cached = CACHE.get(url);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return new NextResponse(cached.data, {
      headers: {
        "Content-Type": cached.type,
        "Cache-Control": "public, max-age=3600, immutable",
        "X-Image-Source": url,
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Beauty-Aesthetic-Intelligence/1.0 (image proxy; contact: admin@beauty.app)",
        Accept: "image/*,*/*",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${res.status}` },
        { status: 502 }
      );
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";

    if (!contentType.startsWith("image/")) {
      return NextResponse.json({ error: "Not an image" }, { status: 400 });
    }

    const data = await res.arrayBuffer();

    // Evict oldest if cache full
    if (CACHE.size >= MAX_CACHE) {
      let oldest = "";
      let oldestTs = Infinity;
      for (const [k, v] of CACHE) {
        if (v.ts < oldestTs) { oldest = k; oldestTs = v.ts; }
      }
      if (oldest) CACHE.delete(oldest);
    }

    CACHE.set(url, { data, type: contentType, ts: Date.now() });

    return new NextResponse(data, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600, immutable",
        "X-Image-Source": url,
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 502 });
  }
}
