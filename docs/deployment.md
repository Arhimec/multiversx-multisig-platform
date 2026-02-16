# Deployment Guide

## Prerequisites

- Node.js 18+
- Rust + `wasm32-unknown-unknown` target
- `mxpy` (MultiversX SDK CLI)
- A MultiversX wallet with funds (devnet xEGLD or real EGLD)

## 1. Build the Smart Contract

```bash
# Install Rust wasm target (one-time)
rustup target add wasm32-unknown-unknown

# Build
cd contract/meta
cargo run -- build
```

Output files:
- `contract/output/multiversx-multisig.wasm` — compiled bytecode
- `contract/output/multiversx-multisig.abi.json` — ABI

## 2. Deploy to Devnet

### Get devnet funds
1. Go to [devnet-wallet.multiversx.com/faucet](https://devnet-wallet.multiversx.com/faucet)
2. Request xEGLD for your wallet address

### Export PEM file
```bash
# From mxpy
mxpy wallet derive --mnemonic --pem-file=wallet.pem
# Or export from xPortal / DeFi Wallet
```

### Deploy
```bash
node scripts/deploy-devnet.mjs \
  --pem=wallet.pem \
  --quorum=2 \
  --board=erd1addr1...,erd1addr2...,erd1addr3...
```

### Update frontend config
After deployment, copy the contract address and update:
```typescript
// frontend/src/config/network.ts
devnet: {
    multisigContractAddress: 'erd1qqqqqqqqqqqqqpg...',  // ← paste here
}
```

## 3. Deploy Frontend

### Option A: Vercel (recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Set environment variables in Vercel dashboard:
# VITE_WALLETCONNECT_PROJECT_ID = your_project_id
# VITE_NETWORK = devnet (or mainnet)
```

### Option B: Netlify

```bash
cd frontend
npm run build

# Upload dist/ folder to Netlify
# Or connect GitHub repo for auto-deploy
```

**Netlify `_redirects`** file (create in `frontend/public/`):
```
/*    /index.html   200
```

### Option C: Static hosting

```bash
cd frontend
npm run build
# Upload dist/ to any static hosting (GitHub Pages, S3, etc.)
```

## 4. Deploy to Mainnet

> ⚠️ **WARNING**: Mainnet uses real EGLD. Get a security audit before mainnet deployment.

1. Build contract (same as devnet)
2. Modify deploy script chain ID from `D` to `1`
3. Use a mainnet PEM with real EGLD funds
4. Update `frontend/src/config/network.ts` with mainnet contract address
5. Set `VITE_NETWORK=mainnet` in production environment

## Environment Variables Reference

| Variable | Development | Production |
|---|---|---|
| `VITE_WALLETCONNECT_PROJECT_ID` | Your WC ID | Your WC ID |
| `VITE_NETWORK` | `devnet` | `mainnet` |

## Security Checklist

- [ ] `wallet.pem` is in `.gitignore`
- [ ] Smart contract audited by external party
- [ ] WalletConnect project ID is set (not hardcoded)
- [ ] HTTPS enabled in production
- [ ] Contract tested thoroughly on devnet first
