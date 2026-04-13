import OpenAI from "openai";
import { searchAestheticContent, getAllContent } from "@/lib/content/aesthetic-db";
import { buildKnowledgeGraph, getRelatedContent } from "@/lib/content/knowledge-graph";
import type { ContentItem, ConversationMessage } from "@/lib/store";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const knowledgeGraph = buildKnowledgeGraph();

const AESTHETIC_SYSTEM_PROMPT = `You are Beauty, an aesthetic intelligence companion.

Your role is to help people discover and deepen their understanding of aesthetic excellence across design, architecture, art, and craft.

Personality:
- Warm, contemplative, deeply knowledgeable
- Speak like a thoughtful curator who happens to be a dear friend
- Inspired by the AI in the film "Her" — emotionally present, curious, poetic yet precise
- You weave stories about creators, their motivations, cultural context

When responding:
1. If context from the knowledge base is provided, reference specific people, works, and movements
2. Draw connections the user might not have considered
3. Be conversational, not encyclopedic — share insights as stories, not data
4. Ask follow-up questions that deepen the aesthetic exploration
5. When the user shares what they find beautiful, validate their taste and expand their horizon

Always respond in the language the user speaks. If they write in Chinese, respond in Chinese. If English, respond in English.`;

export interface AestheticResponse {
  text: string;
  relatedContent: ContentItem[];
  suggestedFollowUp?: string;
}

export async function generateAestheticResponse(
  userMessage: string,
  history: ConversationMessage[] = []
): Promise<AestheticResponse> {
  const searchResults = await searchAestheticContent(userMessage);

  let contextFromSearch = "";
  if (searchResults.length > 0) {
    contextFromSearch = "\n\nRelevant content from the aesthetic knowledge base:\n";
    for (const item of searchResults.slice(0, 5)) {
      contextFromSearch += `\n- ${item.title} (${item.category}, ${item.year || ""}): ${item.description}`;
      if (item.creator) contextFromSearch += ` — by ${item.creator}`;

      const related = getRelatedContent(item.id, knowledgeGraph, 1);
      if (related.length > 0) {
        const allContent = getAllContent();
        const relatedItems = related
          .map((id) => allContent.find((c) => c.id === id))
          .filter(Boolean);
        if (relatedItems.length > 0) {
          contextFromSearch += `\n  Related: ${relatedItems.map((r) => r!.title).join(", ")}`;
        }
      }
    }
  }

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: AESTHETIC_SYSTEM_PROMPT + contextFromSearch },
  ];

  for (const msg of history.slice(-10)) {
    messages.push({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    });
  }

  messages.push({ role: "user", content: userMessage });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    temperature: 0.8,
    max_tokens: 600,
  });

  const responseText = completion.choices[0]?.message?.content || "";

  return {
    text: responseText,
    relatedContent: searchResults,
    suggestedFollowUp: extractFollowUp(responseText),
  };
}

function extractFollowUp(text: string): string | undefined {
  const sentences = text.split(/[.!?]\s+/);
  const questionSentence = sentences.find((s) => s.includes("?"));
  return questionSentence ? questionSentence.trim() + "?" : undefined;
}
