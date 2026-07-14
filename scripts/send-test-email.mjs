// Local email verification for City Center Events (Resend).
//
// Sends ONE test email using the same settings the app uses, so you can confirm
// your Resend API key + verified domain work before deploying.
//
// Setup: put RESEND_API_KEY in .env.local (it stays on your machine — this
// script never prints it). The sending domain in EMAIL_FROM must be verified in
// Resend first.
//
// Usage:
//   node scripts/send-test-email.mjs you@example.com

import fs from "node:fs";
import path from "node:path";
import { Resend } from "resend";

// Standalone Node does not auto-load .env.local, so parse it here.
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match || match[1] in process.env) continue;
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[match[1]] = value;
  }
}

const to = process.argv[2];
if (!to) {
  console.error("Usage: node scripts/send-test-email.mjs <recipient@example.com>");
  process.exit(1);
}

const apiKey = process.env.RESEND_API_KEY?.trim();
if (!apiKey) {
  console.error("Missing RESEND_API_KEY. Add it to .env.local first.");
  process.exit(1);
}

const from =
  process.env.EMAIL_FROM?.trim() ||
  "City Center Events <receipts@okcitycenterevents.org>";

const resend = new Resend(apiKey);

const { data, error } = await resend.emails.send({
  from,
  to,
  subject: "City Center Events - email test",
  text:
    "This is a test message confirming Resend is working for City Center " +
    "Events. If you received this, confirmation emails and PDF receipts are " +
    "ready to send.",
});

if (error) {
  console.error(`FAIL  Resend rejected the message: ${error.message || error}`);
  process.exit(1);
}

console.log(`OK  Test email sent from ${from} to ${to} (id ${data?.id})`);
