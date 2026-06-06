import { NextResponse } from "next/server";
import {
  getRegistration,
  isBooked,
  upsertRegistration,
} from "@/lib/tact-names/store";
import { isValidLabel, normalizeLabel } from "@/lib/tact-names/normalize";
import type { TactRecords } from "@/lib/tact-names/types";
import { quoteRegistration } from "@/lib/names/pricing";

const REGISTRY_TTL_MS = 365 * 24 * 60 * 60 * 1000;

export async function POST(req: Request) {
  const body = await req.json();
  const label = normalizeLabel(body.label ?? "");
  const tld = (body.tld === "btc" ? "btc" : "tact") as "tact" | "btc";
  const ownerEth = String(body.ownerEth ?? "").toLowerCase();
  const ownerBtc = body.ownerBtc ? String(body.ownerBtc) : undefined;
  const records = (body.records ?? {}) as TactRecords;
  const bookingSig = body.bookingSig ? String(body.bookingSig) : undefined;
  const priceUsd = Number(body.priceUsd ?? 0);

  if (!isValidLabel(label) || !ownerEth) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }
  if (priceUsd > 20 || (priceUsd > 0 && priceUsd < 2)) {
    return NextResponse.json({ error: "invalid price" }, { status: 400 });
  }
  if (getRegistration(label, tld)) {
    return NextResponse.json({ error: "already registered" }, { status: 409 });
  }

  const booking = isBooked(label);
  if (!booking || booking.ownerEth !== ownerEth) {
    return NextResponse.json({ error: "book name first" }, { status: 403 });
  }

  const now = Date.now();
  upsertRegistration({
    label,
    tld,
    ownerEth,
    ownerBtc,
    records,
    registeredAt: now,
    expiresAt: now + REGISTRY_TTL_MS,
    bookingSig,
  });

  return NextResponse.json({
    ok: true,
    name: `${label}.${tld}`,
    expiresAt: now + REGISTRY_TTL_MS,
  });
}
