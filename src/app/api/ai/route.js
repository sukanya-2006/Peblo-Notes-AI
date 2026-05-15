import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.content || body.content.trim().length < 20) {
      return NextResponse.json(
        { error: "Note content too short to analyze" },
        { status: 400 }
      );
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that analyzes notes and returns structured JSON.
You MUST respond with valid JSON only — no markdown, no code fences, no extra text.
The JSON must follow this exact shape:
{
  "summary": "A concise 2-3 sentence summary of the note",
  "actionItems": ["action item 1", "action item 2", "action item 3"],
  "suggestedTitle": "A clear, descriptive title for this note"
}`,
        },
        {
          role: "user",
          content: `Analyze this note and return the JSON:\n\nTitle: ${body.title || "Untitled"}\n\nContent:\n${body.content}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
      max_tokens: 512,
    });

    const aiText = chatCompletion.choices[0]?.message?.content?.trim();

    // Strip any accidental markdown fences the model might add
    const cleaned = aiText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI JSON:", cleaned);
      return NextResponse.json(
        { error: "AI returned invalid JSON", raw: cleaned },
        { status: 500 }
      );
    }

    return NextResponse.json({
      summary: parsed.summary || "",
      actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : [],
      suggestedTitle: parsed.suggestedTitle || "",
    });
  } catch (error) {
    console.error("GROQ ERROR:", error);
    return NextResponse.json(
      { error: "AI route failed", details: error.message },
      { status: 500 }
    );
  }
}