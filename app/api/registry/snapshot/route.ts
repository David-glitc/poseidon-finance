import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { loadSnapshotBundle } from "@/lib/tact-names/store";

export async function GET() {
  const bundle = loadSnapshotBundle();
  return NextResponse.json({
    snapshot: bundle.snapshot,
    registrations: bundle.registrations,
  });
}
