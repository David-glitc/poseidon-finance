import { NameSearch } from "@/components/NameSearch";
import { NameRegister } from "@/components/NameRegister";
import { MultiResolver } from "@/components/MultiResolver";
import { GlassCard } from "@/components/GlassCard";
import { loadSnapshotBundle } from "@/lib/tact-names/store";
import { VANITY_PREMIUM_LABELS } from "@/lib/names/pricing";

export const dynamic = "force-dynamic";

export default function NamesPage() {
  const bundle = loadSnapshotBundle();
  const vanityList = [...VANITY_PREMIUM_LABELS].slice(0, 8).join(", ");

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-sky-400/60">Names</p>
        <h1 className="glow-text mt-2 font-display text-3xl font-bold md:text-4xl">
          .tact · .btc registry
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-sky-200/45">
          Off-chain Merkle registry with full client verifier. Economy names from $2, vanity
          premium set at $20 max — inspired by{" "}
          <a href="https://wei.domains" className="text-sky-300 underline">
            .wei
          </a>
          .
        </p>
      </div>

      <MultiResolver />
      <NameSearch />

      <div className="grid gap-6 lg:grid-cols-2">
        <NameRegister />
        <GlassCard className="space-y-3 p-6 text-sm text-sky-200/50">
          <h2 className="font-display text-lg font-semibold text-sky-100">
            Verifier model
          </h2>
          <ul className="list-inside list-disc space-y-2">
            <li>Live resolve returns registration + Merkle proof</li>
            <li>Client verifies proof against published root</li>
            <li>Snapshot cached in browser as full fallback</li>
            <li>Records: ETH, BTC, Tacit shielded (tcs1), text</li>
          </ul>
          <div className="rounded-2xl border border-sky-400/10 bg-black/30 p-3 font-mono text-xs text-sky-300/60">
            root: {bundle.snapshot.merkleRoot.slice(0, 18)}…
            <br />
            names: {bundle.snapshot.count}
          </div>
          <p className="text-xs text-sky-400/40">
            Vanity premium (${20}): {vanityList}…
          </p>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <h2 className="font-display text-lg font-semibold text-sky-100">Registered</h2>
        <ul className="mt-4 divide-y divide-sky-400/10">
          {bundle.registrations.map((r) => (
            <li key={`${r.label}-${r.tld ?? "tact"}`} className="flex items-center justify-between py-3">
              <a href={`/names/${r.label}`} className="text-sky-200 hover:underline">
                {r.label}.{r.tld ?? "tact"}
              </a>
              <span className="font-mono text-xs text-sky-400/35">
                {r.ownerEth.slice(0, 10)}…
              </span>
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
}
