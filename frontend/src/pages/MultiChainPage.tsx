import { useState } from 'react';
import { ComingSoonBanner } from '../components/ComingSoonBanner';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Globe,
    Link2,
    CheckCircle2,
    Circle,
    ArrowRightLeft,
    Zap,
    Shield,
    ExternalLink,
    Info,
    Loader2,
    AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getSelectedNetwork } from '../config/network';

/* ───────────────────────────────────────────────── */
/*  Inline SVG chain logos — professional & crisp    */
/* ───────────────────────────────────────────────── */

const ChainLogos: Record<string, React.ReactNode> = {
    multiversx: (
        <svg viewBox="0 0 32 32" className="w-7 h-7">
            <path d="M15.927 2L5 8.948v13.104L15.927 30l10.927-7.948V8.948L15.927 2zm7.282 17.79L15.927 25.12l-7.282-5.33V12.21l7.282-5.33 7.282 5.33v7.58z" fill="#23F7DD" />
            <path d="M15.927 12.21v12.91l7.282-5.33V12.21l-7.282-5.33v5.33z" fill="#23F7DD" opacity="0.6" />
        </svg>
    ),
    ethereum: (
        <svg viewBox="0 0 32 32" className="w-7 h-7">
            <path d="M16 2l-9 14.5L16 20.5l9-4L16 2z" fill="#627EEA" />
            <path d="M16 2v18.5l9-4L16 2z" fill="#627EEA" opacity="0.6" />
            <path d="M16 22l-9-5.5L16 30l9-13.5L16 22z" fill="#627EEA" />
            <path d="M16 22v8l9-13.5L16 22z" fill="#627EEA" opacity="0.6" />
        </svg>
    ),
    polygon: (
        <svg viewBox="0 0 32 32" className="w-7 h-7">
            <path d="M21.2 12.7c-.5-.3-1.1-.3-1.5 0l-3.6 2.1-2.4 1.4-3.6 2.1c-.5.3-1.1.3-1.5 0l-2.8-1.7c-.5-.3-.8-.8-.8-1.4v-3.3c0-.6.3-1.1.8-1.4l2.8-1.6c.5-.3 1.1-.3 1.5 0l2.8 1.6c.5.3.8.8.8 1.4v2.1l2.4-1.4v-2.1c0-.6-.3-1.1-.8-1.4l-5.2-3c-.5-.3-1.1-.3-1.5 0l-5.3 3c-.5.3-.8.8-.8 1.4v6c0 .6.3 1.1.8 1.4l5.2 3c.5.3 1.1.3 1.5 0l3.6-2.1 2.4-1.4 3.6-2.1c.5-.3 1.1-.3 1.5 0l2.8 1.6c.5.3.8.8.8 1.4v3.3c0 .6-.3 1.1-.8 1.4l-2.8 1.7c-.5.3-1.1.3-1.5 0l-2.8-1.6c-.5-.3-.8-.8-.8-1.4v-2.1l-2.4 1.4v2.1c0 .6.3 1.1.8 1.4l5.2 3c.5.3 1.1.3 1.5 0l5.2-3c.5-.3.8-.8.8-1.4v-6c0-.6-.3-1.1-.8-1.4l-5.2-3z" fill="#8247E5" />
        </svg>
    ),
    bnb: (
        <svg viewBox="0 0 32 32" className="w-7 h-7">
            <path d="M16 4l3.5 3.5-7.8 7.8L8.2 11.8zm7.8 3.8L20.3 11.3l3.5 3.5 3.5-3.5zM4.2 11.3L7.7 7.8l3.5 3.5-3.5 3.5zM16 13.5l3.5 3.5-3.5 3.5-3.5-3.5zm-7.8 4.7l3.5-3.5 3.5 3.5-3.5 3.5zm15.6 0l-3.5-3.5 3.5-3.5 3.5 3.5zM16 24.5l-3.5-3.5 3.5-3.5 3.5 3.5z" fill="#F3BA2F" />
        </svg>
    ),
    solana: (
        <svg viewBox="0 0 32 32" className="w-7 h-7">
            <linearGradient id="sol-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#00FFA3" />
                <stop offset="100%" stopColor="#DC1FFF" />
            </linearGradient>
            <path d="M7.5 21.4c.2-.2.4-.3.7-.3h19.5c.4 0 .7.5.4.9l-3.6 3.7c-.2.2-.4.3-.7.3H4.3c-.4 0-.7-.5-.4-.9l3.6-3.7zm0-14.8c.2-.2.4-.3.7-.3h19.5c.4 0 .7.5.4.9l-3.6 3.7c-.2.2-.4.3-.7.3H4.3c-.4 0-.7-.5-.4-.9L7.5 6.6zm16.5 7.3c-.2-.2-.4-.3-.7-.3H3.8c-.4 0-.7.5-.4.9l3.6 3.7c.2.2.4.3.7.3h19.5c.4 0 .7-.5.4-.9l-3.6-3.7z" fill="url(#sol-grad)" />
        </svg>
    ),
    avalanche: (
        <svg viewBox="0 0 32 32" className="w-7 h-7">
            <path d="M20.5 22h5.1c.9 0 1.3 0 1.5-.2.3-.2.4-.5.4-.9 0-.3-.2-.6-.5-1.1l-9.7-17c-.3-.5-.5-.8-.8-.9-.3-.1-.7-.1-1 0-.3.1-.5.4-.8.9L13 5.6l-1.8 3.2c-.3.5-.5.8-.5 1.1 0 .4.1.7.4.9.2.2.6.2 1.5.2h3.5c.9 0 1.3 0 1.6.2.3.2.4.5.5.9 0 .3-.2.6-.5 1.1l-4.1 7.1c-.3.5-.5.8-.5 1.1 0 .4.1.7.4.9.2.2.6.2 1.5.2h5.4zm-11.1 0H6.5c-.9 0-1.3 0-1.5-.2-.3-.2-.4-.5-.4-.9 0-.3.2-.6.5-1.1l2-3.4c.3-.5.5-.8.8-.9.3-.1.7-.1 1 0 .3.1.5.4.8.9l2 3.4c.3.5.5.8.5 1.1 0 .4-.1.7-.4.9-.2.2-.7.2-1.4.2z" fill="#E84142" />
        </svg>
    ),
    arbitrum: (
        <svg viewBox="0 0 32 32" className="w-7 h-7">
            <path d="M16 3L4 10v12l12 7 12-7V10L16 3z" fill="#2D374B" />
            <path d="M16.8 13l3.2 5.3-2 3.3L13.5 14l3.3-1zm-1.6 8.6l5.2-8.6 2.2 3.7L17 24l-1.8-2.4z" fill="#28A0F0" />
            <path d="M10.8 21L15 14l2 3.3L13 24l-2.2-3z" fill="white" />
        </svg>
    ),
    optimism: (
        <svg viewBox="0 0 32 32" className="w-7 h-7">
            <circle cx="16" cy="16" r="13" fill="#FF0420" />
            <path d="M11.5 20.5c-1.7 0-3-1.3-3-3 0-2.5 1.8-5 4.5-5 1.7 0 2.8.9 2.8 2.4 0 .5-.1 1-.3 1.5h-2c.1-.4.2-.7.2-1 0-.6-.3-1-1-1-1.2 0-2 1.5-2 3 0 .9.5 1.3 1.2 1.3.6 0 1.1-.3 1.6-.8l1.2 1.2c-.8.9-1.8 1.4-3.2 1.4zm9-5.5c0 2.5-1.7 5-4.4 5h-.2l.8-2h.1c1.2 0 1.8-1.3 1.8-2.7 0-.9-.4-1.5-1.3-1.5-1.2 0-1.9 1.5-1.9 2.8 0 .9.4 1.5 1.3 1.5h-.1l-.8 2c-1.5-.1-2.5-1.2-2.5-3 0-2.5 1.7-5.1 4.5-5.1 1.6 0 2.7 1 2.7 2.5z" fill="white" />
        </svg>
    ),
    base: (
        <svg viewBox="0 0 32 32" className="w-7 h-7">
            <circle cx="16" cy="16" r="13" fill="#0052FF" />
            <path d="M16 6c-5.5 0-10 4.5-10 10s4.5 10 10 10c5.2 0 9.4-3.9 9.9-9H18.5c-.5 2.8-2.9 5-5.8 5-3.3 0-6-2.7-6-6s2.7-6 6-6c2.9 0 5.3 2.2 5.8 5h7.4c-.5-5.1-4.7-9-9.9-9z" fill="white" />
        </svg>
    ),
    zksync: (
        <svg viewBox="0 0 32 32" className="w-7 h-7">
            <path d="M3 16l10-10v7l-7 7 7 7v-7l7 7H10L3 20V16z" fill="#8B8DFC" />
            <path d="M29 16l-10 10v-7l7-7-7-7v7l-7-7h10l7 6v4z" fill="#4E529A" />
        </svg>
    ),
    bitcoin: (
        <svg viewBox="0 0 32 32" className="w-7 h-7">
            <circle cx="16" cy="16" r="14" fill="#F7931A" />
            <path d="M21.2 14.3c.3-2-1.2-3.1-3.3-3.8l.7-2.7-1.6-.4-.7 2.6c-.4-.1-.9-.2-1.3-.3l.7-2.7-1.7-.4-.7 2.7c-.3-.1-.7-.2-1-.3l-2.3-.6-.4 1.7s1.2.3 1.2.3c.7.2.8.6.8 1l-.8 3.2c0 0 .1 0 .1 0l-.1 0-1.1 4.5c-.1.2-.3.5-.8.4 0 0-1.2-.3-1.2-.3l-.8 1.9 2.2.5c.4.1.8.2 1.2.3l-.7 2.8 1.6.4.7-2.7c.4.1.9.2 1.3.3l-.7 2.7 1.7.4.7-2.8c2.8.5 4.9.3 5.8-2.2.7-2 0-3.2-1.5-3.9 1.1-.3 1.9-1 2.1-2.5zm-3.7 5.3c-.5 2-3.9.9-5 .7l.9-3.5c1.1.3 4.7.8 4.1 2.8zm.5-5.3c-.5 1.8-3.3.9-4.2.7l.8-3.2c.9.2 3.9.7 3.4 2.5z" fill="white" />
        </svg>
    ),
    cosmos: (
        <svg viewBox="0 0 32 32" className="w-7 h-7">
            <circle cx="16" cy="16" r="14" fill="none" stroke="#6F7390" strokeWidth="1.5" />
            <ellipse cx="16" cy="16" rx="14" ry="6" fill="none" stroke="#6F7390" strokeWidth="1" transform="rotate(60 16 16)" />
            <ellipse cx="16" cy="16" rx="14" ry="6" fill="none" stroke="#6F7390" strokeWidth="1" transform="rotate(-60 16 16)" />
            <circle cx="16" cy="16" r="3" fill="#2E3148" stroke="#6F7390" strokeWidth="1" />
            <circle cx="16" cy="16" r="1.5" fill="#6F7390" />
        </svg>
    ),
    near: (
        <svg viewBox="0 0 32 32" className="w-7 h-7">
            <path d="M22 6l-5.5 8.2c-.2.3.2.7.5.4l5.4-4.5c.1-.1.3 0 .3.2v11.5c0 .2-.2.3-.3.1l-13-17.2c-.5-.6-1.2-1-2-1H7C5.3 3.7 4 5 4 6.7v18.6c0 1.7 1.3 3 3 3 1 0 2-.5 2.6-1.3L15 18.8c.2-.3-.2-.7-.5-.4L9.2 23c-.1.1-.3 0-.3-.2V11.3c0-.2.2-.3.3-.1l13 17.2c.5.6 1.2 1 2 1H25c1.7 0 3-1.3 3-3V6.7c0-1.7-1.3-3-3-3-1 0-2 .5-2.6 1.3z" fill="white" />
        </svg>
    ),
    fantom: (
        <svg viewBox="0 0 32 32" className="w-7 h-7">
            <circle cx="16" cy="16" r="14" fill="#1969FF" />
            <path d="M17 6.5l5 3c.6.4 1 1 1 1.7v3.3l-5 3v-11zm-2 0v11l-5-3v-3.3c0-.7.4-1.3 1-1.7l4-3zm6 13l-5 3v5.5l6-3.6v-3.2l-1-.7zm-10 0l1-.7v3.2l-6 3.6V22l5-3zm5 .5l-4.5 2.7L7 19.8v-3.1l5 3 3.5-2.1.5.3zM25 19.8l-4.5 2.9L16 19.8v-.6l.5-.3 3.5 2.1 5-3v3.1z" fill="white" />
        </svg>
    ),
    cronos: (
        <svg viewBox="0 0 32 32" className="w-7 h-7">
            <circle cx="16" cy="16" r="14" fill="#002D74" />
            <path d="M16 5l9 6.5v9L16 27l-9-6.5v-9L16 5zm0 3l-6 4.3v6.4l6 4.3 6-4.3v-6.4L16 8z" fill="#23A3E0" />
            <path d="M16 12l3 2.2v3.6L16 20l-3-2.2v-3.6L16 12z" fill="#23A3E0" />
        </svg>
    ),
};

