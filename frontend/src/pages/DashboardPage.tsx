import { useEffect, useState, useCallback } from 'react';
import { getAccount } from '@multiversx/sdk-dapp/out/methods/account/getAccount';
import { Link } from 'react-router-dom';
import {
    Plus,
    Shield,
    Wallet,
    TrendingUp,
    Clock,
    CheckCircle2,
    Users,
    Loader2,
    ExternalLink,
    Search,
    Trash2,
    Download,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NETWORK_CONFIG } from '../config/network';
import { ActivityPanel } from '../components/ActivityPanel';
import {
    getMultisigInfo,
    getUserRole,
    type MultisigInfo,
    type UserRole,
} from '../contracts/multisigInteraction';
import { truncateAddress, formatBalance } from '../utils/formatters';

const STORAGE_KEY = 'mvx-multisig-addresses';

const getSavedAddresses = (): string[] => {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        return Array.isArray(saved) ? saved : [];
    } catch {
        return [];
    }
};

const saveAddresses = (addresses: string[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
};

interface MultisigEntry {
    address: string;
    info: MultisigInfo | null;
    role: UserRole;
    loading: boolean;
    error: string | null;
}

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export const DashboardPage = () => {
    const account = getAccount();
    const [entries, setEntries] = useState<MultisigEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newAddress, setNewAddress] = useState('');
    const [addError, setAddError] = useState('');

    // Build initial list from config + localStorage
    const getAllAddresses = useCallback((): string[] => {
        const saved = getSavedAddresses();
        const defaultAddr = NETWORK_CONFIG.multisigContractAddress;
        const all = defaultAddr ? [defaultAddr, ...saved.filter(a => a !== defaultAddr)] : saved;
        return [...new Set(all)];
    }, []);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        const addresses = getAllAddresses();

        const results: MultisigEntry[] = addresses.map(addr => ({
            address: addr,
            info: null,
            role: 'None' as UserRole,
            loading: true,
            error: null,
        }));
        setEntries(results);

        const updated = await Promise.all(
            addresses.map(async (addr) => {
                try {
                    const info = await getMultisigInfo(addr);
                    let role: UserRole = 'None';
                    if (account?.address) {
                        role = await getUserRole(addr, account.address);
                    }
                    return { address: addr, info, role, loading: false, error: null };
                } catch (err: any) {
                    return { address: addr, info: null, role: 'None' as UserRole, loading: false, error: err?.message || 'Failed' };
                }
            })
        );

        setEntries(updated);
        setLoading(false);
    }, [getAllAddresses, account?.address]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const handleAddMultisig = () => {
        setAddError('');
        const addr = newAddress.trim();
        if (!addr.startsWith('erd1') || addr.length !== 62) {
            setAddError('Invalid address — must start with erd1 and be 62 characters');
            return;
        }
        const all = getAllAddresses();
        if (all.includes(addr)) {
            setAddError('This multisig is already in your list');
            return;
        }
        const saved = getSavedAddresses();
        saveAddresses([...saved, addr]);
        setNewAddress('');
        setShowAddForm(false);
        fetchAll();
    };

    const handleRemove = (addr: string) => {
        const saved = getSavedAddresses().filter(a => a !== addr);
        saveAddresses(saved);
        fetchAll();
    };

    // Stats
    const totalMultisigs = entries.length;
    const totalActions = entries.reduce((sum, e) => sum + (e.info?.actionLastIndex ?? 0), 0);
    const totalMembers = entries.reduce((sum, e) => sum + (e.info?.numBoardMembers ?? 0), 0);

    const getRoleBadge = (role: UserRole) => {
        switch (role) {
            case 'BoardMember':
                return (
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-medium rounded-md border border-primary/20">
                        Board Member
                    </span>
                );
            case 'Proposer':
                return (
                    <span className="px-2 py-0.5 bg-accent/10 text-accent text-[10px] font-medium rounded-md border border-accent/20">
                        Proposer
                    </span>
                );
            default:
                return (
                    <span className="px-2 py-0.5 bg-slate-500/10 text-slate-400 text-[10px] font-medium rounded-md border border-slate-500/20">
                        Viewer
                    </span>
                );
        }
    };

    return (
        <div className="page-container">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="section-title mb-1">Dashboard</h1>
                        <p className="text-slate-500">Manage your multisig wallets and proposals</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="px-4 py-2 text-sm rounded-xl border border-surface-border text-slate-300 hover:text-white hover:border-primary/30 transition-all flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Add Existing</span>
                        </button>
                        <Link to="/create" className="btn-primary !px-4 !py-2 !text-sm flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Create New
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* Add existing form */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="glass-card p-5 mb-6 overflow-hidden"
                    >
                        <h3 className="text-sm font-semibold text-white mb-3">Add Existing Multisig</h3>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                placeholder="erd1qqqqqqqqq..."
                                value={newAddress}
                                onChange={e => { setNewAddress(e.target.value); setAddError(''); }}
                                className="flex-1 px-4 py-2.5 bg-bg border border-surface-border rounded-xl text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-primary/40"
                            />
                            <button onClick={handleAddMultisig} className="btn-primary px-5 py-2.5 text-sm">
                                Add
                            </button>
                        </div>
                        {addError && <p className="text-xs text-danger mt-2">{addError}</p>}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stats Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8"
            >
                <motion.div variants={item} className="glass-card p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        </div>
                        <TrendingUp className="w-4 h-4 text-success" />
                    </div>
                    <p className="text-lg sm:text-2xl font-bold text-white mb-1">
                        {formatBalance(account?.balance || '0')} <span className="text-[10px] sm:text-sm font-normal text-slate-500">{NETWORK_CONFIG.egldLabel}</span>
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-500">Your Balance</p>
                </motion.div>

                <motion.div variants={item} className="glass-card p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                        </div>
                    </div>
                    <p className="text-lg sm:text-2xl font-bold text-white mb-1">{totalMultisigs}</p>
                    <p className="text-[10px] sm:text-xs text-slate-500">Active Multisigs</p>
                </motion.div>

                <motion.div variants={item} className="glass-card p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />
                        </div>
                    </div>
                    <p className="text-lg sm:text-2xl font-bold text-white mb-1">{loading ? <Loader2 className="w-5 h-5 animate-spin inline" /> : totalActions}</p>
                    <p className="text-[10px] sm:text-xs text-slate-500">Total Actions</p>
                </motion.div>

                <motion.div variants={item} className="glass-card p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-success/10 flex items-center justify-center">
                            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                        </div>
                    </div>
                    <p className="text-lg sm:text-2xl font-bold text-white mb-1">{loading ? <Loader2 className="w-5 h-5 animate-spin inline" /> : totalMembers}</p>
                    <p className="text-[10px] sm:text-xs text-slate-500">Total Members</p>
                </motion.div>
            </motion.div>

            {/* Multisig Wallets */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-white">Your Multisig Wallets</h2>
                        <span className="text-xs text-slate-500">{entries.length} wallet{entries.length !== 1 ? 's' : ''}</span>
                    </div>

                    {entries.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-20 h-20 rounded-2xl bg-surface-hover flex items-center justify-center mb-4">
                                <Shield className="w-10 h-10 text-slate-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-300 mb-2">No Multisig Wallets Yet</h3>
                            <p className="text-sm text-slate-500 max-w-sm mb-6">
                                Create your first multisig wallet or add an existing one.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowAddForm(true)}
                                    className="px-4 py-2.5 text-sm rounded-xl border border-surface-border text-slate-300 hover:text-white hover:border-primary/30 transition-all flex items-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Add Existing
                                </button>
                                <Link to="/create" className="btn-primary flex items-center gap-2 text-sm">
                                    <Plus className="w-4 h-4" />
                                    Create New
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {entries.map((entry) => (
                                <Link
                                    key={entry.address}
                                    to={`/multisig/${entry.address}`}
                                    className="block p-4 sm:p-5 bg-bg/50 rounded-xl border border-surface-border hover:border-primary/30 transition-all group relative"
                                >
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                                            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <p className="text-white font-semibold group-hover:text-primary transition-colors text-sm sm:text-base">
                                                    Multisig Wallet
                                                </p>
                                                {getRoleBadge(entry.role)}
                                            </div>
                                            <p className="text-[10px] sm:text-xs text-slate-500 font-mono truncate">
                                                {truncateAddress(entry.address)}
                                            </p>
                                        </div>
                                        {entry.loading ? (
                                            <Loader2 className="w-4 h-4 text-slate-500 animate-spin flex-shrink-0" />
                                        ) : entry.info ? (
                                            <div className="text-right flex-shrink-0 hidden sm:block">
                                                <p className="text-sm font-medium text-white">
                                                    {entry.info.quorum}/{entry.info.numBoardMembers}
                                                </p>
                                                <p className="text-[10px] text-slate-500">Quorum</p>
                                            </div>
                                        ) : null}
                                        <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-primary transition-colors flex-shrink-0" />
                                    </div>

                                    {entry.info && (
                                        <div className="grid grid-cols-3 gap-4 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-surface-border">
                                            <div className="text-center">
                                                <p className="text-base sm:text-lg font-bold text-white">{entry.info.numBoardMembers}</p>
                                                <p className="text-[10px] text-slate-500">Board Members</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-base sm:text-lg font-bold text-white">{entry.info.numProposers}</p>
                                                <p className="text-[10px] text-slate-500">Proposers</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-base sm:text-lg font-bold text-white">{entry.info.actionLastIndex}</p>
                                                <p className="text-[10px] text-slate-500">Total Actions</p>
                                            </div>
                                        </div>
                                    )}

                                    {entry.error && (
                                        <p className="text-xs text-danger mt-3">{entry.error}</p>
                                    )}

                                    {/* Remove button — only for user-added, not config default */}
                                    {entry.address !== NETWORK_CONFIG.multisigContractAddress && (
                                        <button
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemove(entry.address); }}
                                            className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all"
                                            title="Remove from list"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Activity Panel */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6"
            >
                <ActivityPanel />
            </motion.div>
        </div>
    );
};
