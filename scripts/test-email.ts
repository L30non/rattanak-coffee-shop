import { Resend } from "resend";
import { readFileSync } from "fs";
import { join } from "path";

// Load .env.local manually
const envPath = join(process.cwd(), ".env.local");
const envContent = readFileSync(envPath, "utf-8");
envContent.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const [, key, value] = match;
    process.env[key.trim()] = value.trim();
  }
});

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  try {
    console.log("Testing Resend integration...");
    console.log(
      "API Key:",
      process.env.RESEND_API_KEY?.substring(0, 10) + "...",
    );

    const { data, error } = await resend.emails.send({
      from: "Rattanak Coffee Shop <onboarding@resend.dev>",
      to: ["delivered@resend.dev"], // Resend test email
      subject: "Test Email - Rattanak Coffee Shop",
      html: "<p>This is a test email to verify Resend integration is working correctly!</p>",
    });

    if (error) {
      console.error("❌ Error sending email:", error);
      return;
    }

    console.log("✅ Email sent successfully!");
    console.log("Email ID:", data?.id);
  } catch (error) {
    console.error("❌ Exception:", error);
  }
}

testEmail();
