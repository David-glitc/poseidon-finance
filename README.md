# Poseidon Finance

Liquid-glass Tacit DeFi UI — multi-resolver names (`.tact`, `.btc`, `.wei`, `.eth`), confidential AMM swap discovery, BTC + ETH + Tacit wallet hub.

## Stack

- Next.js 15, Tailwind, wagmi (ETH), sats-connect (BTC)
- Off-chain Poseidon registry with Poseidon4 Merkle proofs
- Tacit worker API for assets/pools; Groth16 swaps via [tacit.finance](https://tacit.finance)

## Pricing

| Tier | USD |
|------|-----|
| Economy (5+ chars) | $2 |
| Standard (4 chars) | $10 |
| Premium (3 chars / 1–2 chars) | $15–$20 |
| Vanity fixed set | $20 max |

## Dev

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy (Coolify + GHCR)

Same pattern as [chessonchain](https://github.com/incryptoencrypted/chessonchain):

1. Push to `main` → GitHub Actions builds Docker image → `ghcr.io/david-glitc/poseidon-finance`
2. Coolify pulls `:main` or `:production` (no server build)
3. GitHub **production** environment secrets:
   - `COOLIFY_DEPLOY_WEBHOOK` — Coolify deploy webhook URL
   - `COOLIFY_TOKEN` — Coolify API token
   - `NEXT_PUBLIC_APP_URL` — public site URL (optional)
   - `NEXT_PUBLIC_TACIT_WORKER_URL` — override worker (optional)
   - `REGISTRY_TREASURY_ADDRESS` — ETH treasury for registrations (optional)

## Routes

| Path | Purpose |
|------|---------|
| `/` | Dashboard + multi-resolver |
| `/swap` | Tacit AMM pool picker → tacit.finance |
| `/wallet` | ETH + BTC + Tacit key hub |
| `/names` | Register `.tact` / `.btc` |
| `/market` | Tacit asset browser |
| `/send` | Send by name |

## API

- `GET /api/names/resolve?label=&tld=`
- `GET /api/names/price?label=&tld=`
- `GET /api/registry/snapshot`
- `POST /api/registry/book` · `POST /api/registry/register`