/* ───────────────────────────────────────────────── */
/*  Chain data                                       */
/* ───────────────────────────────────────────────── */

interface Chain {
    id: string;
    name: string;
    symbol: string;
    color: string;
    status: 'active' | 'coming_soon' | 'beta';
    explorerUrl: string;
    description: string;
    features: string[];
}

const SUPPORTED_CHAINS: Chain[] = [
    {
        id: 'multiversx',
        name: 'MultiversX',
        symbol: 'EGLD',
        color: 'from-teal-500 to-cyan-600',
        status: 'active',
        explorerUrl: 'https://explorer.multiversx.com',
        description: 'Highly scalable, secure and decentralized blockchain network with adaptive state sharding.',
        features: ['Multisig', 'ESDT Tokens', 'Smart Contracts', 'Staking', 'Guardians'],
    },
    {
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'ETH',
        color: 'from-indigo-500 to-blue-600',
        status: 'coming_soon',
        explorerUrl: 'https://etherscan.io',
        description: 'The world\'s programmable blockchain and home of DeFi and NFTs.',
        features: ['Safe Multisig', 'ERC-20', 'DeFi', 'NFTs'],
    },
    {
        id: 'bnb',
        name: 'BNB Chain',
        symbol: 'BNB',
        color: 'from-yellow-500 to-amber-600',
        status: 'coming_soon',
        explorerUrl: 'https://bscscan.com',
        description: 'Fast and low-cost blockchain for DeFi, dApps, and gaming.',
        features: ['Gnosis Safe', 'BEP-20', 'DeFi', 'GameFi'],
    },
    {
        id: 'polygon',
        name: 'Polygon',
        symbol: 'POL',
        color: 'from-purple-500 to-violet-600',
        status: 'coming_soon',
        explorerUrl: 'https://polygonscan.com',
        description: 'Ethereum\'s scaling solution with low fees and fast finality.',
        features: ['Gnosis Safe', 'ERC-20', 'DeFi', 'Gaming'],
    },
    {
        id: 'solana',
        name: 'Solana',
        symbol: 'SOL',
        color: 'from-green-400 to-purple-600',
        status: 'coming_soon',
        explorerUrl: 'https://solscan.io',
        description: 'High-performance blockchain with sub-second finality and low fees.',
        features: ['Squads Multisig', 'SPL Tokens', 'DeFi', 'NFTs'],
    },
    {
        id: 'avalanche',
        name: 'Avalanche',
        symbol: 'AVAX',
        color: 'from-red-500 to-rose-600',
        status: 'coming_soon',
        explorerUrl: 'https://snowtrace.io',
        description: 'Blazing-fast smart contracts platform with subnet architecture.',
        features: ['Gnosis Safe', 'Subnets', 'DeFi', 'Institutions'],
    },
    {
        id: 'arbitrum',
        name: 'Arbitrum',
        symbol: 'ARB',
        color: 'from-blue-600 to-slate-600',
        status: 'coming_soon',
        explorerUrl: 'https://arbiscan.io',
        description: 'Leading Ethereum L2 with optimistic rollup technology.',
        features: ['Safe Multisig', 'ERC-20', 'DeFi', 'Low Fees'],
    },
    {
        id: 'optimism',
        name: 'Optimism',
        symbol: 'OP',
        color: 'from-red-500 to-red-700',
        status: 'coming_soon',
        explorerUrl: 'https://optimistic.etherscan.io',
        description: 'Ethereum L2 powered by optimistic rollups with fast withdrawals.',
        features: ['Safe Multisig', 'ERC-20', 'DeFi', 'Superchain'],
    },
    {
        id: 'base',
        name: 'Base',
        symbol: 'ETH',
        color: 'from-blue-600 to-blue-800',
        status: 'coming_soon',
        explorerUrl: 'https://basescan.org',
        description: 'Coinbase\'s L2 blockchain built on the OP Stack for mainstream adoption.',
        features: ['Safe Multisig', 'ERC-20', 'DeFi', 'Social'],
    },
    {
        id: 'zksync',
        name: 'zkSync Era',
        symbol: 'ZK',
        color: 'from-indigo-500 to-purple-700',
        status: 'coming_soon',
        explorerUrl: 'https://explorer.zksync.io',
        description: 'Ethereum L2 using zero-knowledge proofs for ultimate security and speed.',
        features: ['Account Abstraction', 'ERC-20', 'DeFi', 'ZK Proofs'],
    },
    {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        color: 'from-orange-500 to-amber-600',
        status: 'coming_soon',
        explorerUrl: 'https://mempool.space',
        description: 'The original cryptocurrency. MultiversX Bridge enables BTC asset transfers.',
        features: ['BTC Bridge', 'Store of Value', 'Lightning', 'Ordinals'],
    },
    {
        id: 'cosmos',
        name: 'Cosmos',
        symbol: 'ATOM',
        color: 'from-slate-500 to-indigo-600',
        status: 'coming_soon',
        explorerUrl: 'https://www.mintscan.io/cosmos',
        description: 'The Internet of Blockchains — IBC-enabled interoperability with sovereign chains.',
        features: ['IBC', 'Cosmos SDK', 'Staking', 'Sovereign Chains'],
    },
    {
        id: 'near',
        name: 'NEAR Protocol',
        symbol: 'NEAR',
        color: 'from-green-500 to-emerald-700',
        status: 'coming_soon',
        explorerUrl: 'https://nearblocks.io',
        description: 'Sharded, developer-friendly blockchain with human-readable accounts.',
        features: ['Account Abstraction', 'NEP-141', 'DeFi', 'Chain Signatures'],
    },
    {
        id: 'fantom',
        name: 'Fantom',
        symbol: 'FTM',
        color: 'from-blue-500 to-blue-700',
        status: 'coming_soon',
        explorerUrl: 'https://ftmscan.com',
        description: 'High-performance DAG-based smart contract platform with instant finality.',
        features: ['Safe Multisig', 'ERC-20', 'DeFi', 'Sonic'],
    },
    {
        id: 'cronos',
        name: 'Cronos',
        symbol: 'CRO',
        color: 'from-blue-700 to-cyan-600',
        status: 'coming_soon',
        explorerUrl: 'https://cronoscan.com',
        description: 'Crypto.com\'s EVM-compatible chain focused on payments and mainstream adoption.',
        features: ['Safe Multisig', 'CRC-20', 'DeFi', 'Payments'],
    },
];

