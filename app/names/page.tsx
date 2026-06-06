import { NameRegister } from "@/components/NameRegister";
import { MultiResolver } from "@/components/MultiResolver";
import { Panel } from "@/components/Panel";
import { VANITY_PREMIUM_LABELS } from "@/lib/names/pricing";

export const dynamic = "force-dynamic";

export default function NamesPage() {
  const vanityList = [...VANITY_PREMIUM_LABELS].slice(0, 6).join(", ");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Names</h1>
        <p className="mt-2 text-sm text-[var(--pf-muted)]">
          Register <strong className="text-[var(--pf-text)]">.tact</strong> on Poseidon ($2–$20).
          Use the resolver for .eth, .wei, and .btc when sending.
        </p>
      </div>

      <MultiResolver compact />

      <div className="grid gap-4 lg:grid-cols-2">
        <NameRegister />
        <Panel title="Registry">
          <ul className="list-inside list-disc space-y-2 text-sm text-[var(--pf-muted)]">
            <li>Merkle snapshots with client-side verification</li>
            <li>Records: ETH, BTC, Tacit shielded</li>
            <li>Vanity premium ($20): {vanityList}…</li>
          </ul>
        </Panel>
      </div>
    </div>
  );
}
