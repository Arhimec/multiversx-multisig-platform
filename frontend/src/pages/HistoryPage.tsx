import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAccount } from '@multiversx/sdk-dapp/out/methods/account/getAccount';
import {
    Clock,
    CheckCircle2,
    XCircle,
    ArrowUpRight,
    Filter,
    Search,
    ExternalLink,
    Shield,
    Users,
    Settings,
    Send,
    Loader2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { NETWORK_CONFIG } from '../config/network';

interface HistoryAction {
    id: number;
    type: string;
    description: string;
    status: 'executed' | 'discarded' | 'pending';
    timestamp: string;
    signers: string[];
    txHash?: string;
}

const typeIcons: Record<string, typeof Shield> = {
    AddBoardMember: Users,
    AddProposer: Users,
    RemoveUser: Users,
    ChangeQuorum: Settings,
    SendTransferExecute: Send,
    SendAsyncCall: ArrowUpRight,
    SCDeployFromSource: Shield,
};

const typeLabels: Record<string, string> = {
    AddBoardMember: 'Add Board Member',
    AddProposer: 'Add Proposer',
    RemoveUser: 'Remove User',
    ChangeQuorum: 'Change Quorum',
    SendTransferExecute: 'Transfer',
    SendAsyncCall: 'SC Call',
    SCDeployFromSource: 'Deploy Contract',
};

const statusConfig = {
    executed: { color: 'text-green-400', bg: 'bg-green-400/10', icon: CheckCircle2, label: 'Executed' },
    discarded: { color: 'text-red-400', bg: 'bg-red-400/10', icon: XCircle, label: 'Discarded' },
    pending: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: Clock, label: 'Pending' },
};

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export const HistoryPage = () => {
    const account = getAccount();
    const [actions, setActions] = useState<HistoryAction[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'executed' | 'discarded' | 'pending'>('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            // Fetch transaction history from MultiversX API
            const multisigAddresses = JSON.parse(localStorage.getItem('mvx-multisig-addresses') || '[]');
            const allActions: HistoryAction[] = [];

            for (const addr of multisigAddresses) {
                try {
                    const res = await fetch(
                        `${NETWORK_CONFIG.apiUrl}/accounts/${addr}/transactions?size=50&withScResults=true`
                    );
                    if (!res.ok) continue;
                    const txs = await res.json();

                    for (const tx of txs) {
                        const fn = tx.function || '';
                        if (['sign', 'unsign', 'performAction', 'discardAction'].includes(fn)) {
                            const actionId = tx.action?.arguments?.action_id || allActions.length + 1;
                            const existing = allActions.find(a => a.id === actionId);
                            if (!existing) {
                                allActions.push({
                                    id: actionId,
                                    type: fn === 'performAction' ? 'SendTransferExecute' : fn,
                                    description: getDescriptionFromTx(tx),
                                    status: fn === 'performAction' ? 'executed' : fn === 'discardAction' ? 'discarded' : 'pending',
                                    timestamp: new Date(tx.timestamp * 1000).toISOString(),
                                    signers: [tx.sender],
                                    txHash: tx.txHash,
                                });
                            }
                        }
                    }
                } catch {
                    // skip failed fetches
                }
            }

            // Sort newest first
            allActions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            setActions(allActions);
        } catch {
            // If API fails, show empty state
        }
        setLoading(false);
    };

    const getDescriptionFromTx = (tx: any): string => {
        const fn = tx.function || '';
        if (fn === 'performAction') return 'Action performed and executed';
        if (fn === 'discardAction') return 'Action discarded';
        if (fn === 'sign') return 'Signature added';
        if (fn === 'unsign') return 'Signature removed';
        return fn;
    };

    const truncateHash = (hash: string) => `${hash.slice(0, 8)}...${hash.slice(-6)}`;
    const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

    const filtered = actions.filter(a => {
        if (filter !== 'all' && a.status !== filter) return false;
        if (search && !a.description.toLowerCase().includes(search.toLowerCase()) && !a.txHash?.includes(search)) return false;
        return true;
    });

    return (
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-white mb-2">Transaction History</h1>
                <p className="text-slate-400">View all past actions across your multisig wallets</p>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col sm:flex-row gap-3 mb-6"
            >
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-surface border border-surface-border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/40 transition-colors"
                    />
                </div>

                {/* Status filter */}
                <div className="flex gap-1.5 bg-surface border border-surface-border rounded-xl p-1">
                    {(['all', 'executed', 'discarded', 'pending'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${filter === f
                                    ? 'bg-primary/20 text-primary'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Table */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                >
                    <Clock className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">No transactions found</h3>
                    <p className="text-sm text-slate-500 mb-6">
                        {actions.length === 0
                            ? 'Add a multisig wallet from the dashboard to see its history.'
                            : 'No transactions match your filters.'}
                    </p>
                    {actions.length === 0 && (
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 btn-primary px-6 py-2.5 text-sm"
                        >
                            Go to Dashboard
                        </Link>
                    )}
                </motion.div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="glass-card overflow-hidden"
                >
                    {/* Table header */}
                    <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 border-b border-surface-border text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <div className="col-span-1">ID</div>
                        <div className="col-span-3">Type</div>
                        <div className="col-span-3">Description</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-2">Date</div>
                        <div className="col-span-1">TX</div>
                    </div>

                    {/* Rows */}
                    {filtered.map((action) => {
                        const Icon = typeIcons[action.type] || Shield;
                        const sc = statusConfig[action.status];
                        const StatusIcon = sc.icon;

                        return (
                            <motion.div
                                key={`${action.id}-${action.txHash}`}
                                variants={item}
                                className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-4 border-b border-surface-border/50 hover:bg-surface-hover/50 transition-colors"
                            >
                                <div className="col-span-1 text-sm text-slate-400 font-mono">
                                    #{action.id}
                                </div>
                                <div className="col-span-3 flex items-center gap-2">
                                    <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                                    <span className="text-sm text-white font-medium">
                                        {typeLabels[action.type] || action.type}
                                    </span>
                                </div>
                                <div className="col-span-3 text-sm text-slate-400 truncate">
                                    {action.description}
                                </div>
                                <div className="col-span-2">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${sc.color} ${sc.bg}`}>
                                        <StatusIcon className="w-3 h-3" />
                                        {sc.label}
                                    </span>
                                </div>
                                <div className="col-span-2 text-xs text-slate-500">
                                    {new Date(action.timestamp).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </div>
                                <div className="col-span-1">
                                    {action.txHash && (
                                        <a
                                            href={`${NETWORK_CONFIG.explorerUrl}/transactions/${action.txHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:text-primary-light transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}
        </div>
    );
};
