import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings,
    Shield,
    Bell,
    Globe,
    Download,
    Trash2,
    RefreshCw,
    AlertTriangle,
    CheckCircle2,
    Moon,
    Info,
    ExternalLink,
    X,
    HardDrive,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getSelectedNetwork, setSelectedNetwork, getAllNetworks, type NetworkName } from '../config/network';

export const SettingsPage = () => {
    const currentNetwork = getSelectedNetwork();
    const networks = getAllNetworks();
    const [notificationsEnabled, setNotificationsEnabled] = useState(
        localStorage.getItem('mvx-notifications-enabled') !== 'false'
    );
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    const handleNetworkChange = (network: NetworkName) => {
        if (network !== currentNetwork) {
            setSelectedNetwork(network); // triggers reload
        }
    };

    const handleClearData = () => {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('mvx-multisig')) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
        toast.success('All local data cleared');
        setShowClearConfirm(false);
        window.location.reload();
    };

    const handleExportData = () => {
        const data: Record<string, any> = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('mvx-multisig')) {
                data[key] = localStorage.getItem(key);
            }
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mvx-multisig-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Data exported!');
    };

    const handleImportData = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e: any) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const data = JSON.parse(ev.target?.result as string);
                    Object.entries(data).forEach(([key, value]) => {
                        localStorage.setItem(key, value as string);
                    });
                    toast.success('Data imported! Refreshing...');
                    setTimeout(() => window.location.reload(), 1000);
                } catch {
                    toast.error('Invalid backup file');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    const toggleNotifications = () => {
        const newVal = !notificationsEnabled;
        setNotificationsEnabled(newVal);
        localStorage.setItem('mvx-notifications-enabled', String(newVal));
        toast.success(`Notifications ${newVal ? 'enabled' : 'disabled'}`);
    };

    const explorerBaseUrl = getAllNetworks().find(n => n.name === currentNetwork)?.name === 'mainnet'
        ? 'https://explorer.multiversx.com'
        : `https://${currentNetwork}-explorer.multiversx.com`;

    return (
        <div className="p-6 lg:p-8 max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-slate-400">Configure your multisig platform preferences</p>
            </motion.div>

            <div className="space-y-4">
                {/* Network */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-5"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Globe className="w-5 h-5 text-primary" />
                        <h3 className="text-sm font-semibold text-white">Network</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {networks.map(net => (
                            <button
                                key={net.name}
                                onClick={() => handleNetworkChange(net.name)}
                                className={`p-3 rounded-xl text-sm font-medium transition-all ${net.name === currentNetwork
                                    ? 'bg-primary/10 text-primary border border-primary/20'
                                    : 'bg-bg border border-surface-border text-slate-400 hover:text-white hover:border-primary/20'
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${net.name === 'mainnet' ? 'bg-green-400' :
                                        net.name === 'testnet' ? 'bg-yellow-400' : 'bg-blue-400'
                                        }`} />
                                    {net.displayName}
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Notifications */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="glass-card p-5"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Bell className="w-5 h-5 text-primary" />
                            <div>
                                <h3 className="text-sm font-semibold text-white">Notifications</h3>
                                <p className="text-xs text-slate-500">Receive alerts for new proposals</p>
                            </div>
                        </div>
                        <button
                            onClick={toggleNotifications}
                            aria-label={notificationsEnabled ? 'Disable notifications' : 'Enable notifications'}
                            className={`relative w-12 h-6 rounded-full transition-colors ${notificationsEnabled ? 'bg-primary' : 'bg-slate-600'
                                }`}
                        >
                            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${notificationsEnabled ? 'left-[26px]' : 'left-0.5'
                                }`} />
                        </button>
                    </div>
                </motion.div>

                {/* Data Management */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-5"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <HardDrive className="w-5 h-5 text-primary" />
                        <h3 className="text-sm font-semibold text-white">Data Management</h3>
                    </div>
                    <p className="text-xs text-slate-500 mb-4 ml-8">
                        Your data is stored locally in your browser. Export regularly to prevent data loss.
                    </p>
                    <div className="space-y-2">
                        <button
                            onClick={handleExportData}
                            className="w-full flex items-center gap-3 p-3 bg-bg rounded-xl border border-surface-border text-sm text-slate-300 hover:text-white hover:border-primary/20 transition-all group"
                        >
                            <Download className="w-4 h-4 text-primary" />
                            <div className="text-left">
                                <span className="block">Export Backup (JSON)</span>
                                <span className="block text-[10px] text-slate-600 group-hover:text-slate-500 transition-colors">
                                    Download your contacts, addresses, and settings
                                </span>
                            </div>
                        </button>
                        <button
                            onClick={handleImportData}
                            className="w-full flex items-center gap-3 p-3 bg-bg rounded-xl border border-surface-border text-sm text-slate-300 hover:text-white hover:border-primary/20 transition-all group"
                        >
                            <RefreshCw className="w-4 h-4 text-accent" />
                            <div className="text-left">
                                <span className="block">Import Backup</span>
                                <span className="block text-[10px] text-slate-600 group-hover:text-slate-500 transition-colors">
                                    Restore data from a previously exported JSON file
                                </span>
                            </div>
                        </button>
                        <button
                            onClick={() => setShowClearConfirm(true)}
                            className="w-full flex items-center gap-3 p-3 bg-bg rounded-xl border border-red-500/20 text-sm text-red-400 hover:bg-red-500/5 transition-all group"
                        >
                            <Trash2 className="w-4 h-4" />
                            <div className="text-left">
                                <span className="block">Clear All Local Data</span>
                                <span className="block text-[10px] text-red-400/50 group-hover:text-red-400/70 transition-colors">
                                    Permanently remove all saved multisig data from this browser
                                </span>
                            </div>
                        </button>
                    </div>
                </motion.div>

                {/* About */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="glass-card p-5"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <Info className="w-5 h-5 text-primary" />
                        <h3 className="text-sm font-semibold text-white">About</h3>
                    </div>
                    <div className="text-xs text-slate-500 space-y-1.5">
                        <p className="flex items-center gap-2">
                            <span className="text-slate-400 font-medium">MultiSingX Platform</span>
                            <span className="px-1.5 py-0.5 text-[10px] bg-primary/10 text-primary rounded-md border border-primary/20">
                                v1.0.0
                            </span>
                        </p>
                        <p>Built on MultiversX blockchain</p>
                        <p>
                            Network: {currentNetwork} · Chain ID: {getAllNetworks().find(n => n.name === currentNetwork)?.chainId}
                        </p>
                        <a
                            href={explorerBaseUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-primary/70 hover:text-primary transition-colors mt-1"
                        >
                            <ExternalLink className="w-3 h-3" />
                            View on MultiversX Explorer
                        </a>
                        <p className="pt-2 border-t border-surface-border text-slate-600">
                            © {new Date().getFullYear()} MultiSingX. All Rights Reserved.
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Clear Data Confirmation Modal */}
            <AnimatePresence>
                {showClearConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowClearConfirm(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="glass-card p-6 w-full max-w-sm"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-white">Clear All Data?</h3>
                                    <p className="text-xs text-slate-500">This action cannot be undone</p>
                                </div>
                            </div>

                            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                                This will permanently remove all saved multisig addresses, contacts, proposal descriptions,
                                and local settings from this browser.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowClearConfirm(false)}
                                    className="flex-1 px-4 py-2.5 text-sm text-slate-400 bg-surface-hover rounded-xl hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleClearData}
                                    className="flex-1 px-4 py-2.5 text-sm bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Clear Data
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
