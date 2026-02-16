import { useState, useEffect } from 'react';
import { ComingSoonBanner } from '../components/ComingSoonBanner';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HeartHandshake,
    Plus,
    Trash2,
    Users,
    Shield,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Copy,
    Mail,
    RefreshCw,
    Info,
    Lock,
} from 'lucide-react';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'mvx-multisig-social-recovery';

interface Guardian {
    id: string;
    name: string;
    address: string;
    email: string;
    addedAt: string;
    confirmed: boolean;
}

interface RecoveryConfig {
    enabled: boolean;
    threshold: number;
    guardians: Guardian[];
    cooldownHours: number;
    lastRecoveryAttempt: string | null;
}

const getConfig = (): RecoveryConfig => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || {
            enabled: false, threshold: 2, guardians: [], cooldownHours: 48, lastRecoveryAttempt: null,
        };
    } catch { return { enabled: false, threshold: 2, guardians: [], cooldownHours: 48, lastRecoveryAttempt: null }; }
};
const saveConfig = (c: RecoveryConfig) => localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
const truncAddr = (a: string) => a.length > 20 ? `${a.slice(0, 10)}...${a.slice(-6)}` : a;

export const SocialRecoveryPage = () => {
    const [config, setConfig] = useState<RecoveryConfig>(getConfig);
    const [showAdd, setShowAdd] = useState(false);
    const [showRecovery, setShowRecovery] = useState(false);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [recovering, setRecovering] = useState(false);

    // Seed demo guardians if empty
    useEffect(() => {
        if (config.guardians.length === 0 && !config.enabled) {
            const demo: Guardian[] = [
                { id: 'g1', name: 'Alice (Hardware Wallet)', address: 'erd1qyu5wthldzr8wx5c9ucg8kjagg0jfs53s8nr3zpz3hypefsdd8ssycr6th', email: 'alice@example.com', addedAt: new Date(Date.now() - 86400000 * 30).toISOString(), confirmed: true },
                { id: 'g2', name: 'Bob (Cold Storage)', address: 'erd1spyavw0956vq68xj8y4tenjpq2wd5a9p2c6j8gsz7ztyrnpxrruqzu66jx', email: 'bob@example.com', addedAt: new Date(Date.now() - 86400000 * 15).toISOString(), confirmed: true },
                { id: 'g3', name: 'Charlie (Ledger)', address: 'erd1k2s324ww2c0yma7gsp2ql64e8mvd4r9v9xrywn9mc5t3qytwmrkqcvt8rl', email: 'charlie@example.com', addedAt: new Date(Date.now() - 86400000 * 5).toISOString(), confirmed: false },
            ];
            const u = { ...config, guardians: demo, enabled: true, threshold: 2 };
            setConfig(u); saveConfig(u);
        }
    }, []);

    const handleAdd = () => {
        if (!name || !address) { toast.error('Name and address required'); return; }
        const g: Guardian = { id: `g-${Date.now()}`, name, address, email, addedAt: new Date().toISOString(), confirmed: false };
        const u = { ...config, guardians: [...config.guardians, g] };
        setConfig(u); saveConfig(u);
        setShowAdd(false); setName(''); setAddress(''); setEmail('');
        toast.success('Guardian added! They need to confirm.');
    };

    const handleRemove = (id: string) => {
        const u = { ...config, guardians: config.guardians.filter(g => g.id !== id) };
        setConfig(u); saveConfig(u);
        toast.success('Guardian removed');
    };

    const handleConfirm = (id: string) => {
        const u = { ...config, guardians: config.guardians.map(g => g.id === id ? { ...g, confirmed: true } : g) };
        setConfig(u); saveConfig(u);
        toast.success('Guardian confirmed!');
    };

    const handleRecovery = async () => {
        setRecovering(true);
        await new Promise(r => setTimeout(r, 2500));
        setRecovering(false);
        const u = { ...config, lastRecoveryAttempt: new Date().toISOString() };
        setConfig(u); saveConfig(u);
        setShowRecovery(false);
        toast.success('Recovery initiated! Guardians notified. Cooldown: 48h');
    };

    const toggleEnabled = () => {
        const u = { ...config, enabled: !config.enabled };
        setConfig(u); saveConfig(u);
        toast.success(u.enabled ? 'Social Recovery enabled' : 'Social Recovery disabled');
    };

    const confirmedCount = config.guardians.filter(g => g.confirmed).length;

    return (
        <div className="p-6 lg:p-8 max-w-4xl mx-auto">
            <ComingSoonBanner feature="Social recovery through trusted guardians" />

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                            <HeartHandshake className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Social Recovery</h1>
                            <p className="text-slate-400 text-sm">Recover access through trusted guardians</p>
                        </div>
                    </div>
                    <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2 text-sm">
                        <Plus className="w-4 h-4" />Add Guardian
                    </button>
                </div>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="glass-card p-4 text-center">
                    <p className="text-xl font-bold text-white">{config.guardians.length}</p>
                    <p className="text-[10px] text-slate-500">Guardians</p>
                </div>
                <div className="glass-card p-4 text-center">
                    <p className="text-xl font-bold text-green-400">{confirmedCount}</p>
                    <p className="text-[10px] text-slate-500">Confirmed</p>
                </div>
                <div className="glass-card p-4 text-center">
                    <p className="text-xl font-bold text-primary">{config.threshold}</p>
                    <p className="text-[10px] text-slate-500">Threshold</p>
                </div>
                <div className="glass-card p-4 text-center">
                    <p className="text-xl font-bold text-slate-400">{config.cooldownHours}h</p>
                    <p className="text-[10px] text-slate-500">Cooldown</p>
                </div>
            </motion.div>

            {/* Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="glass-card p-4 mb-6 border-primary/20">
                <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-slate-300 font-medium mb-1">How Social Recovery Works</p>
                        <p className="text-xs text-slate-500">
                            Designate trusted guardians who can collectively help you recover access to your multisig.
                            A minimum of <strong className="text-primary">{config.threshold} of {config.guardians.length}</strong> guardians must approve a recovery request.
                            A {config.cooldownHours}-hour cooldown period allows you to cancel false recovery attempts.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Enable/Disable toggle */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="glass-card p-4 mb-6">
                <button onClick={toggleEnabled} className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-primary" />
                        <div className="text-left">
                            <p className="text-sm font-semibold text-white">Social Recovery</p>
                            <p className="text-[10px] text-slate-500">{config.enabled ? 'Active — guardians can initiate recovery' : 'Disabled — enable to activate'}</p>
                        </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-colors ${config.enabled ? 'bg-primary' : 'bg-slate-600'}`}>
                        <div className={`w-5 h-5 mt-0.5 rounded-full bg-white transition-transform ${config.enabled ? 'translate-x-[26px]' : 'translate-x-0.5'}`} />
                    </div>
                </button>
            </motion.div>

            {/* Threshold / Cooldown settings */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="glass-card p-5 mb-6">
                <h3 className="text-sm font-semibold text-white mb-4">Recovery Parameters</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-slate-400 block mb-1.5">Recovery Threshold</label>
                        <select value={config.threshold}
                            onChange={e => { const u = { ...config, threshold: Number(e.target.value) }; setConfig(u); saveConfig(u); }}
                            className="w-full p-3 bg-bg rounded-xl border border-surface-border text-white text-sm focus:outline-none focus:border-primary/30">
                            {Array.from({ length: Math.max(config.guardians.length, 1) }, (_, i) => i + 1).map(n => (
                                <option key={n} value={n}>{n} of {config.guardians.length} guardians</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 block mb-1.5">Cooldown Period</label>
                        <select value={config.cooldownHours}
                            onChange={e => { const u = { ...config, cooldownHours: Number(e.target.value) }; setConfig(u); saveConfig(u); }}
                            className="w-full p-3 bg-bg rounded-xl border border-surface-border text-white text-sm focus:outline-none focus:border-primary/30">
                            {[12, 24, 48, 72, 168].map(h => (
                                <option key={h} value={h}>{h} hours ({h / 24} days)</option>
                            ))}
                        </select>
                    </div>
                </div>
            </motion.div>

            {/* Guardian list */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <h3 className="text-sm font-semibold text-white mb-3">Guardians ({config.guardians.length})</h3>
                <div className="space-y-3">
                    {config.guardians.map((g, i) => (
                        <motion.div key={g.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                            className="glass-card p-4 hover:border-primary/20 transition-all">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold ${g.confirmed ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-slate-500 to-slate-600'}`}>
                                    {g.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h4 className="text-sm font-semibold text-white">{g.name}</h4>
                                        {g.confirmed
                                            ? <span className="px-2 py-0.5 bg-green-400/10 text-green-400 rounded-full text-[10px] flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Confirmed</span>
                                            : <span className="px-2 py-0.5 bg-yellow-400/10 text-yellow-400 rounded-full text-[10px] flex items-center gap-1"><Clock className="w-3 h-3" />Pending</span>
                                        }
                                    </div>
                                    <p className="text-[10px] font-mono text-slate-500">{truncAddr(g.address)}</p>
                                    {g.email && <p className="text-[10px] text-slate-600 flex items-center gap-1 mt-0.5"><Mail className="w-3 h-3" />{g.email}</p>}
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                    {!g.confirmed && (
                                        <button onClick={() => handleConfirm(g.id)} className="p-2 rounded-lg bg-green-400/10 text-green-400 hover:bg-green-400/20 transition-all" title="Confirm">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button onClick={() => { navigator.clipboard.writeText(g.address); toast.success('Address copied'); }}
                                        className="p-2 rounded-lg bg-surface-hover text-slate-400 hover:text-white transition-all" title="Copy">
                                        <Copy className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleRemove(g.id)}
                                        className="p-2 rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-all" title="Remove">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {config.guardians.length === 0 && (
                        <div className="text-center py-12">
                            <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <p className="text-sm text-slate-500">No guardians added yet</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Initiate Recovery */}
            {config.enabled && confirmedCount >= config.threshold && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                    className="mt-6 glass-card p-5 border-yellow-400/10">
                    <div className="flex items-center gap-3 mb-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                        <h3 className="text-sm font-semibold text-white">Emergency Recovery</h3>
                    </div>
                    <p className="text-xs text-slate-500 mb-4">Initiate a recovery request. This will notify all guardians. {config.threshold} approvals needed. {config.cooldownHours}h cooldown.</p>
                    <button onClick={() => setShowRecovery(true)}
                        className="w-full py-3 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 rounded-xl hover:bg-yellow-400/20 transition-all text-sm font-medium flex items-center justify-center gap-2">
                        <Lock className="w-4 h-4" />Initiate Recovery
                    </button>
                </motion.div>
            )}

            {/* Add Guardian Modal */}
            <AnimatePresence>
                {showAdd && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                            className="glass-card p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-primary" />Add Guardian</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">Name</label>
                                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Guardian name"
                                        className="w-full p-3 bg-bg rounded-xl border border-surface-border text-white text-sm placeholder-slate-600 focus:outline-none focus:border-primary/30" />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">Wallet Address</label>
                                    <input value={address} onChange={e => setAddress(e.target.value)} placeholder="erd1..."
                                        className="w-full p-3 bg-bg rounded-xl border border-surface-border text-white text-sm font-mono placeholder-slate-600 focus:outline-none focus:border-primary/30" />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">Email (optional)</label>
                                    <input value={email} onChange={e => setEmail(e.target.value)} placeholder="guardian@email.com"
                                        className="w-full p-3 bg-bg rounded-xl border border-surface-border text-white text-sm placeholder-slate-600 focus:outline-none focus:border-primary/30" />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button onClick={() => setShowAdd(false)} className="flex-1 py-3 bg-bg border border-surface-border text-slate-300 rounded-xl text-sm">Cancel</button>
                                    <button onClick={handleAdd} className="flex-1 py-3 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl text-sm">Add Guardian</button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Recovery Confirm Modal */}
            <AnimatePresence>
                {showRecovery && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowRecovery(false)}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                            className="glass-card p-6 w-full max-w-sm text-center" onClick={e => e.stopPropagation()}>
                            <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-white mb-2">Confirm Recovery</h3>
                            <p className="text-xs text-slate-400 mb-6">This will notify all {confirmedCount} confirmed guardians. {config.threshold} must approve within {config.cooldownHours} hours.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowRecovery(false)} className="flex-1 py-3 bg-bg border border-surface-border text-slate-300 rounded-xl text-sm">Cancel</button>
                                <button onClick={handleRecovery} disabled={recovering}
                                    className="flex-1 py-3 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 rounded-xl text-sm hover:bg-yellow-400/20 flex items-center justify-center gap-2">
                                    {recovering ? <><RefreshCw className="w-4 h-4 animate-spin" />Processing...</> : <>Initiate</>}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
