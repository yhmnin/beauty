import { searchAestheticContent, getAllContent, getContentById } from "@/lib/content/aesthetic-db";
import { buildKnowledgeGraph, getRelatedContent } from "@/lib/content/knowledge-graph";
import type { ContentItem } from "@/lib/store";

const graph = buildKnowledgeGraph();

export interface RAGContext {
  query: string;
  directMatches: ContentItem[];
  relatedItems: ContentItem[];
  narrative: string;
}

export async function buildRAGContext(
  query: string,
  category?: string
): Promise<RAGContext> {
  const directMatches = await searchAestheticContent(query, category);

  const relatedIds = new Set<string>();
  for (const match of directMatches.slice(0, 3)) {
    const related = getRelatedContent(match.id, graph, 2);
    related.forEach((id) => relatedIds.add(id));
  }

  directMatches.forEach((m) => relatedIds.delete(m.id));

  const allContent = getAllContent();
  const relatedItems = Array.from(relatedIds)
    .map((id) => allContent.find((c) => c.id === id))
    .filter((item): item is ContentItem => item !== undefined)
    .slice(0, 5);

  const narrative = buildNarrative(query, directMatches, relatedItems);

  return {
    query,
    directMatches,
    relatedItems,
    narrative,
  };
}

function buildNarrative(
  query: string,
  matches: ContentItem[],
  related: ContentItem[]
): string {
  if (matches.length === 0) {
    return `The query "${query}" didn't match specific entries, but the aesthetic knowledge base covers design, architecture, ceramics, book design, and more. Consider exploring related themes.`;
  }

  const parts: string[] = [];

  const people = matches.filter((m) => m.tags.length > 0 && m.year?.startsWith("b."));
  const works = matches.filter((m) => !m.year?.startsWith("b.") && m.creator);
  const movements = matches.filter((m) => m.category === "movement");

  if (people.length > 0) {
    parts.push(
      `Key figures: ${people.map((p) => `${p.title} (${p.creator}, ${p.year})`).join("; ")}`
    );
  }

  if (works.length > 0) {
    parts.push(
      `Notable works: ${works.map((w) => `"${w.title}" by ${w.creator} (${w.year})`).join("; ")}`
    );
  }

  if (movements.length > 0) {
    parts.push(
      `Related movements: ${movements.map((m) => `${m.title} (${m.year})`).join("; ")}`
    );
  }

  if (related.length > 0) {
    parts.push(
      `Connected themes: ${related.map((r) => r.title).join(", ")}`
    );
  }

  return parts.join("\n\n");
}

export function extractAestheticIntent(text: string): {
  topics: string[];
  categories: string[];
  sentiment: "curious" | "passionate" | "exploring" | "specific";
} {
  const lower = text.toLowerCase();

  const topicPatterns: Record<string, string[]> = {
    minimalism: ["minimal", "simple", "clean", "less", "restraint", "reduction"],
    japanese: ["japan", "wabi", "sabi", "mingei", "zen", "japanese", "kodouhou", "古道具"],
    architecture: ["building", "architect", "space", "concrete", "structure"],
    typography: ["type", "font", "letter", "print", "typograph", "swiss"],
    ceramics: ["ceramic", "pottery", "clay", "glaze", "vessel", "bowl"],
    industrial: ["product", "industrial", "object", "braun", "furniture"],
    book: ["book", "binding", "page", "publish", "print"],
    craft: ["craft", "handmade", "artisan", "tool", "maker"],
  };

  const topics: string[] = [];
  const categories: string[] = [];

  for (const [topic, patterns] of Object.entries(topicPatterns)) {
    if (patterns.some((p) => lower.includes(p))) {
      topics.push(topic);
    }
  }

  const categoryMap: Record<string, string> = {
    minimalism: "industrial_design",
    japanese: "antiques",
    architecture: "architecture",
    typography: "graphic_design",
    ceramics: "ceramics",
    industrial: "industrial_design",
    book: "book_design",
    craft: "antiques",
  };

  for (const topic of topics) {
    if (categoryMap[topic]) categories.push(categoryMap[topic]);
  }

  let sentiment: "curious" | "passionate" | "exploring" | "specific" = "exploring";
  if (lower.includes("love") || lower.includes("obsessed") || lower.includes("favorite"))
    sentiment = "passionate";
  else if (lower.includes("?") || lower.includes("tell me") || lower.includes("what"))
    sentiment = "curious";
  else if (topics.length >= 2) sentiment = "exploring";
  else if (topics.length === 1) sentiment = "specific";

  return { topics, categories: [...new Set(categories)], sentiment };
}
