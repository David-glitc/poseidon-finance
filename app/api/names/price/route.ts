import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { quoteRegistration } from "@/lib/names/pricing";
import { isValidLabel, normalizeLabel } from "@/lib/tact-names/normalize";
import type { NameTld } from "@/lib/names/tlds";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const label = normalizeLabel(url.searchParams.get("label") ?? "");
  const tld = (url.searchParams.get("tld") ?? "tact") as NameTld;

  if (!isValidLabel(label)) {
    return NextResponse.json({ error: "invalid label" }, { status: 400 });
  }

  return NextResponse.json(quoteRegistration(label, tld));
}
