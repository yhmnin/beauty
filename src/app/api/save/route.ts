import { NextRequest, NextResponse } from "next/server";
import { findUserByToken } from "@/lib/auth/user-db";

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

    const auth = req.headers.get("authorization");
    if (auth?.startsWith("Bearer ")) {
      const token = auth.slice(7);
      const user = findUserByToken(token);
      if (user) item.userId = user.id;
    }

    savedContent.push(item);

    return NextResponse.json({
      success: true,
      item,
    });
  } catch {
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  let userId: string | null = req.nextUrl.searchParams.get("userId");

  // Also support auth token
  if (!userId) {
    const auth = req.headers.get("authorization");
    if (auth?.startsWith("Bearer ")) {
      const token = auth.slice(7);
      const user = findUserByToken(token);
      if (user) userId = user.id;
    }
  }

  const items = userId
    ? savedContent.filter((s) => s.userId === userId)
    : savedContent;

  return NextResponse.json({
    count: items.length,
    items: items.slice(-100).reverse(),
  });
}
