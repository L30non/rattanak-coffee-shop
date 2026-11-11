import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sendContactMessageEmail } from "@/lib/email";

const LIMITS = { name: 100, email: 254, subject: 200, message: 5000 };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/contact - Email a Contact page message to the shop inbox
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Honeypot: the "company" field is hidden from people, so only bots fill
  // it. Report success so they don't retry, but send nothing.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ success: true });
  }

  const field = (key: keyof typeof LIMITS) =>
    typeof body[key] === "string" ? (body[key] as string).trim() : "";
  const data = {
    name: field("name"),
    email: field("email"),
    subject: field("subject"),
    message: field("message"),
  };

  for (const key of Object.keys(LIMITS) as (keyof typeof LIMITS)[]) {
    if (!data[key]) {
      return NextResponse.json({ error: `${key} is required` }, { status: 400 });
    }
    if (data[key].length > LIMITS[key]) {
      return NextResponse.json({ error: `${key} is too long` }, { status: 400 });
    }
  }
  if (!EMAIL_PATTERN.test(data.email)) {
    return NextResponse.json({ error: "email is invalid" }, { status: 400 });
  }

  const result = await sendContactMessageEmail(data);
  if (!result.success) {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true });
}
