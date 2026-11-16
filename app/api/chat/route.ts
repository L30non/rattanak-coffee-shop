import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { buildSystemPrompt } from "@/lib/chat/prompt";

const MAX_TURNS = 20;
const MAX_MESSAGE_LENGTH = 2000;
const DEFAULT_MODEL = "gemini-3.8-flash";
// Tried in order when the preferred model is overloaded (503) or times out.
// Lite models have far more spare capacity and are plenty for FAQ answers.
const FALLBACK_MODELS = ["gemini-3.5-flash-lite", "gemini-3.1-flash-lite"];
const MODEL_TIMEOUT_MS = 20_000;

// Best-effort per-IP limit. It lives in this server instance's memory, so on
// Vercel each warm instance counts separately — enough to blunt casual abuse
// of the Gemini key, not a hard guarantee. Use Upstash/Supabase if needed.
const RATE_LIMIT = { requests: 20, windowMs: 5 * 60_000 };
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter(
    time => now - time < RATE_LIMIT.windowMs,
  );
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_LIMIT.requests;
}

type ChatMessage = { role: "user" | "model"; text: string };

function parseMessages(body: unknown): ChatMessage[] | null {
  const messages = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(messages) || messages.length === 0) return null;

  const parsed: ChatMessage[] = [];
  for (const message of messages.slice(-MAX_TURNS)) {
    const { role, text } = (message ?? {}) as Record<string, unknown>;
    if (role !== "user" && role !== "model") return null;
    if (typeof text !== "string" || !text.trim()) return null;
    if (text.length > MAX_MESSAGE_LENGTH) return null;
    parsed.push({ role, text: text.trim() });
  }
  // Gemini expects the conversation to start with the user.
  while (parsed[0]?.role === "model") parsed.shift();
  if (parsed.at(-1)?.role !== "user") return null;
  return parsed;
}

// POST /api/chat - Stream the website assistant's reply as plain text
export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages. Please wait a few minutes." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const messages = parseMessages(body);
  if (!messages) {
    return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[chat] GEMINI_API_KEY is not set");
    return NextResponse.json(
      { error: "Chat is unavailable right now" },
      { status: 502 },
    );
  }

  const ai = new GoogleGenAI({ apiKey });
  const contents = messages.map(message => ({
    role: message.role,
    parts: [{ text: message.text }],
  }));
  const systemInstruction = await buildSystemPrompt();
  const models = [process.env.GEMINI_MODEL || DEFAULT_MODEL, ...FALLBACK_MODELS];

  let stream: AsyncGenerator<{ text?: string }> | null = null;
  for (const model of models) {
    try {
      stream = await ai.models.generateContentStream({
        model,
        contents,
        config: {
          systemInstruction,
          // Thinking tokens count against maxOutputTokens; keep it low so short
          // FAQ answers aren't cut off.
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          maxOutputTokens: 1024,
          temperature: 0.4,
          httpOptions: { timeout: MODEL_TIMEOUT_MS },
        },
      });
      break;
    } catch (error) {
      console.error(`[chat] Gemini request failed (${model})`, error);
    }
  }
  if (!stream) {
    return NextResponse.json(
      { error: "Chat is unavailable right now" },
      { status: 502 },
    );
  }
  const reply = stream;

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of reply) {
          if (chunk.text) controller.enqueue(encoder.encode(chunk.text));
        }
      } catch (error) {
        // Headers are already sent, so the client sees a cut-off reply.
        console.error("[chat] Gemini stream failed", error);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