const statusConfig = {
    active: { label: 'Active', color: 'text-green-400 bg-green-400/10 border-green-400/20', icon: CheckCircle2 },
    coming_soon: { label: 'Coming Soon', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20', icon: Circle },
    beta: { label: 'Beta', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: Zap },
};

export const MultiChainPage = () => {
    const currentNetwork = getSelectedNetwork();
    const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
    const [bridgeOpen, setBridgeOpen] = useState(false);
    const [bridgeAmount, setBridgeAmount] = useState('');
    const [bridgeLoading, setBridgeLoading] = useState(false);

    const handleBridge = async () => {
        if (!bridgeAmount || !selectedChain) return;
        setBridgeLoading(true);
        await new Promise(r => setTimeout(r, 2000));
        setBridgeLoading(false);
        setBridgeOpen(false);
        setBridgeAmount('');
        toast.success(`Bridge to ${selectedChain.name} coming soon!`);
    };

    return (
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
            <ComingSoonBanner feature="Cross-chain multisig management" />

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Multi-Chain</h1>
                        <p className="text-slate-400 text-sm">Manage multisig wallets across multiple blockchains</p>
                    </div>
                </div>
            </motion.div>

            {/* Status summary cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8"
            >
                <div className="glass-card p-4 text-center">
                    <p className="text-2xl font-bold text-green-400">{SUPPORTED_CHAINS.filter(c => c.status === 'active').length}</p>
                    <p className="text-[10px] text-slate-500 mt-1">Active Chains</p>
                </div>
                <div className="glass-card p-4 text-center">
                    <p className="text-2xl font-bold text-yellow-400">{SUPPORTED_CHAINS.filter(c => c.status === 'coming_soon').length}</p>
                    <p className="text-[10px] text-slate-500 mt-1">Coming Soon</p>
                </div>
                <div className="glass-card p-4 text-center hidden sm:block">
                    <p className="text-2xl font-bold text-white">{SUPPORTED_CHAINS.length}</p>
                    <p className="text-[10px] text-slate-500 mt-1">Total Planned</p>
                </div>
            </motion.div>

            {/* Info banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="glass-card p-4 mb-6 border-primary/20"
            >
                <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-slate-300 font-medium mb-1">Cross-Chain Multisig Management</p>
                        <p className="text-xs text-slate-500">
                            Currently operating on <span className="text-primary font-semibold capitalize">{currentNetwork}</span>.
                            Multi-chain support will enable managing multisig wallets across different blockchains from a unified interface,
                            including cross-chain bridging and asset aggregation.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Chain cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SUPPORTED_CHAINS.map((chain, i) => {
                    const StatusIcon = statusConfig[chain.status].icon;
                    const isActive = chain.status === 'active';
                    const logo = ChainLogos[chain.id];

                    return (
                        <motion.div
                            key={chain.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.05 }}
                            className={`glass-card p-5 transition-all cursor-pointer group ${isActive ? 'hover:border-primary/30' : 'hover:border-surface-border opacity-80'
                                }`}
                            onClick={() => {
                                if (isActive) {
                                    setSelectedChain(chain);
                                    setBridgeOpen(true);
                                } else {
                                    toast(`${chain.name} support coming soon!`, { icon: '🔜' });
                                }
                            }}
                        >
                            <div className="flex items-start gap-4">
                                {/* Chain logo */}
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${chain.color} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-lg`}>
                                    {logo || <Globe className="w-7 h-7 text-white" />}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-base font-bold text-white">{chain.name}</h3>
                                        <span className="text-xs text-slate-500 font-mono">{chain.symbol}</span>
                                    </div>

                                    {/* Status badge */}
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border mb-2 ${statusConfig[chain.status].color}`}>
                                        <StatusIcon className="w-3 h-3" />
                                        {statusConfig[chain.status].label}
                                    </div>

                                    <p className="text-xs text-slate-500 mb-3 line-clamp-2">{chain.description}</p>

                                    {/* Features */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {chain.features.map(f => (
                                            <span key={f} className="px-2 py-0.5 bg-bg rounded-md text-[10px] text-slate-400 border border-surface-border">
                                                {f}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Arrow */}
                                {isActive && (
                                    <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Bridge modal */}
            <AnimatePresence>
                {bridgeOpen && selectedChain && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setBridgeOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="glass-card p-6 w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <ArrowRightLeft className="w-5 h-5 text-primary" />
                                <h3 className="text-lg font-bold text-white">Cross-Chain Bridge</h3>
                            </div>

                            <div className="space-y-4">
                                {/* From */}
                                <div className="p-4 bg-bg rounded-xl border border-surface-border">
                                    <p className="text-[10px] text-slate-500 mb-2">From</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                                            {ChainLogos.multiversx}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">MultiversX</p>
                                            <p className="text-[10px] text-slate-500 capitalize">{currentNetwork}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <div className="w-8 h-8 rounded-full bg-surface-hover border border-surface-border flex items-center justify-center">
                                        <ArrowRightLeft className="w-4 h-4 text-primary" />
                                    </div>
                                </div>

                                {/* To */}
                                <div className="p-4 bg-bg rounded-xl border border-surface-border">
                                    <p className="text-[10px] text-slate-500 mb-2">To</p>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedChain.color} flex items-center justify-center`}>
                                            {ChainLogos[selectedChain.id] || <Globe className="w-5 h-5 text-white" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">{selectedChain.name}</p>
                                            <p className="text-[10px] text-slate-500">{selectedChain.symbol}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Amount */}
                                <div>
                                    <label className="text-xs text-slate-400 mb-1.5 block">Amount (EGLD)</label>
                                    <input
                                        type="number"
                                        value={bridgeAmount}
                                        onChange={(e) => setBridgeAmount(e.target.value)}
                                        placeholder="0.0"
                                        className="w-full p-3 bg-bg rounded-xl border border-surface-border text-white text-sm placeholder-slate-600 focus:outline-none focus:border-primary/30"
                                    />
                                </div>

                                {/* Warning */}
                                <div className="flex items-start gap-2 p-3 bg-yellow-400/5 rounded-xl border border-yellow-400/10">
                                    <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-[10px] text-yellow-400/80">
                                        Cross-chain bridging is in development. This feature will require a multisig proposal approved by the quorum before execution.
                                    </p>
                                </div>

                                {/* Submit */}
                                <button
                                    onClick={handleBridge}
                                    disabled={bridgeLoading || !bridgeAmount}
                                    className="w-full py-3 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {bridgeLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <ArrowRightLeft className="w-4 h-4" />
                                            Initiate Bridge
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
