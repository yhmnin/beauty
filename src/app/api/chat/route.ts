import { NextRequest, NextResponse } from "next/server";
import { generateAestheticResponse } from "@/lib/ai/aesthetic-agent";
import type { ConversationMessage } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history } = body as {
      message: string;
      history?: ConversationMessage[];
    };

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your_openai_api_key_here") {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const response = await generateAestheticResponse(message, history || []);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
