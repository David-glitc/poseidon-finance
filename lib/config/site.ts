/** Planned production domain — buy when ready; app works before DNS exists. */
export const PLANNED_DOMAIN = "poseidonfinance.cc";
export const PLANNED_ORIGIN = `https://${PLANNED_DOMAIN}`;

/** Coolify / preview host until domain is live (set in env when deployed). */
export function getSiteOrigin(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return PLANNED_ORIGIN;
}

export function getSiteUrl(path = "/"): string {
  const base = getSiteOrigin();
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}
