import { NextRequest, NextResponse } from "next/server";

export interface SavedContent {
  id: string;
  type: "image" | "video" | "text" | "music";
  url?: string;
  content?: string;
  sourceUrl: string;
  sourceTitle: string;
  savedAt: number;
  userId?: string;
}

// In-memory store (in production, use database)
const savedContent: SavedContent[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, url, content, sourceUrl, sourceTitle } = body;

    if (!type) {
      return NextResponse.json({ error: "Type is required" }, { status: 400 });
    }

    const item: SavedContent = {
      id: crypto.randomUUID(),
      type,
      url: url || undefined,
      content: content || undefined,
      sourceUrl: sourceUrl || "",
      sourceTitle: sourceTitle || "",
      savedAt: Date.now(),
    };

    // Extract user from auth header if present
    const auth = req.headers.get("authorization");
    if (auth?.startsWith("Bearer ")) {
      item.userId = auth.slice(7);
    }

    savedContent.push(item);

    return NextResponse.json({
      success: true,
      item: { id: item.id, type: item.type, savedAt: item.savedAt },
    });
  } catch {
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  const items = userId
    ? savedContent.filter((s) => s.userId === userId)
    : savedContent;

  return NextResponse.json({
    count: items.length,
    items: items.slice(-50).reverse(),
  });
}
