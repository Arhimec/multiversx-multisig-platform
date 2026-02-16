import { useState } from 'react';
import { ComingSoonBanner } from '../components/ComingSoonBanner';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck,
    Smartphone,
    Key,
    Fingerprint,
    CheckCircle2,
    AlertTriangle,
    Copy,
    Eye,
    EyeOff,
    RefreshCw,
    Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'mvx-multisig-2fa-settings';
const FAKE_SECRET = 'JBSWY3DPEHPK3PXP';

interface TwoFASettings {
    enabled: boolean;
    method: 'totp' | 'sms' | 'biometric' | null;
    lastVerified: string | null;
    requireForActions: string[];
}

const getSettings = (): TwoFASettings => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || {
            enabled: false, method: null, lastVerified: null,
            requireForActions: ['sign', 'performAction', 'proposeTransfer'],
        };
    } catch { return { enabled: false, method: null, lastVerified: null, requireForActions: ['sign', 'performAction', 'proposeTransfer'] }; }
};
const saveSettings = (s: TwoFASettings) => localStorage.setItem(STORAGE_KEY, JSON.stringify(s));

const methods = [
    { id: 'totp' as const, name: 'Authenticator App', desc: 'Google Authenticator / Authy', icon: Smartphone, color: 'from-blue-500 to-indigo-600', rec: true },
    { id: 'sms' as const, name: 'SMS Verification', desc: '6-digit code via SMS', icon: Key, color: 'from-green-500 to-emerald-600', rec: false },
    { id: 'biometric' as const, name: 'Biometric (WebAuthn)', desc: 'Fingerprint or face recognition', icon: Fingerprint, color: 'from-purple-500 to-pink-600', rec: false },
];

const actionLabels: Record<string, string> = {
    sign: 'Sign Proposals', performAction: 'Execute Actions', proposeTransfer: 'Propose Transfers',
    addMember: 'Add Members', changeQuorum: 'Change Quorum', bridge: 'Cross-Chain Bridge',
};

// Generate fake QR dots
const QR_DOTS: number[][] = [];
for (let i = 0; i < 15; i++) for (let j = 0; j < 15; j++) if (Math.random() > 0.4) QR_DOTS.push([i, j]);

