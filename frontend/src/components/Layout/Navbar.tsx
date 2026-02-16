import { getAccount } from '@multiversx/sdk-dapp/out/methods/account/getAccount';
import { getIsLoggedIn } from '@multiversx/sdk-dapp/out/methods/account/getIsLoggedIn';
import { ProviderFactory } from '@multiversx/sdk-dapp/out/providers/ProviderFactory';
import { LogOut, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NetworkSelector } from '../NetworkSelector';

export const Navbar = () => {
    const isLoggedIn = getIsLoggedIn();
    const account = getAccount();
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();

    const truncateAddress = (addr: string) => {
        if (!addr) return '';
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    const handleCopy = () => {
        if (account?.address) {
            navigator.clipboard.writeText(account.address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleLogout = () => {
        // Clear all auth state
        sessionStorage.clear();
        localStorage.removeItem('loginInfo');
        localStorage.removeItem('persist:sdk-dapp-store');
        // Force full page reload to reset all React state
        window.location.href = '/unlock';
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-surface/80 backdrop-blur-xl border-b border-surface-border">
            <div className="h-full px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-9 h-9 flex items-center justify-center" style={{ animation: 'navDroidRock 3s ease-in-out infinite' }}>
                        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                            {/* Dome */}
                            <path d="M10,14 Q10,6 16,6 Q22,6 22,14 Z" fill="#163040" stroke="#2dd4bf" strokeWidth="0.6" strokeOpacity="0.5" />
                            {/* Eye */}
                            <circle cx="16" cy="10" r="2.5" fill="#0d1a24" stroke="#2dd4bf" strokeWidth="0.6" />
                            <circle cx="16" cy="10" r="1" fill="#2dd4bf" className="animate-pulse" />
                            {/* Body */}
                            <rect x="10" y="14" width="12" height="10" rx="2" fill="#0d1a24" stroke="#2dd4bf" strokeWidth="0.5" strokeOpacity="0.4" />
                            {/* Circuit lines */}
                            <line x1="13" y1="17" x2="19" y2="17" stroke="#2dd4bf" strokeWidth="0.4" strokeOpacity="0.3" />
                            <line x1="13" y1="20" x2="19" y2="20" stroke="#2dd4bf" strokeWidth="0.4" strokeOpacity="0.3" />
                            {/* Treads */}
                            <rect x="8" y="24" width="6" height="3" rx="1.5" fill="#1a3040" stroke="#2dd4bf" strokeWidth="0.4" strokeOpacity="0.4" />
                            <rect x="18" y="24" width="6" height="3" rx="1.5" fill="#1a3040" stroke="#2dd4bf" strokeWidth="0.4" strokeOpacity="0.4" />
                            {/* Antenna */}
                            <line x1="16" y1="6" x2="16" y2="3" stroke="#2dd4bf" strokeWidth="0.5" strokeOpacity="0.5" />
                            <circle cx="16" cy="2.5" r="1" fill="#2dd4bf" opacity="0.6" />
                        </svg>
                    </div>
                    <div className="hidden sm:block">
                        <span className="text-lg font-bold tracking-tight"><span className="gold-text">Multi</span><span className="gradient-text">SingX</span></span>
                        <span className="text-lg font-light text-primary-light ml-1">Vault</span>
                    </div>
                </Link>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    <NetworkSelector />

                    {isLoggedIn && account?.address && (
                        <>
                            {/* Address */}
                            <button
                                onClick={handleCopy}
                                aria-label="Copy wallet address to clipboard"
                                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-bg rounded-xl border border-surface-border hover:border-primary/30 transition-all group"
                            >
                                <div className="w-2 h-2 rounded-full bg-success animate-pulse-soft" />
                                <span className="text-sm font-mono text-slate-300 group-hover:text-white transition-colors">
                                    {truncateAddress(account.address)}
                                </span>
                                {copied ? (
                                    <Check className="w-3.5 h-3.5 text-success" />
                                ) : (
                                    <Copy className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
                                )}
                            </button>

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                aria-label="Disconnect wallet"
                                className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-danger rounded-xl hover:bg-danger/10 transition-all"
                                title="Disconnect"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
