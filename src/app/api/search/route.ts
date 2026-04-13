import { NextRequest, NextResponse } from "next/server";
import { searchAestheticContent } from "@/lib/content/aesthetic-db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, category } = body;

    if (!query) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    const results = await searchAestheticContent(query, category);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
