import { ComingSoonBanner } from '../components/ComingSoonBanner';
import { motion } from 'framer-motion';
import {
    Image,
    ExternalLink,
    ShoppingCart,
    Eye,
    Send,
    TrendingUp,
    ShieldCheck,
    Sparkles,
    Layers,
} from 'lucide-react';

/* Inline XOXNO-style logo */
const XoxnoLogo = () => (
    <svg viewBox="0 0 32 32" className="w-7 h-7">
        <circle cx="16" cy="16" r="14" fill="#0d1117" stroke="#2dd4bf" strokeWidth="1.5" />
        <text x="16" y="21" textAnchor="middle" fill="#2dd4bf" fontSize="11" fontWeight="bold" fontFamily="monospace">X</text>
    </svg>
);

const PLANNED_FEATURES = [
    {
        icon: Eye,
        title: 'NFT Gallery',
        description: 'View all NFTs held by your multisig wallets in a unified gallery with metadata and floor prices.',
    },
    {
        icon: ShoppingCart,
        title: 'Buy via XOXNO',
        description: 'Propose NFT purchases from the XOXNO marketplace. Requires quorum approval before execution.',
    },
    {
        icon: Send,
        title: 'Transfer & List',
        description: 'List NFTs for sale or transfer to other wallets — all through multisig governance.',
    },
    {
        icon: TrendingUp,
        title: 'Portfolio Tracker',
        description: 'Track NFT portfolio value over time with floor price integration from XOXNO.',
    },
    {
        icon: ShieldCheck,
        title: 'Multisig Approval',
        description: 'Every NFT action requires a multisig proposal approved by the quorum before execution.',
    },
    {
        icon: Layers,
        title: 'Collection Management',
        description: 'Organize NFTs by collection. Batch operations for efficient treasury management.',
    },
];

export const NftTreasuryPage = () => {
    return (
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
            <ComingSoonBanner feature="NFT Treasury Management" />

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                        <Image className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">NFT Treasury</h1>
                        <p className="text-slate-400 text-sm">Manage NFTs collectively through multisig governance</p>
                    </div>
                </div>
            </motion.div>

            {/* XOXNO integration card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6 mb-8 border-purple-500/20"
            >
                <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <XoxnoLogo />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <h2 className="text-lg font-bold text-white">Powered by XOXNO</h2>
                            <Sparkles className="w-4 h-4 text-purple-400" />
                        </div>
                        <p className="text-sm text-slate-400 mb-3 max-w-xl">
                            XOXNO is the #1 NFT marketplace on MultiversX. Our integration will allow multisig wallets
                            to browse, buy, sell, and manage NFTs with full governance — every action requires quorum approval.
                        </p>
                        <a
                            href="https://xoxno.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                        >
                            Visit XOXNO <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </div>
            </motion.div>

            {/* Planned features grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mb-6"
            >
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Planned Features</h3>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PLANNED_FEATURES.map((feature, i) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.05 }}
                        className="glass-card p-5"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/15 flex items-center justify-center mb-3">
                            <feature.icon className="w-5 h-5 text-purple-400" />
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1">{feature.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{feature.description}</p>
                    </motion.div>
                ))}
            </div>

            {/* Empty state / placeholder gallery */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 glass-card p-12 text-center"
            >
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/15 flex items-center justify-center mx-auto mb-4">
                    <Image className="w-10 h-10 text-purple-400/50" />
                </div>
                <h3 className="text-lg font-bold text-slate-400 mb-2">NFT Gallery Coming Soon</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Your multisig's NFT collection will appear here. Browse, buy, and manage NFTs
                    from XOXNO — all governed by your multisig quorum.
                </p>
            </motion.div>
        </div>
    );
};
