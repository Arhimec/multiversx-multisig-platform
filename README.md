# MultiSingX — Secure Multisig Vault for MultiversX

![MultiversX](https://img.shields.io/badge/MultiversX-Ecosystem-23F7DD?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkw0IDdWMTdMMTIgMjJMMjAgMTdWN0wxMiAyWiIgZmlsbD0iIzIzRjdERCIvPjwvc3ZnPg==)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Devnet-blue?style=for-the-badge)

> 🤖 *This project was built with AI assistance. I'm not a developer — I'm learning to build by combining my ideas with AI tools.*

**MultiSingX** is a multi-signature vault platform built on the MultiversX blockchain. It provides secure, transparent, and collaborative management of digital assets through a multisig smart contract.

🌐 **Live Demo**: [multisingx.com](https://multisingx.com)

---

## ✨ Features

- 🔐 **Multi-Signature Wallets** — Create and manage multisig vaults with configurable quorum
- 📊 **Dashboard** — Real-time overview of your multisig wallets, proposals, and balances
- 📜 **Proposal System** — Create, vote, and execute proposals (transfers, member changes, quorum updates)
- 📈 **Analytics** — Visual insights into wallet activity and transaction history
- 💰 **Staking** — Delegate EGLD to validators directly from your multisig
- 🌍 **Multi-Chain Vision** — Roadmap for cross-chain multisig support (15 chains planned)
- 🖼️ **NFT Treasury** — Manage NFTs with XOXNO integration (coming soon)
- 🗳️ **Governance** — On-chain voting for collective decision-making
- 🔑 **2FA & Social Recovery** — Extra security layers for your vault
- 📖 **Address Book** — Save and label frequently used addresses
- ⚙️ **Settings** — Network selection, data export, and customization

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript + Vite |
| **Styling** | Tailwind CSS + Custom animations |
| **Blockchain SDK** | `@multiversx/sdk-dapp` + `@multiversx/sdk-core` |
| **Smart Contract** | Rust (MultiversX SC framework) |
| **Deployment** | Vercel |
| **Network** | MultiversX Devnet (Mainnet ready) |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MultiversX wallet (xPortal, Web Wallet, or DeFi Wallet)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/multiversx-multisig-platform.git
cd multiversx-multisig-platform

# Install frontend dependencies
cd frontend
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Smart Contract

The multisig smart contract is written in Rust and deployed on MultiversX Devnet:

```bash
cd contract
# Build the contract
mxpy contract build

# Deploy to devnet
mxpy contract deploy --bytecode output/multisig.wasm --chain D --proxy https://devnet-gateway.multiversx.com
```

## 📁 Project Structure

```
multiversx-multisig-platform/
├── contract/              # Rust smart contract
│   ├── src/
│   │   ├── lib.rs         # Main contract entry
│   │   ├── action.rs      # Action types
│   │   ├── multisig_state.rs
│   │   ├── multisig_propose.rs
│   │   └── multisig_perform.rs
│   └── wasm/              # WASM build output
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route pages
│   │   ├── hooks/         # Custom React hooks
│   │   ├── config/        # Network configuration
│   │   ├── contracts/     # ABI and interaction logic
│   │   └── utils/         # Helper functions
│   └── ...
└── docs/                  # Documentation
```

## 🌐 Networks

MultiSingX supports multiple MultiversX networks:

| Network | Status | Description |
|---------|--------|-------------|
| **Devnet** | ✅ Active | Development and testing |
| **Testnet** | 🔧 Ready | Pre-production testing |
| **Mainnet** | 🔜 Coming | Production deployment |

## 🤝 Contributing

Contributions are welcome! Whether you're a developer, designer, or just have ideas — feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- 🌐 [Live Demo](https://multisingx.com)
- 📖 [MultiversX Documentation](https://docs.multiversx.com)
- 🐦 [Follow on X/Twitter](https://x.com)

---

*Built with ❤️ for the MultiversX ecosystem*
