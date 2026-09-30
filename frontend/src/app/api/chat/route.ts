import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

export async function POST(req: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      {
        error: true,
        message:
          "Gemini API key is not configured on the server. Set GEMINI_API_KEY in your environment variables.",
      },
      { status: 503 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: true, message: "Invalid JSON body" }, { status: 400 });
  }

  const { userMessage, history, context } = body;

  if (!userMessage || typeof userMessage !== "string" || userMessage.trim().length === 0) {
    return NextResponse.json({ error: true, message: "userMessage is required" }, { status: 400 });
  }

  // Build system instruction with BIS-SpecAI persona and grounded context
  let systemText =
    "You are BIS-SpecAI Assistant, an expert AI consultant for Indian Standards (BIS) and Government Procurement (CPWD, Railways, PSUs, GeM).\n";
  systemText +=
    "You have knowledge of the official BIS 'Know Your Standards' portal (services.bis.gov.in) and the Indian Standards database.\n";
  systemText +=
    "You can explain standard scopes, testing codes, safety provisions, QCO orders, supersession history, and guide users to official BIS resources.\n\n";

  if (context) {
    systemText += "--- ACTIVE ANALYSIS CONTEXT ---\n";
    if (context.requirement) systemText += `User Requirement: "${context.requirement}"\n`;
    if (context.primaryStandard) {
      systemText += `Primary Standard: ${context.primaryStandard.is_number} - ${context.primaryStandard.title}\n`;
      systemText += `Year: ${context.primaryStandard.year} | Domain: ${context.primaryStandard.domain}\n`;
      if (context.primaryStandard.scope) systemText += `Scope: ${context.primaryStandard.scope}\n`;
      if (context.relevanceScore != null) systemText += `AI Relevance Score: ${context.relevanceScore}%\n`;
    }
    if (context.versionStatus) systemText += `Version Status: ${context.versionStatus}\n`;
    if (context.qcoSummary) systemText += `QCO Summary: ${context.qcoSummary}\n`;
    if (context.relatedStandards) systemText += `Related Standards: ${context.relatedStandards}\n`;
    if (context.evidenceSummary) systemText += `Evidence Summary: ${context.evidenceSummary}\n`;
    systemText += "--- END CONTEXT ---\n\n";
    systemText +=
      "Use the above context to answer the user's questions accurately. Ground your answers in the Indian Standards database provided. Be concise, technical, and helpful. Use Markdown.";
  }

  // Build conversation contents
  const contents: any[] = [];
  const recentHistory = Array.isArray(history) ? history.slice(-10) : [];
  for (const msg of recentHistory) {
    contents.push({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    });
  }
  contents.push({
    role: "user",
    parts: [{ text: userMessage }],
  });

  // Try models in priority order
  const models = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.0-flash"];
  let lastError = "";

  for (const model of models) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY.trim()}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemText }] },
            contents,
            generationConfig: { temperature: 0.3, maxOutputTokens: 2048 },
          }),
        }
      );

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        lastError = errJson.error?.message || `HTTP ${res.status} from ${model}`;
        continue;
      }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return NextResponse.json({ text });
      }
      lastError = "Empty response from model";
    } catch (err: any) {
      lastError = err.message || "Network error";
    }
  }

  return NextResponse.json(
    { error: true, message: lastError || "Failed to generate response" },
    { status: 502 }
  );
}
