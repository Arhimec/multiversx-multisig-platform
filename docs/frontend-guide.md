# Frontend Guide

## Quick Start

```bash
cd frontend
cp .env.example .env          # Add your WalletConnect project ID
npm install
npm run dev                   # http://localhost:3000
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_WALLETCONNECT_PROJECT_ID` | Yes | Get from [cloud.walletconnect.com](https://cloud.walletconnect.com) |
| `VITE_NETWORK` | No | `devnet` / `testnet` / `mainnet` (default: `devnet`) |

## Pages

| Page | File | Description |
|---|---|---|
| Unlock | `UnlockPage.tsx` | Wallet connection (xPortal, DeFi, Web, Ledger) |
| Dashboard | `DashboardPage.tsx` | Multi-multisig management, activity panel |
| Create | `CreatePage.tsx` | Deploy new multisig contract |
| Multisig | `MultisigPage.tsx` | View/manage specific multisig (proposals, sign, execute) |
| History | `HistoryPage.tsx` | Transaction history with filters and search |
| Address Book | `AddressBookPage.tsx` | Contact management (CRUD) |
| Analytics | `AnalyticsPage.tsx` | Charts, member activity, treasury stats |
| Staking | `StakingPage.tsx` | Staking providers from MultiversX API |
| Settings | `SettingsPage.tsx` | Network, notifications, backup/restore |
| Multi-Chain | `MultiChainPage.tsx` | 6 blockchain support, bridge modal |
| Governance | `GovernancePage.tsx` | Proposal creation, voting, comments |
| Plugins | `PluginsPage.tsx` | Plugin marketplace (8 plugins) |
| 2FA | `TwoFAPage.tsx` | TOTP, SMS, biometric authentication |
| Social Recovery | `SocialRecoveryPage.tsx` | Guardian management, emergency recovery |

## Components

| Component | File | Purpose |
|---|---|---|
| Layout | `Layout.tsx` | Main layout with sidebar + mobile menu |
| Navbar | `Navbar.tsx` | Top navigation bar |
| Sidebar | `Sidebar.tsx` | Left sidebar with navigation sections |
| CircuitBackground | `CircuitBackground.tsx` | Animated circuit vein background |
| R2Droid | `R2Droid.tsx` | Robot mascot SVG |
| ProtectedRoute | `ProtectedRoute.tsx` | Auth guard for routes |
| ActivityPanel | `ActivityPanel.tsx` | Real-time activity feed |

## Hooks

| Hook | File | Purpose |
|---|---|---|
| `useNotifications` | `useNotifications.ts` | Polls for pending proposals every 15s |

## Utilities

| Utility | File | Purpose |
|---|---|---|
| `formatters.ts` | Format addresses, amounts, dates |
| `exportUtils.ts` | Export data as CSV/JSON |
| `proposalMeta.ts` | Proposal descriptions/expiration in localStorage |

## Config

| File | Purpose |
|---|---|
| `network.ts` | Network configuration (API URLs, chain IDs, contract addresses) |

## Styling

- **Tailwind CSS** with custom theme (dark mode)
- **CSS variables** for colors: `--primary`, `--accent`, `--bg`, `--surface`
- **Glass morphism** via `glass-card` utility class
- **Animations** via `framer-motion` + CSS keyframes

## Adding a New Page

1. Create `src/pages/MyPage.tsx` with named export
2. Add route in `src/App.tsx`
3. Add nav item in `src/components/Layout/Sidebar.tsx`
4. Add mobile nav item in `src/components/Layout/Layout.tsx`
5. Run `npx tsc --noEmit` to verify zero errors
