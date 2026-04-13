import { NextRequest, NextResponse } from "next/server";

interface ParsedBookmark {
  title: string;
  url: string;
  folder?: string;
  addDate?: string;
}

interface ClassifiedBookmark extends ParsedBookmark {
  category: string;
  tags: string[];
  confidence: number;
}

const DESIGN_KEYWORDS: Record<string, { category: string; weight: number }> = {
  architecture: { category: "architecture", weight: 3 },
  architect: { category: "architecture", weight: 3 },
  建築: { category: "architecture", weight: 3 },
  "industrial design": { category: "industrial_design", weight: 3 },
  "product design": { category: "industrial_design", weight: 3 },
  furniture: { category: "industrial_design", weight: 2 },
  工業設計: { category: "industrial_design", weight: 3 },
  "graphic design": { category: "graphic_design", weight: 3 },
  typography: { category: "graphic_design", weight: 2 },
  poster: { category: "graphic_design", weight: 2 },
  グラフィック: { category: "graphic_design", weight: 3 },
  "interior design": { category: "interior_design", weight: 3 },
  interior: { category: "interior_design", weight: 2 },
  "book design": { category: "book_design", weight: 3 },
  editorial: { category: "book_design", weight: 2 },
  装幀: { category: "book_design", weight: 3 },
  ceramics: { category: "ceramics", weight: 3 },
  pottery: { category: "ceramics", weight: 3 },
  陶芸: { category: "ceramics", weight: 3 },
  art: { category: "art", weight: 1 },
  museum: { category: "art", weight: 2 },
  gallery: { category: "art", weight: 2 },
  exhibition: { category: "art", weight: 2 },
  fashion: { category: "fashion", weight: 2 },
  design: { category: "industrial_design", weight: 1 },
  designboom: { category: "industrial_design", weight: 2 },
  dezeen: { category: "architecture", weight: 2 },
  archdaily: { category: "architecture", weight: 3 },
  "it's nice that": { category: "graphic_design", weight: 2 },
  behance: { category: "graphic_design", weight: 1 },
  dribbble: { category: "graphic_design", weight: 1 },
  pinterest: { category: "art", weight: 1 },
  cosmos: { category: "art", weight: 2 },
  "古道具": { category: "antiques", weight: 3 },
  antique: { category: "antiques", weight: 2 },
  vintage: { category: "antiques", weight: 2 },
  craft: { category: "ceramics", weight: 2 },
  mingei: { category: "antiques", weight: 3 },
  民藝: { category: "antiques", weight: 3 },
};

function parseBookmarksHtml(html: string): ParsedBookmark[] {
  const bookmarks: ParsedBookmark[] = [];
  const linkRegex = /<A\s+HREF="([^"]+)"[^>]*(?:ADD_DATE="(\d+)")?[^>]*>([^<]+)<\/A>/gi;
  const folderRegex = /<H3[^>]*>([^<]+)<\/H3>/gi;

  let currentFolder = "";

  const lines = html.split("\n");
  for (const line of lines) {
    const folderMatch = folderRegex.exec(line);
    if (folderMatch) {
      currentFolder = folderMatch[1];
      folderRegex.lastIndex = 0;
    }

    const linkMatch = linkRegex.exec(line);
    if (linkMatch) {
      bookmarks.push({
        url: linkMatch[1],
        addDate: linkMatch[2],
        title: linkMatch[3].trim(),
        folder: currentFolder || undefined,
      });
      linkRegex.lastIndex = 0;
    }
  }

  return bookmarks;
}

function classifyBookmark(bookmark: ParsedBookmark): ClassifiedBookmark {
  const searchText = `${bookmark.title} ${bookmark.folder || ""} ${bookmark.url}`.toLowerCase();
  const categoryScores: Record<string, number> = {};
  const matchedTags: string[] = [];

  for (const [keyword, { category, weight }] of Object.entries(DESIGN_KEYWORDS)) {
    if (searchText.includes(keyword.toLowerCase())) {
      categoryScores[category] = (categoryScores[category] || 0) + weight;
      matchedTags.push(keyword);
    }
  }

  let bestCategory = "uncategorized";
  let bestScore = 0;
  for (const [cat, score] of Object.entries(categoryScores)) {
    if (score > bestScore) {
      bestScore = score;
      bestCategory = cat;
    }
  }

  if (bookmark.folder) {
    matchedTags.push(bookmark.folder.toLowerCase());
  }

  return {
    ...bookmark,
    category: bestCategory,
    tags: [...new Set(matchedTags)].slice(0, 5),
    confidence: Math.min(bestScore / 5, 1),
  };
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let bookmarksHtml: string;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }
      bookmarksHtml = await file.text();
    } else {
      const body = await req.json();
      bookmarksHtml = body.html || body.bookmarks || "";
    }

    if (!bookmarksHtml) {
      return NextResponse.json({ error: "No bookmark data provided" }, { status: 400 });
    }

    const allBookmarks = parseBookmarksHtml(bookmarksHtml);
    const classified = allBookmarks.map(classifyBookmark);

    const designRelated = classified.filter((b) => b.category !== "uncategorized");
    const uncategorized = classified.filter((b) => b.category === "uncategorized");

    const byCategory: Record<string, ClassifiedBookmark[]> = {};
    for (const b of designRelated) {
      if (!byCategory[b.category]) byCategory[b.category] = [];
      byCategory[b.category].push(b);
    }

    return NextResponse.json({
      total: allBookmarks.length,
      designRelated: designRelated.length,
      uncategorized: uncategorized.length,
      byCategory,
      items: designRelated.sort((a, b) => b.confidence - a.confidence),
    });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json({ error: "Failed to parse bookmarks" }, { status: 500 });
  }
}
