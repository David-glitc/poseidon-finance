import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { isValidLabel, normalizeLabel } from "@/lib/tact-names/normalize";
import { resolveWithProof, loadSnapshotBundle } from "@/lib/tact-names/store";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  const label = normalizeLabel(name);
  if (!isValidLabel(label)) {
    return NextResponse.json({ error: "invalid name" }, { status: 400 });
  }
  const { registration, proof, snapshot, leaf } = resolveWithProof(label);
  const bundle = loadSnapshotBundle();
  return NextResponse.json({
    name: `${label}.tact`,
    registration,
    proof,
    snapshot,
    leaf,
    registrations: bundle.registrations,
  });
}
