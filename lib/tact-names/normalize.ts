const LABEL_RE = /^[a-z0-9]{1,62}$/;

export function stripTactSuffix(raw: string): string {
  const s = raw.trim().toLowerCase();
  return s.endsWith(".tact") ? s.slice(0, -5) : s;
}

export function normalizeLabel(raw: string): string {
  return stripTactSuffix(raw);
}

export function isValidLabel(label: string): boolean {
  return LABEL_RE.test(label);
}

export function toDisplayName(label: string): string {
  return `${normalizeLabel(label)}.tact`;
}
