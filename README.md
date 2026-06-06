# Poseidon Finance

Tacit DeFi UI — register **.tact** names, resolve **.eth / .wei / .btc** for payments, swap via Tacit AMM.

## Deploy on Coolify (direct build — no GitHub Actions)

1. Coolify → **+ New** → **Public Repository**
2. URL: `https://github.com/David-glitc/poseidon-finance`
3. Branch: `main`
4. Build pack: **Nixpacks** (or Dockerfile)
5. Port: `3000`
6. Env vars:
   - `NEXT_PUBLIC_APP_URL` = your Coolify URL (later `https://poseidonfinance.cc`)
   - `NODE_ENV` = `production`
7. Enable **Auto Deploy** on push

Persistent volume (recommended): mount `/app/data` so registry survives redeploys.

## Local dev

```bash
npm install
npm run dev
```

## Domain (later)

Planned: `poseidonfinance.cc`. Set `NEXT_PUBLIC_APP_URL` when DNS points to Coolify.

## Networks

| Chain | Options |
|-------|---------|
| Tacit | mainnet, signet |
| ETH | mainnet, sepolia |
| BTC | mainnet, signet (sats-connect) |

## Names

- **Register:** `.tact` only ($2–$20)
- **Resolve only:** `.eth`, `.wei`, `.btc` — use Send page or resolver
