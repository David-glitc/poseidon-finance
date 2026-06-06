"use client";

import { useState } from "react";
import Link from "next/link";
import { resolveTactName } from "@/lib/tact-names/verify";
import { isValidLabel, normalizeLabel } from "@/lib/tact-names/normalize";

export function NameSearch() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSearch() {
    const label = normalizeLabel(query);
    if (!isValidLabel(label)) {
      setStatus("Use 1–62 lowercase letters and numbers.");
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const result = await resolveTactName(label);
      if (result.registration) {
        setStatus(
          result.verified
            ? `✓ Verified on registry (${result.source})`
            : `Found but proof unverified (${result.source})`,
        );
      } else {
        setStatus("Available — register below");
      }
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "lookup failed");
    } finally {
      setLoading(false);
    }
  }

  const label = normalizeLabel(query);
  const valid = isValidLabel(label);

  return (
    <div className="glass p-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="alice"
            className="w-full rounded-xl border border-white/10 bg-abyss px-4 py-3 pr-20 text-white outline-none focus:border-coral/50"
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/30">
            .tact
          </span>
        </div>
        <button
          type="button"
          onClick={onSearch}
          disabled={loading}
          className="rounded-xl bg-coral px-6 py-3 text-sm font-semibold text-abyss disabled:opacity-50"
        >
          {loading ? "…" : "Resolve"}
        </button>
      </div>
      {status && <p className="mt-3 text-sm text-white/60">{status}</p>}
      {valid && (
        <Link
          href={`/names/${label}`}
          className="mt-4 inline-block text-sm text-foam underline"
        >
          View {label}.tact →
        </Link>
      )}
    </div>
  );
}
