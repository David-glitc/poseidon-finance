"use client";

import { useEffect, useState } from "react";
import { useBtcWallet, useEthWallet } from "@/lib/wallet/provider";
import { isValidLabel, normalizeLabel } from "@/lib/tact-names/normalize";
import type { PriceQuote } from "@/lib/names/pricing";
import { Panel } from "./Panel";

export function NameRegister() {
  const { address } = useEthWallet();
  const { btcAddress } = useBtcWallet();
  const [label, setLabel] = useState("");
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
    fetch(`/api/names/price?label=${norm}&tld=tact`)
      .then((r) => r.json())
      .then(setQuote)
      .catch(() => setQuote(null));
  }, [label]);

  async function register() {
    const norm = normalizeLabel(label);
    if (!isValidLabel(norm)) {
      setMsg("Use 1–62 lowercase letters and numbers.");
      return;
    }
    if (!address) {
      setMsg("Connect an Ethereum wallet first.");
      return;
    }
    if (!quote) {
      setMsg("Price unavailable.");
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
          tld: "tact",
          ownerEth: address,
          ownerBtc: btcAddress,
          sig: `book:${norm}.tact:${address}:${Date.now()}`,
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
          tld: "tact",
          ownerEth: address,
          ownerBtc: btcAddress,
          priceUsd: quote.usd,
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
      setMsg(`Registered ${norm}.tact — $${quote.usd}`);
      setLabel("");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Panel title="Register .tact">
      <p className="mb-4 text-sm text-[var(--pf-muted)]">
        Poseidon hosts <strong className="text-[var(--pf-text)]">.tact</strong> only.{" "}
        <span className="text-[var(--pf-muted)]">.eth</span> and{" "}
        <span className="text-[var(--pf-muted)]">.wei</span> are resolve-only for sending on EVM.
      </p>
      <div className="flex gap-2">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="yourname"
          className="input flex-1"
        />
        <span className="flex items-center border border-[var(--pf-border)] bg-[var(--pf-bg)] px-3 text-sm text-[var(--pf-muted)]">
          .tact
        </span>
      </div>
      {quote && (
        <div className="mt-3 border border-[var(--pf-border)] px-3 py-2 text-sm">
          <span className="text-[var(--pf-muted)]">Price </span>
          <span className="font-medium">${quote.usd}</span>
          <span className="ml-2 text-xs uppercase text-[var(--pf-muted)]">{quote.tier}</span>
        </div>
      )}
      <input
        value={tacitShielded}
        onChange={(e) => setTacitShielded(e.target.value)}
        placeholder="tcs1… shielded address (optional)"
        className="input mt-3 text-sm"
      />
      <button type="button" onClick={register} disabled={busy} className="btn-primary mt-4 w-full">
        {busy ? "Registering…" : `Register ${label || "name"}.tact`}
      </button>
      {msg && <p className="mt-3 text-sm text-[var(--pf-muted)]">{msg}</p>}
    </Panel>
  );
}
