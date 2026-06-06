import { TacitSwapPanel } from "@/components/TacitSwapPanel";

export const dynamic = "force-dynamic";

export default function SwapPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Swap</h1>
        <p className="mt-2 text-sm text-[var(--pf-muted)]">
          Confidential AMM on Tacit. Select mainnet or signet in the network bar.
        </p>
      </div>
      <TacitSwapPanel />
    </div>
  );
}
