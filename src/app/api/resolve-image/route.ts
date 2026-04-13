import { NextRequest, NextResponse } from "next/server";
import { resolveImage, batchResolveImages, getAllCachedImages } from "@/lib/discovery/image-resolver";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const action = req.nextUrl.searchParams.get("action");

  // Return all cached images
  if (action === "cache") {
    return NextResponse.json(getAllCachedImages());
  }

  if (!id) {
    return NextResponse.json({ error: "id parameter required" }, { status: 400 });
  }

  const resolved = await resolveImage(id);

  if (!resolved) {
    return NextResponse.json({ error: "Could not resolve image", id }, { status: 404 });
  }

  return NextResponse.json(resolved);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { ids } = body as { ids: string[] };

  if (!ids || !Array.isArray(ids)) {
    return NextResponse.json({ error: "ids array required" }, { status: 400 });
  }

  const results = await batchResolveImages(ids);

  return NextResponse.json({
    resolved: results.size,
    total: ids.length,
    images: Object.fromEntries(results),
  });
}
