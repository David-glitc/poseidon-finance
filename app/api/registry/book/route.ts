import { NextResponse } from "next/server";
import { addBooking, getRegistration, isBooked } from "@/lib/tact-names/store";
import { isValidLabel, normalizeLabel } from "@/lib/tact-names/normalize";
import { quoteRegistration } from "@/lib/names/pricing";

const BOOKING_TTL_MS = 15 * 60 * 1000;

export async function POST(req: Request) {
  const body = await req.json();
  const label = normalizeLabel(body.label ?? "");
  const tld = (body.tld === "btc" ? "btc" : "tact") as "tact" | "btc";
  const ownerEth = String(body.ownerEth ?? "").toLowerCase();
  const ownerBtc = body.ownerBtc ? String(body.ownerBtc) : undefined;
  const sig = String(body.sig ?? "");
  const priceUsd = Number(body.priceUsd ?? 0);

  if (!isValidLabel(label) || !ownerEth || !sig) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const quote = quoteRegistration(label, tld);
  if (priceUsd !== quote.usd) {
    return NextResponse.json({ error: "invalid price" }, { status: 400 });
  }

  if (getRegistration(label, tld)) {
    return NextResponse.json({ error: "already registered" }, { status: 409 });
  }
  const existing = isBooked(label, tld);
  if (existing && existing.ownerEth !== ownerEth) {
    return NextResponse.json({ error: "name booked" }, { status: 409 });
  }

  const now = Date.now();
  const booking = {
    label,
    tld,
    ownerEth,
    ownerBtc,
    createdAt: now,
    expiresAt: now + BOOKING_TTL_MS,
    sig,
  };
  addBooking(booking);
  return NextResponse.json({ ok: true, booking, quote });
}
