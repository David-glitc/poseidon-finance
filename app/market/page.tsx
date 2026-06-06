import { MarketView } from "@/components/MarketView";

export const dynamic = "force-dynamic";

export default async function MarketPage({
  searchParams,
}: {
  searchParams: Promise<{ asset?: string }>;
}) {
  const { asset } = await searchParams;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Market</h1>
        <p className="mt-2 text-sm text-[var(--pf-muted)]">
          Tacit assets and listings. Network follows the selector above.
        </p>
      </div>
      <MarketView focusAsset={asset} />
    </div>
  );
}
