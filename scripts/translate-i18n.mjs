#!/usr/bin/env node
/**
 * Fills messages/km.json with Khmer translations for every string passed to
 * t() anywhere in the app.
 *
 *   node scripts/translate-i18n.mjs            # translate strings not yet in km.json
 *   node scripts/translate-i18n.mjs --dry-run  # list what would be sent, call nothing
 *   node scripts/translate-i18n.mjs --prune    # also drop entries no longer used
 *   node scripts/translate-i18n.mjs --retranslate  # re-translate everything
 *
 * Needs GOOGLE_TRANSLATE_API_KEY in .env.local (or the environment).
 *
 * Existing entries are never overwritten unless --retranslate is passed, so
 * hand-corrections to the machine output survive later runs.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "@babel/parser";
import _traverse from "@babel/traverse";

// @babel/traverse ships CJS; interop gives us { default: fn } under ESM.
const traverse = _traverse.default ?? _traverse;

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MESSAGES_FILE = path.join(ROOT, "messages", "km.json");
const SCAN_DIRS = ["app", "lib"];
const TARGET = "km";
const SOURCE = "en";
// The v2 endpoint caps a request's segments; stay well under it.
const BATCH_SIZE = 100;

/**
 * Strings that must stay in English. Machine translation mangles brand names,
 * transliterates email addresses, and "translates" format examples like 250g
 * into prose. These get an identity entry in km.json so t() returns the
 * English unchanged and no API call is spent on them.
 */
const DO_NOT_TRANSLATE_PATTERNS = [
  /^\S+@\S+\.\S+$/, // email addresses, real and placeholder
  /^[\d.]+\s*(g|kg|ml|l|oz)$/i, // weight/size format hints
  /^[A-Z]{2}$/, // state / country codes used as input hints
  /^[\d.,$%\s]+$/, // pure numbers and currency samples
];

const DO_NOT_TRANSLATE_EXACT = new Set([
  "Rattanak Coffee Shop",
  "Rattanak Coffee",
  "RATTANAK COFFEE",
  "Rattanak Coffee Logo",
  "Bakong KHQR",
  // Third-party product names — these stay in Latin script everywhere.
  "Facebook",
  "Instagram",
  "Telegram",
  "TikTok",
  "Stripe",
  "ABA",
  "ACLEDA",
  "Wing",
]);

function shouldSkip(text) {
  if (DO_NOT_TRANSLATE_EXACT.has(text)) return true;
  return DO_NOT_TRANSLATE_PATTERNS.some((pattern) => pattern.test(text));
}

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");
const PRUNE = args.has("--prune");
const RETRANSLATE = args.has("--retranslate");

function loadApiKey() {
  if (process.env.GOOGLE_TRANSLATE_API_KEY) {
    return process.env.GOOGLE_TRANSLATE_API_KEY;
  }
  const envPath = path.join(ROOT, ".env.local");
  if (!existsSync(envPath)) return null;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const match = line.match(/^\s*GOOGLE_TRANSLATE_API_KEY\s*=\s*(.+?)\s*$/);
    if (match) return match[1].replace(/^["']|["']$/g, "");
  }
  return null;
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
      yield full;
    }
  }
}

/** Collects every string literal passed as the first argument to t(...). */
function extractFromSource(code) {
  const found = new Set();
  let ast;
  try {
    ast = parse(code, {
      sourceType: "module",
      plugins: ["typescript", "jsx"],
    });
  } catch (error) {
    console.warn(`  ! parse failed: ${error.message}`);
    return found;
  }

  traverse(ast, {
    CallExpression(nodePath) {
      const { callee, arguments: callArgs } = nodePath.node;
      // t(...) at render time, plus msg(...) which marks translatable strings
      // sitting in module-level data (lib/categories.ts, lib/beans.ts).
      const isT =
        (callee.type === "Identifier" &&
          (callee.name === "t" || callee.name === "msg")) ||
        (callee.type === "MemberExpression" &&
          callee.property.type === "Identifier" &&
          callee.property.name === "t");
      if (!isT || callArgs.length === 0) return;
      const first = callArgs[0];
      if (first.type === "StringLiteral" && first.value.trim()) {
        found.add(first.value);
      }
    },
  });

  return found;
}

/**
 * Brand and product names that must stay in Latin script even when they appear
 * inside a Khmer sentence. Matched as substrings, longest first, so
 * "Rattanak Coffee Shop" is consumed before "Rattanak Coffee".
 *
 * Left unprotected, Google renders "Rattanak Coffee" as "ហាងកាហ្វេរតនៈ", which
 * contradicts the Latin logo and header, and turns Bakong/ABA/ACLEDA into
 * words customers won't match against the apps on their phone.
 */
const PROTECTED_TERMS = [
  "Rattanak Coffee Shop",
  "Rattanak Coffee",
  "RATTANAK COFFEE",
  "Bakong KHQR",
  "Bakong",
  "KHQR",
  "Facebook",
  "Instagram",
  "Telegram",
  "TikTok",
  "ACLEDA",
  "Stripe",
  "ABA",
  "Wing",
].sort((a, b) => b.length - a.length);

