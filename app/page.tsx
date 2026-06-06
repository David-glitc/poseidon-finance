import Link from "next/link";
import { MultiResolver } from "@/components/MultiResolver";
import { DashboardStats } from "@/components/DashboardStats";
import { Panel } from "@/components/Panel";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="border border-[var(--pf-border)] bg-[var(--pf-surface)] p-8">
        <p className="label">Poseidon Finance</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          Tacit DeFi &amp; name resolution
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--pf-muted)]">
          Register <strong className="text-[var(--pf-text)]">.tact</strong> names on Poseidon.
          Resolve <strong className="text-[var(--pf-text)]">.eth</strong>,{" "}
          <strong className="text-[var(--pf-text)]">.wei</strong>, and{" "}
          <strong className="text-[var(--pf-text)]">.btc</strong> to send on the right chain.
          Swap via Tacit AMM with mainnet or signet.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/names" className="btn-primary">
            Register .tact
          </Link>
          <Link href="/send" className="btn-outline">
            Send by name
          </Link>
          <Link href="/swap" className="btn-outline">
            Swap
          </Link>
        </div>
      </section>

      <MultiResolver compact />
      <DashboardStats />
    </div>
  );
}
