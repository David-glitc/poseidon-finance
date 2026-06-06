#!/usr/bin/env node
/**
 * Writes .env.production.local for Next.js build in GitHub Actions.
 * Usage: node scripts/ci-build-env.mjs
 */
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outPath = join(root, ".env.production.local");

/** @type {Array<{ key: string; required?: boolean }>} */
const KEYS = [
  { key: "NEXT_PUBLIC_APP_URL", required: false },
  { key: "NEXT_PUBLIC_TACIT_WORKER_URL", required: false },
  { key: "REGISTRY_TREASURY_ADDRESS", required: false },
];

const lines = [];
const missing = [];

for (const { key, required = false } of KEYS) {
  const raw = process.env[key];
  if (raw == null || raw === "") {
    if (required) missing.push(key);
    continue;
  }
  const escaped = raw.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
  lines.push(`${key}="${escaped}"`);
}

if (missing.length) {
  console.error("Missing required build env vars:", missing.join(", "));
  process.exit(1);
}

if (lines.length) {
  writeFileSync(outPath, `${lines.join("\n")}\n`, { mode: 0o600 });
  console.log(`Wrote ${outPath} (${lines.length} vars)`);
} else {
  console.log("No optional env vars set — skipping .env.production.local");
}
