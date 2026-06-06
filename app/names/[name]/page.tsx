import { notFound } from "next/navigation";
import { isValidLabel, normalizeLabel, toDisplayName } from "@/lib/tact-names/normalize";
import { resolveWithProof } from "@/lib/tact-names/store";
import { verifyRegistration } from "@/lib/tact-names/verify";

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
    registration && leaf
      ? verifyRegistration(registration, proof, snapshot)
      : false;

  if (!registration) {
    return (
      <div className="glass p-8 text-center">
        <h1 className="font-display text-2xl font-bold">{toDisplayName(label)}</h1>
        <p className="mt-4 text-white/50">Not registered — claim it on the names page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass p-8">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl font-bold">{toDisplayName(label)}</h1>
          <span
            className={`rounded-full px-3 py-1 text-xs ${verified ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"}`}
          >
            {verified ? "Merkle verified" : "Unverified"}
          </span>
        </div>
        <p className="mt-2 font-mono text-sm text-white/40">owner {registration.ownerEth}</p>
      </div>

      <div className="glass p-6">
        <h2 className="font-display text-lg font-semibold">Records</h2>
        <dl className="mt-4 space-y-3 text-sm">
          {Object.entries(registration.records).map(([k, v]) =>
            v ? (
              <div key={k} className="grid gap-1 sm:grid-cols-[140px_1fr]">
                <dt className="text-white/40">{k}</dt>
                <dd className="break-all font-mono text-foam">{v}</dd>
              </div>
            ) : null,
          )}
        </dl>
      </div>

      <div className="glass p-6 font-mono text-xs text-white/40">
        <div>merkle_root: {snapshot.merkleRoot}</div>
        <div>proof_depth: {proof.length}</div>
        <div>source: live registry snapshot</div>
      </div>
    </div>
  );
}
