import { TacitSwapPanel } from "@/components/TacitSwapPanel";
import { GlassCard } from "@/components/GlassCard";

export default function SwapPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-sky-400/60">AMM</p>
        <h1 className="glow-text mt-2 font-display text-3xl font-bold md:text-4xl">
          Confidential swap
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-sky-200/45">
          Pool discovery on Poseidon — proof generation and settlement in the Tacit wallet,
          same flow as tacit.finance.
        </p>
      </div>
      <TacitSwapPanel />
      <div className="grid gap-4 md:grid-cols-3">
        <GlassCard className="p-5 text-sm text-sky-200/50">
          <h3 className="font-semibold text-sky-100">1 · Connect</h3>
          <p className="mt-2">Link ETH for names, BTC via sats-connect, Tacit key on tacit.finance.</p>
        </GlassCard>
        <GlassCard className="p-5 text-sm text-sky-200/50">
          <h3 className="font-semibold text-sky-100">2 · Select pool</h3>
          <p className="mt-2">Reserves pulled from the Tacit worker indexer.</p>
        </GlassCard>
        <GlassCard className="p-5 text-sm text-sky-200/50">
          <h3 className="font-semibold text-sky-100">3 · Prove & swap</h3>
          <p className="mt-2">Groth16 batch proofs keep amounts confidential on Bitcoin L1.</p>
        </GlassCard>
      </div>
    </div>
  );
}
