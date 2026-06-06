import { WalletHub } from "@/components/WalletHub";
import { GlassCard } from "@/components/GlassCard";

export default function WalletPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-sky-400/60">Wallets</p>
        <h1 className="glow-text mt-2 font-display text-3xl font-bold md:text-4xl">
          Tri-chain hub
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-sky-200/45">
          Ethereum for .wei / .eth and registration payments, Bitcoin for .btc handles,
          Tacit for confidential balances and AMM.
        </p>
      </div>
      <WalletHub />
      <GlassCard className="p-6 text-sm text-sky-200/50">
        <h2 className="font-display text-lg font-semibold text-sky-100">Tacit wallet pattern</h2>
        <p className="mt-2">
          Poseidon mirrors the tacit.finance dapp: sats-connect for L1 BTC, in-browser Tacit key
          for shielded UTXOs, worker API for assets/pools, and deep links into the swap tab for
          proof-backed trades.
        </p>
      </GlassCard>
    </div>
  );
}
