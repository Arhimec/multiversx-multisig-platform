import { useState, useEffect } from 'react';
import { ComingSoonBanner } from '../components/ComingSoonBanner';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Vote,
    Plus,
    CheckCircle2,
    XCircle,
    Clock,
    Users,
    BarChart3,
    MessageSquare,
    ThumbsUp,
    ThumbsDown,
    Loader2,
    AlertTriangle,
    FileText,
    Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Proposal {
    id: string;
    title: string;
    description: string;
    category: 'treasury' | 'governance' | 'technical' | 'community';
    status: 'active' | 'passed' | 'rejected' | 'expired';
    creator: string;
    createdAt: Date;
    expiresAt: Date;
    votesFor: number;
    votesAgainst: number;
    quorum: number;
    totalVoters: number;
    comments: { author: string; text: string; timestamp: Date }[];
}

const STORAGE_KEY = 'mvx-multisig-governance-proposals';

const categoryConfig: Record<string, { color: string; bg: string; label: string }> = {
    treasury: { color: 'text-green-400', bg: 'bg-green-400/10', label: 'Treasury' },
    governance: { color: 'text-purple-400', bg: 'bg-purple-400/10', label: 'Governance' },
    technical: { color: 'text-blue-400', bg: 'bg-blue-400/10', label: 'Technical' },
    community: { color: 'text-orange-400', bg: 'bg-orange-400/10', label: 'Community' },
};

const statusConfig: Record<string, { color: string; bg: string; icon: typeof Vote }> = {
    active: { color: 'text-cyan-400', bg: 'bg-cyan-400/10', icon: Clock },
    passed: { color: 'text-green-400', bg: 'bg-green-400/10', icon: CheckCircle2 },
    rejected: { color: 'text-red-400', bg: 'bg-red-400/10', icon: XCircle },
    expired: { color: 'text-slate-400', bg: 'bg-slate-400/10', icon: Clock },
};

const getSavedProposals = (): Proposal[] => {
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        return data.map((p: any) => ({
            ...p,
            createdAt: new Date(p.createdAt),
            expiresAt: new Date(p.expiresAt),
            comments: (p.comments || []).map((c: any) => ({ ...c, timestamp: new Date(c.timestamp) })),
        }));
    } catch {
        return [];
    }
};

const saveProposals = (proposals: Proposal[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(proposals));
};

const truncateAddress = (addr: string) => addr.length > 16 ? `${addr.slice(0, 8)}...${addr.slice(-4)}` : addr;

