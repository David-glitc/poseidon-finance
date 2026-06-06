"use client";

import { useEffect, useState } from "react";
import { useBtcWallet, useEthWallet } from "@/lib/wallet/provider";
import { isValidLabel, normalizeLabel } from "@/lib/tact-names/normalize";
import type { NameTld } from "@/lib/names/tlds";
import { TLDS } from "@/lib/names/tlds";
import type { PriceQuote } from "@/lib/names/pricing";
import { GlassCard } from "./GlassCard";

export function NameRegister() {
  const { address } = useEthWallet();
  const { btcAddress } = useBtcWallet();
  const [label, setLabel] = useState("");
  const [tld, setTld] = useState<NameTld>("tact");
  const [tacitShielded, setTacitShielded] = useState("");
  const [quote, setQuote] = useState<PriceQuote | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const norm = normalizeLabel(label);
    if (!isValidLabel(norm)) {
      setQuote(null);
      return;
    }
    fetch(`/api/names/price?label=${norm}&tld=${tld}`)
      .then((r) => r.json())
      .then(setQuote)
      .catch(() => setQuote(null));
  }, [label, tld]);

  async function bookAndRegister() {
    const norm = normalizeLabel(label);
    if (!isValidLabel(norm)) {
      setMsg("Invalid label");
      return;
    }
    if (!address) {
      setMsg("Connect ETH wallet to register");
      return;
    }
    if (!quote) {
      setMsg("Price unavailable");
      return;
    }

    setBusy(true);
    setMsg(null);
    try {
      const bookRes = await fetch("/api/registry/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: norm,
          tld,
          ownerEth: address,
          ownerBtc: btcAddress,
          sig: `book:${norm}.${tld}:${address}:${Date.now()}`,
          priceUsd: quote.usd,
        }),
      });
      if (!bookRes.ok) {
        const err = await bookRes.json();
        throw new Error(err.error ?? "booking failed");
      }

      const regRes = await fetch("/api/registry/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: norm,
          tld,
          ownerEth: address,
          ownerBtc: btcAddress,
          priceUsd: quote.usd,
          paymentRef: `poseidon-${norm}-${Date.now()}`,
          records: {
            eth: address,
            btc: btcAddress ?? undefined,
            tacit_shielded: tacitShielded || undefined,
          },
        }),
      });
      if (!regRes.ok) {
        const err = await regRes.json();
        throw new Error(err.error ?? "register failed");
      }
      setMsg(`Registered ${norm}.${tld} — $${quote.usd} recorded`);
      setLabel("");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "failed");
    } finally {
      setBusy(false);
    }
  }

  const poseidonTld = tld === "tact" || tld === "btc";

  return (
    <GlassCard strong className="space-y-4 p-6 md:p-8">
      <h2 className="font-display text-xl font-semibold text-sky-100">Register</h2>
      <div className="flex gap-2">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="yourname"
          className="input-glass flex-1"
        />
        <select
          className="input-glass w-28"
          value={tld}
          onChange={(e) => setTld(e.target.value as NameTld)}
        >
          {Object.values(TLDS).map((t) => (
            <option key={t.tld} value={t.tld}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      {quote && (
        <div className="rounded-2xl border border-sky-400/20 bg-black/25 px-4 py-3 text-sm">
          <span className="text-sky-200/60">Price </span>
          <span className="font-semibold text-sky-100">${quote.usd}</span>
          <span className="ml-2 text-xs uppercase text-sky-400/50">{quote.tier}</span>
          <p className="mt-1 text-xs text-sky-400/40">Max $20 · economy from $2 · vanity fixed set</p>
        </div>
      )}
      {poseidonTld && (
        <input
          value={tacitShielded}
          onChange={(e) => setTacitShielded(e.target.value)}
          placeholder="tcs1… shielded address (optional)"
          className="input-glass text-sm"
        />
      )}
      {!poseidonTld && (
        <p className="text-xs text-sky-400/45">
          {tld}.wei and .eth resolve via chain contracts — register on wei.domains or ENS.
        </p>
      )}
      <button
        type="button"
        onClick={bookAndRegister}
        disabled={busy || !poseidonTld}
        className="btn-primary w-full disabled:opacity-40"
      >
        {busy ? "Registering…" : poseidonTld ? `Register ${label || "…"}.${tld}` : "Poseidon hosts .tact / .btc only"}
      </button>
      {msg && <p className="text-sm text-sky-200/60">{msg}</p>}
    </GlassCard>
  );
}
