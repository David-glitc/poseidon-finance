import { notFound } from "next/navigation";
import { isValidLabel, normalizeLabel, toDisplayName } from "@/lib/tact-names/normalize";
import { resolveWithProof } from "@/lib/tact-names/store";
import { verifyRegistration } from "@/lib/tact-names/verify";
import { Panel } from "@/components/Panel";

export const dynamic = "force-dynamic";

export default async function NameDetailPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const label = normalizeLabel(name);
  if (!isValidLabel(label)) notFound();

  const { registration, proof, snapshot, leaf } = resolveWithProof(label);
  const verified =
    registration && leaf ? verifyRegistration(registration, proof, snapshot) : false;

  if (!registration) {
    return (
      <Panel>
        <h1 className="text-xl font-semibold">{toDisplayName(label)}</h1>
        <p className="mt-3 text-sm text-[var(--pf-muted)]">Not registered.</p>
      </Panel>
    );
  }

  return (
    <div className="space-y-4">
      <Panel>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold">{registration.label}.tact</h1>
          <span className="border border-[var(--pf-border)] px-2 py-0.5 text-[10px] uppercase">
            {verified ? "verified" : "unverified"}
          </span>
        </div>
        <p className="mt-2 font-[family-name:var(--font-mono)] text-xs text-[var(--pf-muted)]">
          {registration.ownerEth}
        </p>
      </Panel>
      <Panel title="Records">
        <dl className="space-y-2 text-sm">
          {Object.entries(registration.records).map(([k, v]) =>
            v ? (
              <div key={k} className="grid gap-1 sm:grid-cols-[120px_1fr]">
                <dt className="text-[var(--pf-muted)]">{k}</dt>
                <dd className="break-all font-[family-name:var(--font-mono)] text-xs">{v}</dd>
              </div>
            ) : null,
          )}
        </dl>
      </Panel>
    </div>
  );
}
