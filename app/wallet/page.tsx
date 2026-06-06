import { WalletHub } from "@/components/WalletHub";
import { Panel } from "@/components/Panel";

export const dynamic = "force-dynamic";

export default function WalletPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Wallets</h1>
        <p className="mt-2 text-sm text-[var(--pf-muted)]">
          ETH for registration and EVM sends. BTC via sats-connect. Tacit key on tacit.finance.
        </p>
      </div>
      <WalletHub />
      <Panel title="How it fits together">
        <ul className="list-inside list-disc space-y-2 text-sm text-[var(--pf-muted)]">
          <li>Register .tact with your ETH address</li>
          <li>Resolve .eth / .wei to pay users on mainnet or sepolia</li>
          <li>Swap and shielded sends open in the Tacit dApp</li>
        </ul>
      </Panel>
    </div>
  );
}
