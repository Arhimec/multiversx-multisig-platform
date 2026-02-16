# User Guide

## Getting Started

### 1. Connect Your Wallet

1. Open the app at `http://localhost:3000` (or your deployed URL)
2. Click **Connect Wallet**
3. Choose your connection method:
   - **xPortal** — Scan QR with xPortal mobile app
   - **DeFi Wallet** — Browser extension
   - **Web Wallet** — MultiversX web wallet
   - **Ledger** — Hardware wallet

### 2. Dashboard

After connecting, you'll see the Dashboard with:
- **Your multisig wallets** — All multisigs you're a member of
- **Activity panel** — Recent proposals and transactions
- **Quick actions** — Create new multisig, manage existing ones

### 3. Create a Multisig

1. Click **Create Multisig** in the sidebar
2. Enter the **quorum** (minimum signatures required)
3. Add **board member addresses** (erd1...)
4. Confirm the transaction in your wallet
5. The new multisig address will appear on the Dashboard

## Core Features

### Proposals

1. Open a multisig → click **New Proposal**
2. Choose action type (send EGLD, add member, change quorum, etc.)
3. Fill in details and submit
4. Other board members will see the proposal and can **sign** or **unsign**
5. Once quorum is reached, anyone can **execute** the proposal

### Transaction History

- Go to **History** in the sidebar
- Filter by date, type, or status
- Search by transaction hash or address
- Export as CSV or JSON

### Address Book

- Go to **Address Book** in the sidebar
- Add contacts with name, address, and optional notes
- Use contacts when creating proposals (quick-fill)

## Advanced Features

### Analytics
Visual charts showing treasury balance, transaction volume, and member activity.

### Staking
Browse MultiversX staking providers with APR, delegation caps, and status.

### Settings
- Switch network (mainnet/testnet/devnet)
- Toggle notifications
- Backup/restore app data (JSON export/import)
- Clear all local data

### Multi-Chain (Vision)
View supported blockchains and future cross-chain bridge functionality.

### Governance
Create and vote on governance proposals within your multisig organization.

### Plugins
Browse and install plugins to extend multisig functionality (monitoring, DeFi, security).

### 2FA
Add extra security with authenticator app, SMS, or biometric verification.

### Social Recovery
Designate trusted guardians who can help recover access to your multisig.

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| Click sidebar item | Navigate to page |
| ESC | Close modals |

## Troubleshooting

| Issue | Solution |
|---|---|
| Wallet won't connect | Check WalletConnect project ID in `.env` |
| "No multisigs found" | Create one or check you're on the correct network |
| Transaction fails | Ensure sufficient EGLD balance for gas |
| Page is blank | Check browser console for errors, restart dev server |