export const GovernancePage = () => {
    const [proposals, setProposals] = useState<Proposal[]>(getSavedProposals);
    const [showCreate, setShowCreate] = useState(false);
    const [filter, setFilter] = useState<string>('all');
    const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
    const [newComment, setNewComment] = useState('');

    // Create form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<'treasury' | 'governance' | 'technical' | 'community'>('governance');
    const [duration, setDuration] = useState(7);
    const [quorum, setQuorum] = useState(51);

    // Seed demo data if empty
    useEffect(() => {
        if (proposals.length === 0) {
            const demoProposals: Proposal[] = [
                {
                    id: 'gov-1',
                    title: 'Increase Quorum to 4-of-5',
                    description: 'Proposal to increase the multisig quorum from 3 to 4 signers for enhanced security on mainnet operations.',
                    category: 'governance',
                    status: 'active',
                    creator: 'erd1qqqqqqqqqqqqqpgq...',
                    createdAt: new Date(Date.now() - 86400000 * 2),
                    expiresAt: new Date(Date.now() + 86400000 * 5),
                    votesFor: 3,
                    votesAgainst: 1,
                    quorum: 51,
                    totalVoters: 5,
                    comments: [
                        { author: 'erd1abc...xyz', text: 'I support this for better security.', timestamp: new Date(Date.now() - 86400000) },
                    ],
                },
                {
                    id: 'gov-2',
                    title: 'Treasury Allocation for Q2 2026',
                    description: 'Allocate 500 EGLD from the treasury for ecosystem development, marketing, and infrastructure costs.',
                    category: 'treasury',
                    status: 'active',
                    creator: 'erd1qqqqqqqqqqqqqpgq...',
                    createdAt: new Date(Date.now() - 86400000),
                    expiresAt: new Date(Date.now() + 86400000 * 6),
                    votesFor: 2,
                    votesAgainst: 0,
                    quorum: 51,
                    totalVoters: 5,
                    comments: [],
                },
                {
                    id: 'gov-3',
                    title: 'Add Emergency Signer',
                    description: 'Add a cold wallet address as an emergency signer for disaster recovery scenarios.',
                    category: 'technical',
                    status: 'passed',
                    creator: 'erd1qqqqqqqqqqqqqpgq...',
                    createdAt: new Date(Date.now() - 86400000 * 10),
                    expiresAt: new Date(Date.now() - 86400000 * 3),
                    votesFor: 4,
                    votesAgainst: 1,
                    quorum: 60,
                    totalVoters: 5,
                    comments: [
                        { author: 'erd1def...uvw', text: 'Essential for security.', timestamp: new Date(Date.now() - 86400000 * 8) },
                        { author: 'erd1ghi...rst', text: 'Approved from my end.', timestamp: new Date(Date.now() - 86400000 * 7) },
                    ],
                },
            ];
            setProposals(demoProposals);
            saveProposals(demoProposals);
        }
    }, []);

    const handleCreate = () => {
        if (!title || !description) {
            toast.error('Title and description are required');
            return;
        }

        const newProposal: Proposal = {
            id: `gov-${Date.now()}`,
            title,
            description,
            category,
            status: 'active',
            creator: 'You',
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + duration * 86400000),
            votesFor: 0,
            votesAgainst: 0,
            quorum,
            totalVoters: 5,
            comments: [],
        };

        const updated = [newProposal, ...proposals];
        setProposals(updated);
        saveProposals(updated);
        setShowCreate(false);
        setTitle('');
        setDescription('');
        toast.success('Proposal created!');
    };

    const handleVote = (proposalId: string, isFor: boolean) => {
        const updated = proposals.map(p => {
            if (p.id === proposalId && p.status === 'active') {
                const votesFor = isFor ? p.votesFor + 1 : p.votesFor;
                const votesAgainst = !isFor ? p.votesAgainst + 1 : p.votesAgainst;
                const totalVotes = votesFor + votesAgainst;
                const percentage = (votesFor / totalVotes) * 100;
                const newStatus = totalVotes >= p.totalVoters
                    ? (percentage >= p.quorum ? 'passed' : 'rejected')
                    : 'active';
                return { ...p, votesFor, votesAgainst, status: newStatus as any };
            }
            return p;
        });
        setProposals(updated);
        saveProposals(updated);
        if (selectedProposal) {
            setSelectedProposal(updated.find(p => p.id === proposalId) || null);
        }
        toast.success(isFor ? 'Voted FOR' : 'Voted AGAINST');
    };

    const handleAddComment = (proposalId: string) => {
        if (!newComment.trim()) return;
        const updated = proposals.map(p => {
            if (p.id === proposalId) {
                return {
                    ...p,
                    comments: [...p.comments, { author: 'You', text: newComment, timestamp: new Date() }],
                };
            }
            return p;
        });
        setProposals(updated);
        saveProposals(updated);
        setSelectedProposal(updated.find(p => p.id === proposalId) || null);
        setNewComment('');
        toast.success('Comment added');
    };

    const handleDelete = (proposalId: string) => {
        const updated = proposals.filter(p => p.id !== proposalId);
        setProposals(updated);
        saveProposals(updated);
        setSelectedProposal(null);
        toast.success('Proposal deleted');
    };

    const filtered = filter === 'all' ? proposals : proposals.filter(p => p.status === filter);
    const activeCount = proposals.filter(p => p.status === 'active').length;
    const passedCount = proposals.filter(p => p.status === 'passed').length;

    const timeRemaining = (date: Date): string => {
        const diff = date.getTime() - Date.now();
        if (diff <= 0) return 'Expired';
        const days = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        if (days > 0) return `${days}d ${hours}h`;
        return `${hours}h`;
    };

    return (
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
            <ComingSoonBanner feature="On-chain governance voting" />

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                            <Vote className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Governance</h1>
                            <p className="text-slate-400 text-sm">Vote on proposals and shape the future of your multisig</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowCreate(true)}
                        className="btn-primary flex items-center gap-2 text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        New Proposal
                    </button>
                </div>
            </motion.div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
            >
                <div className="glass-card p-4 text-center">
                    <p className="text-xl font-bold text-white">{proposals.length}</p>
                    <p className="text-[10px] text-slate-500">Total</p>
                </div>
                <div className="glass-card p-4 text-center">
                    <p className="text-xl font-bold text-cyan-400">{activeCount}</p>
                    <p className="text-[10px] text-slate-500">Active</p>
                </div>
                <div className="glass-card p-4 text-center">
                    <p className="text-xl font-bold text-green-400">{passedCount}</p>
                    <p className="text-[10px] text-slate-500">Passed</p>
                </div>
                <div className="glass-card p-4 text-center">
                    <p className="text-xl font-bold text-slate-400">{proposals.filter(p => p.status === 'rejected').length}</p>
                    <p className="text-[10px] text-slate-500">Rejected</p>
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex gap-2 mb-6 overflow-x-auto pb-2"
            >
                {['all', 'active', 'passed', 'rejected'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${filter === f
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'bg-bg border border-surface-border text-slate-400 hover:text-white'
                            }`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </motion.div>

            {/* Proposals list */}
            <div className="space-y-3">
                {filtered.map((proposal, i) => {
                    const StatusIcon = statusConfig[proposal.status].icon;
                    const cat = categoryConfig[proposal.category];
                    const totalVotes = proposal.votesFor + proposal.votesAgainst;
                    const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;

                    return (
                        <motion.div
                            key={proposal.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.05 }}
                            className="glass-card p-5 hover:border-primary/20 transition-all cursor-pointer group"
                            onClick={() => setSelectedProposal(proposal)}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-10 h-10 rounded-xl ${cat.bg} flex items-center justify-center flex-shrink-0`}>
                                    <Vote className={`w-5 h-5 ${cat.color}`} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <h3 className="text-sm font-bold text-white">{proposal.title}</h3>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${cat.bg} ${cat.color}`}>
                                            {cat.label}
                                        </span>
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusConfig[proposal.status].bg} ${statusConfig[proposal.status].color}`}>
                                            <StatusIcon className="w-3 h-3" />
                                            {proposal.status}
                                        </span>
                                    </div>

                                    <p className="text-xs text-slate-500 mb-3 line-clamp-1">{proposal.description}</p>

                                    {/* Vote bar */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-2 bg-bg rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all"
                                                style={{ width: `${forPercentage}%` }}
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] flex-shrink-0">
                                            <span className="text-green-400">{proposal.votesFor} for</span>
                                            <span className="text-slate-600">·</span>
                                            <span className="text-red-400">{proposal.votesAgainst} against</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500">
                                        <span>{proposal.comments.length} comments</span>
                                        <span>·</span>
                                        <span>{proposal.status === 'active' ? `${timeRemaining(proposal.expiresAt)} left` : 'Ended'}</span>
                                    </div>
                                </div>

                                {/* Vote buttons */}
                                {proposal.status === 'active' && (
                                    <div className="flex gap-2 flex-shrink-0">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleVote(proposal.id, true); }}
                                            className="p-2 rounded-xl bg-green-400/10 text-green-400 hover:bg-green-400/20 transition-all"
                                        >
                                            <ThumbsUp className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleVote(proposal.id, false); }}
                                            className="p-2 rounded-xl bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-all"
                                        >
                                            <ThumbsDown className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}

                {filtered.length === 0 && (
                    <div className="text-center py-16">
                        <Vote className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-sm text-slate-500">No proposals found</p>
                    </div>
                )}
            </div>

            {/* Create Proposal Modal */}
            <AnimatePresence>
                {showCreate && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowCreate(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="glass-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-primary" />
                                New Governance Proposal
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-slate-400 mb-1.5 block">Title</label>
                                    <input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Proposal title..."
                                        className="w-full p-3 bg-bg rounded-xl border border-surface-border text-white text-sm placeholder-slate-600 focus:outline-none focus:border-primary/30"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-slate-400 mb-1.5 block">Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Describe the proposal in detail..."
                                        rows={4}
                                        className="w-full p-3 bg-bg rounded-xl border border-surface-border text-white text-sm placeholder-slate-600 focus:outline-none focus:border-primary/30 resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-slate-400 mb-1.5 block">Category</label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value as any)}
                                            className="w-full p-3 bg-bg rounded-xl border border-surface-border text-white text-sm focus:outline-none focus:border-primary/30"
                                        >
                                            <option value="governance">Governance</option>
                                            <option value="treasury">Treasury</option>
                                            <option value="technical">Technical</option>
                                            <option value="community">Community</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-400 mb-1.5 block">Duration (days)</label>
                                        <input
                                            type="number"
                                            value={duration}
                                            onChange={(e) => setDuration(Number(e.target.value))}
                                            min={1}
                                            max={30}
                                            className="w-full p-3 bg-bg rounded-xl border border-surface-border text-white text-sm focus:outline-none focus:border-primary/30"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-slate-400 mb-1.5 block">Quorum Required (%)</label>
                                    <input
                                        type="range"
                                        value={quorum}
                                        onChange={(e) => setQuorum(Number(e.target.value))}
                                        min={10}
                                        max={100}
                                        step={5}
                                        className="w-full accent-primary"
                                    />
                                    <p className="text-xs text-slate-400 text-center">{quorum}%</p>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => setShowCreate(false)}
                                        className="flex-1 py-3 bg-bg border border-surface-border text-slate-300 rounded-xl hover:text-white transition-all text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCreate}
                                        className="flex-1 py-3 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm"
                                    >
                                        Create Proposal
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Proposal Detail Modal */}
            <AnimatePresence>
                {selectedProposal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedProposal(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="glass-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${categoryConfig[selectedProposal.category].bg} ${categoryConfig[selectedProposal.category].color}`}>
                                        {categoryConfig[selectedProposal.category].label}
                                    </span>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusConfig[selectedProposal.status].bg} ${statusConfig[selectedProposal.status].color}`}>
                                        {selectedProposal.status}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleDelete(selectedProposal.id)}
                                    className="text-slate-600 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-2">{selectedProposal.title}</h3>
                            <p className="text-xs text-slate-400 mb-4">{selectedProposal.description}</p>

                            {/* Vote results */}
                            <div className="p-4 bg-bg rounded-xl border border-surface-border mb-4">
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-green-400">For: {selectedProposal.votesFor}</span>
                                    <span className="text-red-400">Against: {selectedProposal.votesAgainst}</span>
                                </div>
                                <div className="h-3 bg-surface-hover rounded-full overflow-hidden flex">
                                    <div
                                        className="bg-gradient-to-r from-green-400 to-green-500 transition-all"
                                        style={{ width: `${(selectedProposal.votesFor + selectedProposal.votesAgainst) > 0 ? (selectedProposal.votesFor / (selectedProposal.votesFor + selectedProposal.votesAgainst)) * 100 : 0}%` }}
                                    />
                                    <div
                                        className="bg-gradient-to-r from-red-400 to-red-500 transition-all"
                                        style={{ width: `${(selectedProposal.votesFor + selectedProposal.votesAgainst) > 0 ? (selectedProposal.votesAgainst / (selectedProposal.votesFor + selectedProposal.votesAgainst)) * 100 : 0}%` }}
                                    />
                                </div>
                                <p className="text-[10px] text-slate-500 mt-2">Quorum: {selectedProposal.quorum}% · {selectedProposal.status === 'active' ? `${timeRemaining(selectedProposal.expiresAt)} remaining` : 'Ended'}</p>
                            </div>

                            {/* Vote buttons if active */}
                            {selectedProposal.status === 'active' && (
                                <div className="flex gap-3 mb-4">
                                    <button
                                        onClick={() => handleVote(selectedProposal.id, true)}
                                        className="flex-1 py-2.5 bg-green-400/10 text-green-400 rounded-xl hover:bg-green-400/20 transition-all text-sm font-medium flex items-center justify-center gap-2"
                                    >
                                        <ThumbsUp className="w-4 h-4" />
                                        Vote For
                                    </button>
                                    <button
                                        onClick={() => handleVote(selectedProposal.id, false)}
                                        className="flex-1 py-2.5 bg-red-400/10 text-red-400 rounded-xl hover:bg-red-400/20 transition-all text-sm font-medium flex items-center justify-center gap-2"
                                    >
                                        <ThumbsDown className="w-4 h-4" />
                                        Vote Against
                                    </button>
                                </div>
                            )}

                            {/* Comments */}
                            <div className="border-t border-surface-border pt-4">
                                <h4 className="text-xs font-semibold text-white mb-3 flex items-center gap-2">
                                    <MessageSquare className="w-3.5 h-3.5 text-primary" />
                                    Discussion ({selectedProposal.comments.length})
                                </h4>

                                <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                                    {selectedProposal.comments.map((c, i) => (
                                        <div key={i} className="p-3 bg-bg rounded-lg border border-surface-border">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-mono text-primary">{truncateAddress(c.author)}</span>
                                                <span className="text-[9px] text-slate-600">
                                                    {c.timestamp.toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-300">{c.text}</p>
                                        </div>
                                    ))}
                                    {selectedProposal.comments.length === 0 && (
                                        <p className="text-xs text-slate-500 text-center py-4">No comments yet</p>
                                    )}
                                </div>

                                {/* Add comment */}
                                <div className="flex gap-2">
                                    <input
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Add a comment..."
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(selectedProposal.id)}
                                        className="flex-1 p-2.5 bg-bg rounded-lg border border-surface-border text-white text-xs placeholder-slate-600 focus:outline-none focus:border-primary/30"
                                    />
                                    <button
                                        onClick={() => handleAddComment(selectedProposal.id)}
                                        className="px-3 py-2.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all"
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
