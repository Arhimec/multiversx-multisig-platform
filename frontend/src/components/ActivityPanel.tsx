import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    Send,
    UserPlus,
    Settings,
    Shield,
    CheckCircle2,
    Clock,
    XCircle,
} from 'lucide-react';
import { NETWORK_CONFIG } from '../config/network';

interface ActivityItem {
    id: string;
    type: string;
    description: string;
    timestamp: Date;
    txHash?: string;
}

const typeIcons: Record<string, typeof Activity> = {
    sign: CheckCircle2,
    unsign: XCircle,
    proposeAddBoardMember: UserPlus,
    proposeAddProposer: UserPlus,
    proposeSendEgld: Send,
    proposeChangeQuorum: Settings,
    performAction: Shield,
    discardAction: XCircle,
};

const typeLabels: Record<string, string> = {
    sign: 'Signed',
    unsign: 'Unsigned',
    proposeAddBoardMember: 'Proposed add member',
    proposeAddProposer: 'Proposed add proposer',
    proposeSendEgld: 'Proposed transfer',
    proposeChangeQuorum: 'Proposed quorum change',
    performAction: 'Executed action',
    discardAction: 'Discarded action',
};

const typeColors: Record<string, string> = {
    sign: 'text-green-400',
    unsign: 'text-orange-400',
    proposeAddBoardMember: 'text-blue-400',
    proposeAddProposer: 'text-blue-400',
    proposeSendEgld: 'text-cyan-400',
    proposeChangeQuorum: 'text-yellow-400',
    performAction: 'text-emerald-400',
    discardAction: 'text-red-400',
};

const timeAgo = (date: Date): string => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

export const ActivityPanel = () => {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActivity();
    }, []);

    const fetchActivity = async () => {
        try {
            const addresses = JSON.parse(localStorage.getItem('mvx-multisig-addresses') || '[]');
            const defaultAddr = NETWORK_CONFIG.multisigContractAddress;
            const allAddresses = defaultAddr ? [defaultAddr, ...addresses.filter((a: string) => a !== defaultAddr)] : addresses;

            const items: ActivityItem[] = [];

            for (const addr of allAddresses) {
                try {
                    const res = await fetch(`${NETWORK_CONFIG.apiUrl}/accounts/${addr}/transactions?size=10&status=success`);
                    if (!res.ok) continue;
                    const txs = await res.json();

                    for (const tx of txs) {
                        const fn = tx.function || '';
                        if (typeLabels[fn]) {
                            items.push({
                                id: tx.txHash,
                                type: fn,
                                description: typeLabels[fn],
                                timestamp: new Date(tx.timestamp * 1000),
                                txHash: tx.txHash,
                            });
                        }
                    }
                } catch {
                    // skip
                }
            }

            items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
            setActivities(items.slice(0, 10));
        } catch {
            // silent
        }
        setLoading(false);
    };

    return (
        <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : activities.length === 0 ? (
                <div className="text-center py-8">
                    <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">No recent activity</p>
                </div>
            ) : (
                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-[11px] top-2 bottom-2 w-px bg-surface-border" />

                    <div className="space-y-3">
                        {activities.map((activity, i) => {
                            const Icon = typeIcons[activity.type] || Activity;
                            const color = typeColors[activity.type] || 'text-slate-400';

                            return (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex items-start gap-3 relative"
                                >
                                    <div className={`w-[22px] h-[22px] rounded-full bg-bg border border-surface-border flex items-center justify-center flex-shrink-0 z-10 ${color}`}>
                                        <Icon className="w-3 h-3" />
                                    </div>
                                    <div className="flex-1 min-w-0 pt-0.5">
                                        <p className="text-xs text-slate-300 leading-tight">
                                            {activity.description}
                                        </p>
                                        <p className="text-[10px] text-slate-600 mt-0.5">
                                            {timeAgo(activity.timestamp)}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
