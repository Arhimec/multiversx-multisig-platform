import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAccount } from '@multiversx/sdk-dapp/out/methods/account/getAccount';
import {
    Coins,
    Shield,
    Loader2,
    ExternalLink,
    Info,
    X,
} from 'lucide-react';
import { NETWORK_CONFIG } from '../config/network';
import {
    buildProposeDelegation,
    sendMultisigTransaction,
} from '../contracts/multisigInteraction';
import toast from 'react-hot-toast';

interface StakingProvider {
    provider: string;
    serviceFee: number;
    delegationCap: string;
    apr: number;
    numUsers: number;
    identity?: {
        name?: string;
        avatar?: string;
    };
}

export const StakingPage = () => {
    const account = getAccount();
    const [providers, setProviders] = useState<StakingProvider[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProvider, setSelectedProvider] = useState<StakingProvider | null>(null);
    const [delegateAmount, setDelegateAmount] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchProviders();
    }, []);

    const fetchProviders = async () => {
        try {
            const res = await fetch(`${NETWORK_CONFIG.apiUrl}/providers?size=20`);
            if (res.ok) {
                const data = await res.json();
                setProviders(data.sort((a: StakingProvider, b: StakingProvider) => (b.apr || 0) - (a.apr || 0)));
            }
        } catch {
            // silent
        }
        setLoading(false);
    };

    const handleDelegate = async () => {
        if (!account?.address || !selectedProvider || !delegateAmount) return;
        const amountInWei = BigInt(Math.floor(parseFloat(delegateAmount) * 1e18)).toString();
        if (BigInt(amountInWei) <= 0n) {
            toast.error('Please enter a valid amount');
            return;
        }
        setSubmitting(true);
        try {
            const tx = await buildProposeDelegation(
                NETWORK_CONFIG.multisigContractAddress,
                selectedProvider.provider,
                amountInWei,
                account.address,
            );
            await sendMultisigTransaction(tx);
            toast.success('Delegation proposal submitted!');
            setSelectedProvider(null);
            setDelegateAmount('');
        } catch (err: any) {
            toast.error(err?.message || 'Failed to submit delegation proposal');
        } finally {
            setSubmitting(false);
        }
    };

    const truncateAddress = (addr: string) => `${addr.slice(0, 8)}...${addr.slice(-6)}`;

    return (
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Staking</h1>
                <p className="text-slate-400">Delegate EGLD from your multisig to earn staking rewards</p>
            </motion.div>

            {/* Info banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-4 mb-6 flex items-start gap-3 border-primary/20"
            >
                <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm text-slate-300 mb-1">
                        <strong>How it works:</strong> Staking from a multisig requires a proposal to delegate EGLD to a staking provider.
                    </p>
                    <p className="text-xs text-slate-500">
                        Board members need to sign the proposal. Once the quorum is reached, the delegation is executed on-chain.
                    </p>
                </div>
            </motion.div>

            {/* Providers list */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-3"
                >
                    {providers.map((p, i) => (
                        <div
                            key={p.provider}
                            className="glass-card p-4 sm:p-5 hover:border-primary/20 transition-all group"
                        >
                            <div className="flex items-center gap-4 flex-wrap">
                                {/* Icon */}
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                                    {p.identity?.avatar ? (
                                        <img src={p.identity.avatar} alt="" className="w-8 h-8 rounded-lg" />
                                    ) : (
                                        <Shield className="w-5 h-5 text-primary" />
                                    )}
                                </div>

                                {/* Name */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-white">
                                        {p.identity?.name || `Provider #${i + 1}`}
                                    </p>
                                    <p className="text-[10px] font-mono text-slate-500 truncate">
                                        {truncateAddress(p.provider)}
                                    </p>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-4 sm:gap-6 text-center">
                                    <div>
                                        <p className="text-sm font-bold text-green-400">
                                            {p.apr ? `${(p.apr * 100).toFixed(1)}%` : 'N/A'}
                                        </p>
                                        <p className="text-[10px] text-slate-500">APR</p>
                                    </div>
                                    <div className="hidden sm:block">
                                        <p className="text-sm font-bold text-white">
                                            {(p.serviceFee * 100).toFixed(1)}%
                                        </p>
                                        <p className="text-[10px] text-slate-500">Fee</p>
                                    </div>
                                    <div className="hidden sm:block">
                                        <p className="text-sm font-bold text-white">{p.numUsers}</p>
                                        <p className="text-[10px] text-slate-500">Delegators</p>
                                    </div>
                                </div>

                                {/* Action */}
                                <button
                                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-primary/10 text-primary rounded-xl border border-primary/20 hover:bg-primary/20 transition-all flex items-center gap-1.5"
                                    onClick={() => setSelectedProvider(p)}
                                >
                                    <Coins className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Delegate</span>
                                </button>
                            </div>
                        </div>
                    ))}

                    {providers.length === 0 && (
                        <div className="text-center py-16">
                            <Coins className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <p className="text-sm text-slate-500">No staking providers found on {NETWORK_CONFIG.displayName}</p>
                        </div>
                    )}
                </motion.div>
            )}

            {/* Delegation Modal */}
            {selectedProvider && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card p-6 w-full max-w-md mx-4 relative"
                    >
                        <button
                            onClick={() => setSelectedProvider(null)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Coins className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Delegate EGLD</h3>
                                <p className="text-xs text-slate-500">
                                    to {selectedProvider.identity?.name || truncateAddress(selectedProvider.provider)}
                                </p>
                            </div>
                        </div>

                        {/* Provider stats */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            <div className="bg-bg/50 rounded-xl p-3 text-center">
                                <p className="text-sm font-bold text-green-400">
                                    {selectedProvider.apr ? `${(selectedProvider.apr * 100).toFixed(1)}%` : 'N/A'}
                                </p>
                                <p className="text-[10px] text-slate-500">APR</p>
                            </div>
                            <div className="bg-bg/50 rounded-xl p-3 text-center">
                                <p className="text-sm font-bold text-white">
                                    {(selectedProvider.serviceFee * 100).toFixed(1)}%
                                </p>
                                <p className="text-[10px] text-slate-500">Fee</p>
                            </div>
                            <div className="bg-bg/50 rounded-xl p-3 text-center">
                                <p className="text-sm font-bold text-white">{selectedProvider.numUsers}</p>
                                <p className="text-[10px] text-slate-500">Delegators</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm text-slate-400 mb-2">Amount (EGLD)</label>
                            <input
                                type="number"
                                step="0.01"
                                min="1"
                                value={delegateAmount}
                                onChange={(e) => setDelegateAmount(e.target.value)}
                                placeholder="1.0"
                                className="w-full px-4 py-3 bg-bg rounded-xl border border-surface-border text-white text-sm font-mono placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-colors"
                            />
                            <p className="text-[10px] text-slate-500 mt-1">Minimum 1 EGLD for delegation</p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setSelectedProvider(null)}
                                className="flex-1 px-4 py-2.5 text-sm text-slate-400 bg-surface-hover rounded-xl hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelegate}
                                disabled={submitting || !delegateAmount || parseFloat(delegateAmount) < 1}
                                className="flex-1 px-4 py-2.5 text-sm bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                                ) : (
                                    <><Coins className="w-4 h-4" /> Propose Delegation</>
                                )}
                            </button>
                        </div>

                        <p className="text-[10px] text-slate-500 mt-4 text-center">
                            This creates a multisig proposal. Board members must sign before execution.
                        </p>
                    </motion.div>
                </div>
            )}
        </div>
    );
};
