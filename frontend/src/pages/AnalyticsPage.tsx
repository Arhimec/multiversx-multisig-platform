import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Activity,
    Users,
    Clock,
    Loader2,
    PieChart,
} from 'lucide-react';
import { NETWORK_CONFIG } from '../config/network';

interface AnalyticsData {
    totalTransactions: number;
    totalVolume: number;
    memberActivity: { address: string; actions: number }[];
    actionsByType: { type: string; count: number }[];
    monthlyActivity: { month: string; count: number }[];
}

const actionTypeLabels: Record<string, string> = {
    sign: 'Signatures',
    unsign: 'Unsignatures',
    proposeAddBoardMember: 'Add Member',
    proposeAddProposer: 'Add Proposer',
    proposeSendEgld: 'Transfers',
    proposeChangeQuorum: 'Quorum Changes',
    performAction: 'Executions',
    discardAction: 'Discards',
};

const barColors = [
    'bg-cyan-400', 'bg-blue-400', 'bg-purple-400', 'bg-pink-400',
    'bg-green-400', 'bg-yellow-400', 'bg-orange-400', 'bg-red-400',
];

export const AnalyticsPage = () => {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const addresses = JSON.parse(localStorage.getItem('mvx-multisig-addresses') || '[]');
            const defaultAddr = NETWORK_CONFIG.multisigContractAddress;
            const allAddrs = defaultAddr ? [defaultAddr, ...addresses.filter((a: string) => a !== defaultAddr)] : addresses;

            const memberMap: Record<string, number> = {};
            const typeMap: Record<string, number> = {};
            const monthMap: Record<string, number> = {};
            let total = 0;

            for (const addr of allAddrs) {
                try {
                    const res = await fetch(`${NETWORK_CONFIG.apiUrl}/accounts/${addr}/transactions?size=100&status=success`);
                    if (!res.ok) continue;
                    const txs = await res.json();

                    for (const tx of txs) {
                        total++;
                        const sender = tx.sender;
                        memberMap[sender] = (memberMap[sender] || 0) + 1;

                        const fn = tx.function || 'other';
                        typeMap[fn] = (typeMap[fn] || 0) + 1;

                        const date = new Date(tx.timestamp * 1000);
                        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                        monthMap[monthKey] = (monthMap[monthKey] || 0) + 1;
                    }
                } catch {
                    // skip
                }
            }

            setData({
                totalTransactions: total,
                totalVolume: 0,
                memberActivity: Object.entries(memberMap)
                    .map(([address, actions]) => ({ address, actions }))
                    .sort((a, b) => b.actions - a.actions),
                actionsByType: Object.entries(typeMap)
                    .map(([type, count]) => ({ type, count }))
                    .sort((a, b) => b.count - a.count),
                monthlyActivity: Object.entries(monthMap)
                    .map(([month, count]) => ({ month, count }))
                    .sort((a, b) => a.month.localeCompare(b.month)),
            });
        } catch {
            setData(null);
        }
        setLoading(false);
    };

    const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

    if (loading) {
        return (
            <div className="p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    const maxAction = data ? Math.max(...data.actionsByType.map(a => a.count), 1) : 1;
    const maxMonthly = data ? Math.max(...data.monthlyActivity.map(m => m.count), 1) : 1;
    const maxMember = data ? Math.max(...data.memberActivity.map(m => m.actions), 1) : 1;

    return (
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
                <p className="text-slate-400">Insights into your multisig activity and fund flows</p>
            </motion.div>

            {/* Overview cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8"
            >
                <div className="glass-card p-4">
                    <div className="w-9 h-9 rounded-xl bg-cyan-400/10 flex items-center justify-center mb-3">
                        <BarChart3 className="w-4 h-4 text-cyan-400" />
                    </div>
                    <p className="text-xl font-bold text-white">{data?.totalTransactions ?? 0}</p>
                    <p className="text-[10px] text-slate-500">Total Transactions</p>
                </div>
                <div className="glass-card p-4">
                    <div className="w-9 h-9 rounded-xl bg-green-400/10 flex items-center justify-center mb-3">
                        <Users className="w-4 h-4 text-green-400" />
                    </div>
                    <p className="text-xl font-bold text-white">{data?.memberActivity.length ?? 0}</p>
                    <p className="text-[10px] text-slate-500">Active Members</p>
                </div>
                <div className="glass-card p-4">
                    <div className="w-9 h-9 rounded-xl bg-purple-400/10 flex items-center justify-center mb-3">
                        <PieChart className="w-4 h-4 text-purple-400" />
                    </div>
                    <p className="text-xl font-bold text-white">{data?.actionsByType.length ?? 0}</p>
                    <p className="text-[10px] text-slate-500">Action Types</p>
                </div>
                <div className="glass-card p-4">
                    <div className="w-9 h-9 rounded-xl bg-yellow-400/10 flex items-center justify-center mb-3">
                        <Activity className="w-4 h-4 text-yellow-400" />
                    </div>
                    <p className="text-xl font-bold text-white">{data?.monthlyActivity.length ?? 0}</p>
                    <p className="text-[10px] text-slate-500">Active Months</p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Actions by Type */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6"
                >
                    <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                        <PieChart className="w-4 h-4 text-primary" />
                        Actions by Type
                    </h3>
                    <div className="space-y-3">
                        {(data?.actionsByType ?? []).map((item, i) => (
                            <div key={item.type} className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-300">{actionTypeLabels[item.type] || item.type}</span>
                                    <span className="text-slate-500">{item.count}</span>
                                </div>
                                <div className="h-2 bg-bg rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(item.count / maxAction) * 100}%` }}
                                        transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                                        className={`h-full rounded-full ${barColors[i % barColors.length]}`}
                                    />
                                </div>
                            </div>
                        ))}
                        {(data?.actionsByType ?? []).length === 0 && (
                            <p className="text-xs text-slate-500 text-center py-8">No data available</p>
                        )}
                    </div>
                </motion.div>

                {/* Monthly Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6"
                >
                    <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-primary" />
                        Monthly Activity
                    </h3>
                    <div className="flex items-end gap-2 h-40">
                        {(data?.monthlyActivity ?? []).map((m, i) => (
                            <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                                <span className="text-[10px] text-slate-500">{m.count}</span>
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(m.count / maxMonthly) * 100}%` }}
                                    transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                                    className="w-full bg-gradient-to-t from-primary to-accent rounded-t-md min-h-[4px]"
                                />
                                <span className="text-[9px] text-slate-600 mt-1 whitespace-nowrap">
                                    {m.month.slice(5)}
                                </span>
                            </div>
                        ))}
                        {(data?.monthlyActivity ?? []).length === 0 && (
                            <p className="text-xs text-slate-500 w-full text-center self-center">No data available</p>
                        )}
                    </div>
                </motion.div>

                {/* Member Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-6 lg:col-span-2"
                >
                    <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        Member Activity
                    </h3>
                    <div className="space-y-3">
                        {(data?.memberActivity ?? []).slice(0, 10).map((member, i) => (
                            <div key={member.address} className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Users className="w-4 h-4 text-primary" />
                                </div>
                                <span className="text-xs font-mono text-slate-400 w-28 truncate flex-shrink-0">
                                    {truncateAddress(member.address)}
                                </span>
                                <div className="flex-1 h-2 bg-bg rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(member.actions / maxMember) * 100}%` }}
                                        transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
                                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                                    />
                                </div>
                                <span className="text-xs text-slate-500 w-12 text-right flex-shrink-0">
                                    {member.actions}
                                </span>
                            </div>
                        ))}
                        {(data?.memberActivity ?? []).length === 0 && (
                            <p className="text-xs text-slate-500 text-center py-8">No data available</p>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
