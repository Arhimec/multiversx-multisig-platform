import { useState } from 'react';
import { ComingSoonBanner } from '../components/ComingSoonBanner';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Puzzle,
    Search,
    Download,
    CheckCircle2,
    Star,
    ExternalLink,
    Shield,
    BarChart3,
    Bell,
    Users,
    Zap,
    Code,
    Eye,
    Trash2,
    Settings,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Plugin {
    id: string;
    name: string;
    description: string;
    category: 'security' | 'analytics' | 'notifications' | 'defi' | 'tools' | 'integrations';
    author: string;
    version: string;
    rating: number;
    installs: number;
    icon: typeof Puzzle;
    color: string;
    installed: boolean;
    featured: boolean;
}

const STORAGE_KEY = 'mvx-multisig-plugins-installed';

const getInstalled = (): string[] => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '["tx-monitor","csv-export"]');
    } catch {
        return [];
    }
};

const saveInstalled = (ids: string[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
};

const categoryConfig: Record<string, { color: string; bg: string }> = {
    security: { color: 'text-green-400', bg: 'bg-green-400/10' },
    analytics: { color: 'text-blue-400', bg: 'bg-blue-400/10' },
    notifications: { color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    defi: { color: 'text-purple-400', bg: 'bg-purple-400/10' },
    tools: { color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    integrations: { color: 'text-orange-400', bg: 'bg-orange-400/10' },
};

const PLUGINS: Plugin[] = [
    {
        id: 'tx-monitor',
        name: 'Transaction Monitor',
        description: 'Real-time monitoring of all multisig transactions with alerts and notifications.',
        category: 'notifications',
        author: 'MultiversX Team',
        version: '1.2.0',
        rating: 4.8,
        installs: 1240,
        icon: Bell,
        color: 'from-yellow-500 to-orange-600',
        installed: false,
        featured: true,
    },
    {
        id: 'csv-export',
        name: 'CSV/PDF Export',
        description: 'Export transaction history, proposals, and analytics to CSV or PDF format.',
        category: 'tools',
        author: 'MultiversX Team',
        version: '1.0.1',
        rating: 4.6,
        installs: 890,
        icon: BarChart3,
        color: 'from-cyan-500 to-blue-600',
        installed: false,
        featured: true,
    },
    {
        id: 'whale-alert',
        name: 'Whale Alert',
        description: 'Get notified when large transactions are proposed or executed on your multisig.',
        category: 'security',
        author: 'Security Labs',
        version: '2.1.0',
        rating: 4.9,
        installs: 2100,
        icon: Shield,
        color: 'from-green-500 to-emerald-600',
        installed: false,
        featured: true,
    },
    {
        id: 'defi-hub',
        name: 'DeFi Hub',
        description: 'Access DeFi protocols directly from your multisig — swap, provide liquidity, farm yields.',
        category: 'defi',
        author: 'DeFi Connect',
        version: '0.9.0',
        rating: 4.3,
        installs: 560,
        icon: Zap,
        color: 'from-purple-500 to-pink-600',
        installed: false,
        featured: false,
    },
    {
        id: 'team-manager',
        name: 'Team Manager',
        description: 'Manage signer roles, permissions, and activity with an enhanced team dashboard.',
        category: 'tools',
        author: 'MultiversX Team',
        version: '1.1.0',
        rating: 4.5,
        installs: 780,
        icon: Users,
        color: 'from-blue-500 to-indigo-600',
        installed: false,
        featured: false,
    },
    {
        id: 'code-verifier',
        name: 'Contract Verifier',
        description: 'Verify and audit smart contract code before approving deployment proposals.',
        category: 'security',
        author: 'Audit DAO',
        version: '1.0.0',
        rating: 4.7,
        installs: 430,
        icon: Code,
        color: 'from-red-500 to-rose-600',
        installed: false,
        featured: false,
    },
    {
        id: 'portfolio-tracker',
        name: 'Portfolio Tracker',
        description: 'Track the value and performance of all assets held in your multisig wallets.',
        category: 'analytics',
        author: 'Analytics Pro',
        version: '1.3.0',
        rating: 4.4,
        installs: 1050,
        icon: BarChart3,
        color: 'from-teal-500 to-cyan-600',
        installed: false,
        featured: false,
    },
    {
        id: 'telegram-bot',
        name: 'Telegram Notifications',
        description: 'Receive multisig notifications directly in your Telegram chat or group.',
        category: 'integrations',
        author: 'BotFactory',
        version: '2.0.0',
        rating: 4.6,
        installs: 1680,
        icon: Bell,
        color: 'from-sky-500 to-blue-600',
        installed: false,
        featured: false,
    },
];

export const PluginsPage = () => {
    const [installedIds, setInstalledIds] = useState<string[]>(getInstalled);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [showInstalled, setShowInstalled] = useState(false);
    const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);

    const handleInstall = (id: string) => {
        const updated = [...installedIds, id];
        setInstalledIds(updated);
        saveInstalled(updated);
        toast.success('Plugin installed!');
    };

    const handleUninstall = (id: string) => {
        const updated = installedIds.filter(x => x !== id);
        setInstalledIds(updated);
        saveInstalled(updated);
        toast.success('Plugin uninstalled');
    };

    const allPlugins = PLUGINS.map(p => ({ ...p, installed: installedIds.includes(p.id) }));
    const filtered = allPlugins
        .filter(p => showInstalled ? p.installed : true)
        .filter(p => categoryFilter === 'all' || p.category === categoryFilter)
        .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()));

    const featured = allPlugins.filter(p => p.featured);

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
        ));
    };

    return (
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
            <ComingSoonBanner feature="Plugin marketplace and extensions" />

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                        <Puzzle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Plugins</h1>
                        <p className="text-slate-400 text-sm">Extend your multisig with powerful add-ons</p>
                    </div>
                </div>
            </motion.div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-3 gap-3 mb-6"
            >
                <div className="glass-card p-4 text-center">
                    <p className="text-xl font-bold text-white">{PLUGINS.length}</p>
                    <p className="text-[10px] text-slate-500">Available</p>
                </div>
                <div className="glass-card p-4 text-center">
                    <p className="text-xl font-bold text-green-400">{installedIds.length}</p>
                    <p className="text-[10px] text-slate-500">Installed</p>
                </div>
                <div className="glass-card p-4 text-center">
                    <p className="text-xl font-bold text-yellow-400">{featured.length}</p>
                    <p className="text-[10px] text-slate-500">Featured</p>
                </div>
            </motion.div>

            {/* Search & filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex flex-col sm:flex-row gap-3 mb-6"
            >
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search plugins..."
                        className="w-full pl-10 pr-4 py-2.5 bg-bg rounded-xl border border-surface-border text-white text-sm placeholder-slate-600 focus:outline-none focus:border-primary/30"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                    <button
                        onClick={() => setShowInstalled(!showInstalled)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${showInstalled ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-bg border border-surface-border text-slate-400 hover:text-white'
                            }`}
                    >
                        Installed
                    </button>
                    {['all', 'security', 'analytics', 'defi', 'tools', 'integrations'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all capitalize ${categoryFilter === cat ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-bg border border-surface-border text-slate-400 hover:text-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Plugin grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((plugin, i) => {
                    const Icon = plugin.icon;
                    const cat = categoryConfig[plugin.category];

                    return (
                        <motion.div
                            key={plugin.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.04 }}
                            className="glass-card p-5 hover:border-primary/20 transition-all group cursor-pointer"
                            onClick={() => setSelectedPlugin(plugin)}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plugin.color} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h3 className="text-sm font-bold text-white">{plugin.name}</h3>
                                        {plugin.featured && (
                                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                        )}
                                    </div>
                                    <p className="text-[10px] text-slate-500 mb-1.5">v{plugin.version} · by {plugin.author}</p>
                                    <p className="text-xs text-slate-400 line-clamp-2 mb-2">{plugin.description}</p>

                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-0.5">{renderStars(plugin.rating)}</div>
                                        <span className="text-[10px] text-slate-500">{plugin.rating}</span>
                                        <span className="text-[10px] text-slate-600">·</span>
                                        <span className="text-[10px] text-slate-500">{plugin.installs.toLocaleString()} installs</span>
                                    </div>
                                </div>

                                {/* Install/Uninstall */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        plugin.installed ? handleUninstall(plugin.id) : handleInstall(plugin.id);
                                    }}
                                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all flex-shrink-0 ${plugin.installed
                                        ? 'bg-green-400/10 text-green-400 border border-green-400/20 hover:bg-red-400/10 hover:text-red-400 hover:border-red-400/20'
                                        : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'
                                        }`}
                                >
                                    {plugin.installed ? (
                                        <span className="flex items-center gap-1.5">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            Installed
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5">
                                            <Download className="w-3.5 h-3.5" />
                                            Install
                                        </span>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    );
                })}

                {filtered.length === 0 && (
                    <div className="col-span-2 text-center py-16">
                        <Puzzle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-sm text-slate-500">No plugins found</p>
                    </div>
                )}
            </div>

            {/* Plugin detail modal */}
            <AnimatePresence>
                {selectedPlugin && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedPlugin(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="glass-card p-6 w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selectedPlugin.color} flex items-center justify-center`}>
                                    <selectedPlugin.icon className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{selectedPlugin.name}</h3>
                                    <p className="text-xs text-slate-500">v{selectedPlugin.version} · {selectedPlugin.author}</p>
                                </div>
                            </div>

                            <p className="text-sm text-slate-300 mb-4">{selectedPlugin.description}</p>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500">Category</span>
                                    <span className={`capitalize ${categoryConfig[selectedPlugin.category].color}`}>{selectedPlugin.category}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500">Rating</span>
                                    <div className="flex items-center gap-1">
                                        {renderStars(selectedPlugin.rating)}
                                        <span className="text-slate-400 ml-1">{selectedPlugin.rating}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500">Installs</span>
                                    <span className="text-white">{selectedPlugin.installs.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    selectedPlugin.installed ? handleUninstall(selectedPlugin.id) : handleInstall(selectedPlugin.id);
                                    setSelectedPlugin({ ...selectedPlugin, installed: !selectedPlugin.installed });
                                }}
                                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${selectedPlugin.installed
                                    ? 'bg-red-400/10 text-red-400 border border-red-400/20 hover:bg-red-400/20'
                                    : 'bg-gradient-to-r from-primary to-accent text-white hover:opacity-90'
                                    }`}
                            >
                                {selectedPlugin.installed ? (
                                    <>
                                        <Trash2 className="w-4 h-4" />
                                        Uninstall
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4" />
                                        Install Plugin
                                    </>
                                )}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