export const TwoFAPage = () => {
    const [settings, setSettings] = useState<TwoFASettings>(getSettings);
    const [step, setStep] = useState(0);
    const [showSecret, setShowSecret] = useState(false);
    const [code, setCode] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [disableModal, setDisableModal] = useState(false);

    const handleVerify = async () => {
        setVerifying(true);
        await new Promise(r => setTimeout(r, 1500));
        setVerifying(false);
        if (code.length === 6) {
            const u: TwoFASettings = { ...settings, enabled: true, lastVerified: new Date().toISOString() };
            setSettings(u); saveSettings(u); setStep(0); setCode('');
            toast.success('2FA enabled!');
        } else toast.error('Invalid code');
    };

    const handleDisable = () => {
        const u: TwoFASettings = { enabled: false, method: null, lastVerified: null, requireForActions: settings.requireForActions };
        setSettings(u); saveSettings(u); setDisableModal(false);
        toast.success('2FA disabled');
    };

    const toggleAction = (a: string) => {
        const acts = settings.requireForActions.includes(a) ? settings.requireForActions.filter(x => x !== a) : [...settings.requireForActions, a];
        const u = { ...settings, requireForActions: acts }; setSettings(u); saveSettings(u);
    };

    return (
        <div className="p-6 lg:p-8 max-w-4xl mx-auto">
            <ComingSoonBanner feature="Two-factor authentication for multisig operations" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Two-Factor Authentication</h1>
                        <p className="text-slate-400 text-sm">Extra security for multisig operations</p>
                    </div>
                </div>
            </motion.div>

            {/* Status */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className={`glass-card p-5 mb-6 ${settings.enabled ? 'border-green-400/20' : 'border-yellow-400/20'}`}>
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                        {settings.enabled ? <CheckCircle2 className="w-6 h-6 text-green-400" /> : <AlertTriangle className="w-6 h-6 text-yellow-400" />}
                        <div>
                            <h3 className="text-sm font-bold text-white">{settings.enabled ? '2FA Active' : '2FA Not Enabled'}</h3>
                            <p className="text-xs text-slate-500">{settings.enabled ? `Method: ${methods.find(m => m.id === settings.method)?.name}` : 'Enable 2FA for better security'}</p>
                        </div>
                    </div>
                    {settings.enabled && (
                        <button onClick={() => setDisableModal(true)} className="px-4 py-2 text-xs bg-red-400/10 text-red-400 rounded-xl border border-red-400/20 hover:bg-red-400/20 transition-all">Disable</button>
                    )}
                </div>
                {settings.lastVerified && (
                    <div className="mt-3 pt-3 border-t border-surface-border flex items-center gap-2 text-[10px] text-slate-500">
                        <Clock className="w-3 h-3" />Last verified: {new Date(settings.lastVerified).toLocaleString()}
                    </div>
                )}
            </motion.div>

            {/* Method Selection */}
            {!settings.enabled && step === 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    <h3 className="text-sm font-semibold text-white mb-4">Choose a Method</h3>
                    <div className="space-y-3">
                        {methods.map(m => (
                            <button key={m.id} onClick={() => { setSettings(p => ({ ...p, method: m.id })); setStep(1); }}
                                className="w-full glass-card p-5 flex items-center gap-4 hover:border-primary/20 transition-all text-left group">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                                    <m.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-sm font-bold text-white">{m.name}</h4>
                                        {m.rec && <span className="px-2 py-0.5 bg-green-400/10 text-green-400 rounded-full text-[10px] font-semibold">Recommended</span>}
                                    </div>
                                    <p className="text-xs text-slate-500">{m.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* TOTP Setup */}
            {step === 1 && settings.method === 'totp' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Setup Authenticator</h3>
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-48 h-48 bg-white rounded-2xl p-3 mb-4">
                            <svg viewBox="0 0 15 15" className="w-full h-full">
                                {QR_DOTS.map(([x, y], i) => <rect key={i} x={x} y={y} width="0.9" height="0.9" fill="#000" rx="0.1" />)}
                            </svg>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-bg rounded-xl border border-surface-border">
                            <span className="text-xs font-mono text-slate-300">{showSecret ? FAKE_SECRET : '•'.repeat(16)}</span>
                            <button onClick={() => setShowSecret(!showSecret)} className="text-slate-500 hover:text-white"><Eye className="w-4 h-4" /></button>
                            <button onClick={() => { navigator.clipboard.writeText(FAKE_SECRET); toast.success('Copied'); }} className="text-slate-500 hover:text-primary"><Copy className="w-4 h-4" /></button>
                        </div>
                    </div>
                    <label className="text-xs text-slate-400 block mb-2">Enter 6-digit code</label>
                    <input value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" maxLength={6}
                        className="w-full p-4 bg-bg rounded-xl border border-surface-border text-white text-center text-2xl font-mono tracking-[0.5em] placeholder-slate-700 focus:outline-none focus:border-primary/30 mb-4" />
                    <div className="flex gap-3">
                        <button onClick={() => { setStep(0); setCode(''); }} className="flex-1 py-3 bg-bg border border-surface-border text-slate-300 rounded-xl text-sm">Back</button>
                        <button onClick={handleVerify} disabled={code.length !== 6 || verifying}
                            className="flex-1 py-3 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl disabled:opacity-50 text-sm flex items-center justify-center gap-2">
                            {verifying ? <><RefreshCw className="w-4 h-4 animate-spin" />Verifying...</> : 'Verify & Enable'}
                        </button>
                    </div>
                </motion.div>
            )}

            {/* SMS / Biometric fallback */}
            {step === 1 && settings.method !== 'totp' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 text-center">
                    {settings.method === 'biometric' ? <Fingerprint className="w-16 h-16 text-purple-400 mx-auto mb-4" /> : <Key className="w-16 h-16 text-green-400 mx-auto mb-4" />}
                    <h3 className="text-lg font-bold text-white mb-2">{methods.find(m => m.id === settings.method)?.name}</h3>
                    <p className="text-xs text-slate-400 mb-6">{methods.find(m => m.id === settings.method)?.desc}</p>
                    <input value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" maxLength={6}
                        className="w-full max-w-xs mx-auto p-3 bg-bg rounded-xl border border-surface-border text-white text-center font-mono tracking-wider placeholder-slate-600 focus:outline-none focus:border-primary/30 mb-4 block" />
                    <div className="flex gap-3 max-w-xs mx-auto">
                        <button onClick={() => { setStep(0); setCode(''); }} className="flex-1 py-3 bg-bg border border-surface-border text-slate-300 rounded-xl text-sm">Back</button>
                        <button onClick={handleVerify} disabled={code.length !== 6 || verifying}
                            className="flex-1 py-3 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl disabled:opacity-50 text-sm">
                            {verifying ? 'Verifying...' : 'Enable'}
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Action Policies */}
            {settings.enabled && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5 mt-6">
                    <h3 className="text-sm font-semibold text-white mb-1">Require 2FA For</h3>
                    <p className="text-xs text-slate-500 mb-4">Choose which actions require verification</p>
                    <div className="space-y-2">
                        {Object.entries(actionLabels).map(([a, label]) => (
                            <button key={a} onClick={() => toggleAction(a)} className="w-full flex items-center justify-between p-3 bg-bg rounded-xl border border-surface-border hover:border-primary/20 transition-all">
                                <span className="text-xs text-slate-300">{label}</span>
                                <div className={`w-10 h-5 rounded-full transition-colors ${settings.requireForActions.includes(a) ? 'bg-primary' : 'bg-slate-600'}`}>
                                    <div className={`w-4 h-4 mt-0.5 rounded-full bg-white transition-transform ${settings.requireForActions.includes(a) ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Disable modal */}
            <AnimatePresence>
                {disableModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDisableModal(false)}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                            className="glass-card p-6 w-full max-w-sm text-center" onClick={e => e.stopPropagation()}>
                            <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-white mb-2">Disable 2FA?</h3>
                            <p className="text-xs text-slate-400 mb-6">This removes the extra security layer.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setDisableModal(false)} className="flex-1 py-2.5 bg-bg border border-surface-border text-slate-300 rounded-xl text-sm">Cancel</button>
                                <button onClick={handleDisable} className="flex-1 py-2.5 bg-red-400/10 text-red-400 border border-red-400/20 rounded-xl text-sm hover:bg-red-400/20">Disable</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