/**
 * Sentinel standing in for a span Google must not touch.
 *
 * Indexed with letters, never digits: Google rewrites Arabic digits into Khmer
 * numerals (0 -> ០), which destroys a numeric sentinel. Verified empirically —
 * "%%0%%" survived but a bare "0" did not.
 */
function sentinel(index) {
  let label = "";
  let n = index;
  do {
    label = String.fromCharCode(65 + (n % 26)) + label;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return `%%${label}%%`;
}

/** Swaps placeholders and brand terms out for sentinels before translation. */
function protectText(text) {
  const tokens = [];

  // {placeholder} tokens — t() substitutes on the English name, so a
  // translated name silently breaks interpolation.
  let out = text.replace(/\{\w+\}/g, (match) => {
    tokens.push(match);
    return sentinel(tokens.length - 1);
  });

  for (const term of PROTECTED_TERMS) {
    if (!out.includes(term)) continue;
    tokens.push(term);
    out = out.split(term).join(sentinel(tokens.length - 1));
  }

  return { protectedText: out, tokens };
}

function restoreText(text, tokens) {
  let out = text;
  tokens.forEach((token, index) => {
    out = out.split(sentinel(index)).join(token);
  });
  return out;
}

async function translateBatch(strings, apiKey) {
  const prepared = strings.map(protectText);

  const response = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: prepared.map((entry) => entry.protectedText),
        source: SOURCE,
        target: TARGET,
        format: "text",
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Translate API ${response.status}: ${body}`);
  }

  const payload = await response.json();
  return payload.data.translations.map((entry, index) => {
    const { tokens } = prepared[index];
    const restored = restoreText(entry.translatedText, tokens);
    // A surviving "%%" means a sentinel came back altered; surface it rather
    // than writing a corrupted entry into the dictionary.
    if (restored.includes("%%")) {
      console.warn(
        `  ! sentinel not restored in ${JSON.stringify(strings[index])}\n` +
          `    got: ${JSON.stringify(restored)}`,
      );
    }
    return restored;
  });
}

async function main() {
  const used = new Set();
  for (const dir of SCAN_DIRS) {
    const abs = path.join(ROOT, dir);
    if (!existsSync(abs)) continue;
    for await (const file of walk(abs)) {
      for (const value of extractFromSource(readFileSync(file, "utf8"))) {
        used.add(value);
      }
    }
  }

  const existing = existsSync(MESSAGES_FILE)
    ? JSON.parse(readFileSync(MESSAGES_FILE, "utf8"))
    : {};

  // Pin do-not-translate strings to themselves before working out what's left.
  let pinned = 0;
  for (const text of used) {
    if (shouldSkip(text) && existing[text] !== text) {
      existing[text] = text;
      pinned += 1;
    }
  }

  const missing = [...used].filter(
    (text) =>
      !shouldSkip(text) &&
      (RETRANSLATE || typeof existing[text] !== "string"),
  );

  console.log(`Strings used in code : ${used.size}`);
  console.log(`Kept as English      : ${pinned} (brand names, emails, formats)`);
  console.log(`Already translated   : ${used.size - missing.length - pinned}`);
  console.log(`Needing translation  : ${missing.length}`);

  if (PRUNE) {
    const stale = Object.keys(existing).filter((key) => !used.has(key));
    for (const key of stale) delete existing[key];
    if (stale.length) console.log(`Pruned stale entries : ${stale.length}`);
  }

  if (DRY_RUN) {
    console.log("\n--dry-run: nothing sent. Strings that would be translated:");
    for (const text of missing) console.log(`  ${JSON.stringify(text)}`);
    return;
  }

  if (missing.length > 0) {
    const apiKey = loadApiKey();
    if (!apiKey) {
      console.error(
        "\nGOOGLE_TRANSLATE_API_KEY is not set.\n" +
          "Add it to .env.local, then re-run. Create one at:\n" +
          "  https://console.cloud.google.com/apis/credentials\n" +
          "with the Cloud Translation API enabled.",
      );
      process.exit(1);
    }

    const totalChars = missing.reduce((sum, s) => sum + s.length, 0);
    console.log(
      `\nTranslating ${missing.length} strings (${totalChars.toLocaleString()} chars)…`,
    );

    for (let i = 0; i < missing.length; i += BATCH_SIZE) {
      const batch = missing.slice(i, i + BATCH_SIZE);
      const translated = await translateBatch(batch, apiKey);
      batch.forEach((source, index) => {
        existing[source] = translated[index];
      });
      console.log(`  ${Math.min(i + BATCH_SIZE, missing.length)}/${missing.length}`);
    }
  }

  // Sorted so diffs stay readable as strings are added over time.
  const sorted = Object.fromEntries(
    Object.keys(existing)
      .sort()
      .map((key) => [key, existing[key]]),
  );
  writeFileSync(MESSAGES_FILE, JSON.stringify(sorted, null, 2) + "\n", "utf8");
  console.log(`\nWrote ${Object.keys(sorted).length} entries to messages/km.json`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
