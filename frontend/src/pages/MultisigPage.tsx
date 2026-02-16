import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAccount } from '@multiversx/sdk-dapp/out/methods/account/getAccount';
import {
    Shield,
    Users,
    UserPlus,
    X,
    ArrowLeft,
    Clock,
    CheckCircle2,
    Send,
    Settings,
    FileText,
    Loader2,
    ExternalLink,
    Copy,
    PenLine,
    Trash2,
    Play,
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { NETWORK_CONFIG } from '../config/network';
import {
    getMultisigInfo,
    getUserRole,
    getActionSignerCount,
    isSigned,
    quorumReached,
    buildSignTransaction,
    buildUnsignTransaction,
    buildPerformActionTransaction,
    buildDiscardActionTransaction,
    buildProposeAddBoardMember,
    sendMultisigTransaction,
    type MultisigInfo,
    type UserRole,
} from '../contracts/multisigInteraction';
import { truncateAddress } from '../utils/formatters';

const getActionIcon = (type: string) => {
    switch (type) {
        case 'SendTransferExecute':
        case 'SendAsyncCall':
            return Send;
        case 'AddBoardMember':
        case 'AddProposer':
            return UserPlus;
        case 'ChangeQuorum':
            return Settings;
        default:
            return FileText;
    }
};

export const MultisigPage = () => {
    const { address: paramAddress } = useParams<{ address: string }>();
    const contractAddress = paramAddress || NETWORK_CONFIG.multisigContractAddress;
    const account = getAccount();

    const [loading, setLoading] = useState(true);
    const [multisigInfo, setMultisigInfo] = useState<MultisigInfo | null>(null);
    const [userRole, setUserRole] = useState<UserRole>('None');
    const [error, setError] = useState<string | null>(null);
    const [actionPending, setActionPending] = useState<string | null>(null);
    const [showAddMember, setShowAddMember] = useState(false);
    const [newMemberAddress, setNewMemberAddress] = useState('');
    const [addingMember, setAddingMember] = useState(false);

    const fetchData = useCallback(async () => {
        if (!contractAddress) return;
        try {
            setLoading(true);
            const info = await getMultisigInfo(contractAddress);
            setMultisigInfo(info);

            if (account?.address) {
                const role = await getUserRole(contractAddress, account.address);
                setUserRole(role);
            }
        } catch (err: any) {
            console.error('Error fetching multisig data:', err);
            setError(err?.message || 'Failed to load');
        } finally {
            setLoading(false);
        }
    }, [contractAddress, account?.address]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const copyAddress = () => {
        navigator.clipboard.writeText(contractAddress);
        toast.success('Address copied to clipboard');
    };

    const handleSign = async (actionId: number) => {
        if (!account?.address) return;
        setActionPending(`sign-${actionId}`);
        try {
            const tx = await buildSignTransaction(contractAddress, actionId, account.address);
            await sendMultisigTransaction(tx);
            toast.success('Transaction signed!');
            fetchData();
        } catch (err: any) {
            toast.error(err?.message || 'Failed to sign');
        } finally {
            setActionPending(null);
        }
    };

    const handleUnsign = async (actionId: number) => {
        if (!account?.address) return;
        setActionPending(`unsign-${actionId}`);
        try {
            const tx = await buildUnsignTransaction(contractAddress, actionId, account.address);
            await sendMultisigTransaction(tx);
            toast.success('Signature removed');
            fetchData();
        } catch (err: any) {
            toast.error(err?.message || 'Failed to unsign');
        } finally {
            setActionPending(null);
        }
    };

    const handlePerform = async (actionId: number) => {
        if (!account?.address) return;
        setActionPending(`perform-${actionId}`);
        try {
            const tx = await buildPerformActionTransaction(contractAddress, actionId, account.address);
            await sendMultisigTransaction(tx);
            toast.success('Action executed!');
            fetchData();
        } catch (err: any) {
            toast.error(err?.message || 'Failed to execute');
        } finally {
            setActionPending(null);
        }
    };

    const handleDiscard = async (actionId: number) => {
        if (!account?.address) return;
        setActionPending(`discard-${actionId}`);
        try {
            const tx = await buildDiscardActionTransaction(contractAddress, actionId, account.address);
            await sendMultisigTransaction(tx);
            toast.success('Action discarded');
            fetchData();
        } catch (err: any) {
            toast.error(err?.message || 'Failed to discard');
        } finally {
            setActionPending(null);
        }
    };

    const handleAddMember = async () => {
        if (!account?.address || !newMemberAddress.startsWith('erd1')) {
            toast.error('Please enter a valid erd1... address');
            return;
        }
        setAddingMember(true);
        try {
            const tx = await buildProposeAddBoardMember(contractAddress, newMemberAddress, account.address);
            await sendMultisigTransaction(tx);
            toast.success('Add member proposal submitted!');
            setShowAddMember(false);
            setNewMemberAddress('');
            fetchData();
        } catch (err: any) {
            toast.error(err?.message || 'Failed to add member');
        } finally {
            setAddingMember(false);
        }
    };

    const explorerUrl = `${NETWORK_CONFIG.explorerUrl}/accounts/${contractAddress}`;

    if (loading) {
        return (
            <div className="page-container flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">Loading multisig data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <p className="text-danger mb-2">{error}</p>
                    <Link to="/" className="text-primary hover:underline text-sm">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            {/* Back Link */}
            <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </Link>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 mb-6"
            >
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <Shield className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">Multisig Wallet</h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <p className="text-sm text-slate-500 font-mono">
                                    {truncateAddress(contractAddress)}
                                </p>
                                <button onClick={copyAddress} className="text-slate-600 hover:text-primary transition-colors">
                                    <Copy className="w-3.5 h-3.5" />
                                </button>
                                <a
                                    href={explorerUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-slate-600 hover:text-primary transition-colors"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
                            <span className="text-sm font-medium text-primary">
                                Quorum: {multisigInfo?.quorum ?? '?'}/{multisigInfo?.numBoardMembers ?? '?'}
                            </span>
                        </div>
                        {userRole !== 'None' && (
                            <div className="px-4 py-2 rounded-xl bg-success/10 border border-success/20">
                                <span className="text-sm font-medium text-success">{userRole}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-surface-border">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-white">{multisigInfo?.numBoardMembers ?? 0}</p>
                        <p className="text-xs text-slate-500 mt-1">Board Members</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-warning">{multisigInfo?.actionLastIndex ?? 0}</p>
                        <p className="text-xs text-slate-500 mt-1">Total Actions</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-success">{multisigInfo?.quorum ?? 0}</p>
                        <p className="text-xs text-slate-500 mt-1">Required Signatures</p>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Proposals Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2"
                >
                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-white">Actions & Proposals</h2>
                            {(userRole === 'BoardMember' || userRole === 'Proposer') && (
                                <button className="btn-primary !px-4 !py-2 !text-sm flex items-center gap-2">
                                    <PenLine className="w-4 h-4" />
                                    New Proposal
                                </button>
                            )}
                        </div>

                        {(multisigInfo?.actionLastIndex ?? 0) === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-surface-hover flex items-center justify-center mb-4">
                                    <FileText className="w-8 h-8 text-slate-600" />
                                </div>
                                <h3 className="text-base font-semibold text-slate-300 mb-2">No Proposals Yet</h3>
                                <p className="text-sm text-slate-500 max-w-sm">
                                    {userRole === 'BoardMember' || userRole === 'Proposer'
                                        ? 'Create your first proposal to start managing this multisig wallet.'
                                        : 'No proposals have been submitted for this multisig wallet yet.'}
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <CheckCircle2 className="w-10 h-10 text-success mb-3" />
                                <p className="text-sm text-slate-400">
                                    {multisigInfo?.actionLastIndex} total action(s) recorded on-chain.
                                </p>
                                <p className="text-xs text-slate-500 mt-2">
                                    Pending actions will appear here automatically.
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Board Members Panel */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-white">Board Members</h2>
                            {userRole === 'BoardMember' && (
                                <button
                                    onClick={() => setShowAddMember(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary/10 text-primary rounded-lg border border-primary/20 hover:bg-primary/20 transition-all"
                                >
                                    <UserPlus className="w-3.5 h-3.5" />
                                    Add Member
                                </button>
                            )}
                        </div>

                        <div className="space-y-3">
                            {(multisigInfo?.boardMembers ?? []).map((member, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 p-3 bg-bg/50 rounded-xl border border-surface-border"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                        <Users className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-mono text-slate-300 truncate">
                                            {truncateAddress(member)}
                                        </p>
                                        <p className="text-[10px] text-slate-500">
                                            {member === account?.address ? 'You · Board Member' : 'Board Member'}
                                        </p>
                                    </div>
                                    {member === account?.address && (
                                        <div className="w-2 h-2 rounded-full bg-success" />
                                    )}
                                </div>
                            ))}

                            {(multisigInfo?.proposers ?? []).length > 0 && (
                                <>
                                    <div className="pt-2 mt-2 border-t border-surface-border">
                                        <p className="text-xs text-slate-500 mb-3">Proposers</p>
                                    </div>
                                    {multisigInfo!.proposers.map((proposer, i) => (
                                        <div
                                            key={`p-${i}`}
                                            className="flex items-center gap-3 p-3 bg-bg/50 rounded-xl border border-surface-border"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                                                <Users className="w-4 h-4 text-accent" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-mono text-slate-300 truncate">
                                                    {truncateAddress(proposer)}
                                                </p>
                                                <p className="text-[10px] text-slate-500">
                                                    {proposer === account?.address ? 'You · Proposer' : 'Proposer'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>

                        {/* Explorer Link */}
                        <div className="mt-6 pt-4 border-t border-surface-border">
                            <a
                                href={explorerUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs text-slate-500 hover:text-primary transition-colors"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                View on Explorer
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
            {/* Add Member Modal */}
            {showAddMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card p-6 w-full max-w-md mx-4 relative"
                    >
                        <button
                            onClick={() => setShowAddMember(false)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <UserPlus className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Add Board Member</h3>
                                <p className="text-xs text-slate-500">This creates a proposal to add a new member</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm text-slate-400 mb-2">Member Address</label>
                            <input
                                type="text"
                                value={newMemberAddress}
                                onChange={(e) => setNewMemberAddress(e.target.value)}
                                placeholder="erd1..."
                                className="w-full px-4 py-3 bg-bg rounded-xl border border-surface-border text-white text-sm font-mono placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-colors"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowAddMember(false)}
                                className="flex-1 px-4 py-2.5 text-sm text-slate-400 bg-surface-hover rounded-xl hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddMember}
                                disabled={addingMember || !newMemberAddress.startsWith('erd1')}
                                className="flex-1 px-4 py-2.5 text-sm bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {addingMember ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                                ) : (
                                    <><UserPlus className="w-4 h-4" /> Add Member</>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};
