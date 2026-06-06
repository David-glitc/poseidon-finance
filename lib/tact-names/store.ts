import fs from "fs";
import path from "path";
import type { TactBooking, TactRegistration, RegistrySnapshot } from "./types";
import { leafHash, merkleProof, merkleRoot } from "./poseidon-hash";
import { isValidLabel, normalizeLabel } from "./normalize";

const DATA_DIR = path.join(process.cwd(), "data");
const REGISTRY_PATH = path.join(DATA_DIR, "registry.json");
const BOOKINGS_PATH = path.join(DATA_DIR, "bookings.json");
const SNAPSHOT_PATH = path.join(DATA_DIR, "snapshot.json");

export interface RegistryFile {
  version: number;
  registrations: TactRegistration[];
}

export interface BookingsFile {
  bookings: TactBooking[];
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJson<T>(file: string, fallback: T): T {
  ensureDataDir();
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(fallback, null, 2));
    return fallback;
  }
  return JSON.parse(fs.readFileSync(file, "utf8")) as T;
}

function writeJson(file: string, data: unknown) {
  ensureDataDir();
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

export function loadRegistry(): RegistryFile {
  return readJson<RegistryFile>(REGISTRY_PATH, { version: 1, registrations: [] });
}

export function saveRegistry(data: RegistryFile) {
  writeJson(REGISTRY_PATH, data);
  rebuildSnapshot(data);
}

export function loadBookings(): BookingsFile {
  return readJson<BookingsFile>(BOOKINGS_PATH, { bookings: [] });
}

export function saveBookings(data: BookingsFile) {
  writeJson(BOOKINGS_PATH, data);
}

export function getRegistration(
  label: string,
  tld: "tact" | "btc" = "tact",
): TactRegistration | null {
  const norm = normalizeLabel(label);
  if (!isValidLabel(norm)) return null;
  const reg = loadRegistry();
  const now = Date.now();
  return (
    reg.registrations.find(
      (r) => r.label === norm && (r.tld ?? "tact") === tld && r.expiresAt > now,
    ) ?? null
  );
}

export function isBooked(
  label: string,
  tld: "tact" | "btc" = "tact",
): TactBooking | null {
  const norm = normalizeLabel(label);
  const now = Date.now();
  const { bookings } = loadBookings();
  return (
    bookings.find(
      (b) =>
        b.label === norm &&
        (b.tld ?? "tact") === tld &&
        b.expiresAt > now,
    ) ?? null
  );
}

export function upsertRegistration(entry: TactRegistration): void {
  const norm = normalizeLabel(entry.label);
  if (!isValidLabel(norm)) throw new Error("invalid label");
  const reg = loadRegistry();
  const tld = entry.tld ?? "tact";
  reg.registrations = reg.registrations.filter(
    (r) => r.label !== norm || (r.tld ?? "tact") !== tld,
  );
  reg.registrations.push({ ...entry, label: norm });
  saveRegistry(reg);
}

export function addBooking(booking: TactBooking): void {
  const norm = normalizeLabel(booking.label);
  if (!isValidLabel(norm)) throw new Error("invalid label");
  const tld = booking.tld ?? "tact";
  if (getRegistration(norm, tld)) throw new Error("already registered");
  const data = loadBookings();
  data.bookings = data.bookings.filter(
    (b) =>
      b.label !== norm ||
      (b.tld ?? "tact") !== tld ||
      b.expiresAt <= Date.now(),
  );
  data.bookings.push({ ...booking, label: norm });
  saveBookings(data);
}

export function rebuildSnapshot(reg: RegistryFile = loadRegistry()): RegistrySnapshot {
  const now = Date.now();
  const active = reg.registrations.filter((r) => r.expiresAt > now);
  const leaves = active.map((r) =>
    leafHash(r.label, r.tld ?? "tact", r.ownerEth, JSON.stringify(r.records)),
  );
  const snapshot: RegistrySnapshot = {
    version: 1,
    generatedAt: Date.now(),
    merkleRoot: merkleRoot(leaves),
    count: active.length,
  };
  writeJson(SNAPSHOT_PATH, { snapshot, leaves, registrations: active });
  return snapshot;
}

export function loadSnapshotBundle() {
  ensureDataDir();
  if (!fs.existsSync(SNAPSHOT_PATH)) rebuildSnapshot();
  return JSON.parse(fs.readFileSync(SNAPSHOT_PATH, "utf8")) as {
    snapshot: RegistrySnapshot;
    leaves: string[];
    registrations: TactRegistration[];
  };
}

export function resolveWithProof(label: string): {
  registration: TactRegistration | null;
  proof: string[];
  snapshot: RegistrySnapshot;
  leaf: string | null;
} {
  const norm = normalizeLabel(label);
  const bundle = loadSnapshotBundle();
  const registration =
    bundle.registrations.find((r) => r.label === norm) ?? null;
  if (!registration) {
    return {
      registration: null,
      proof: [],
      snapshot: bundle.snapshot,
      leaf: null,
    };
  }
  const leaf = leafHash(
    registration.label,
    registration.tld ?? "tact",
    registration.ownerEth,
    JSON.stringify(registration.records),
  );
  const idx = bundle.leaves.indexOf(leaf);
  const proof = idx >= 0 ? merkleProof(bundle.leaves, idx) : [];
  return { registration, proof, snapshot: bundle.snapshot, leaf };
}
