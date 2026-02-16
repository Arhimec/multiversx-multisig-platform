import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { CircuitBackground } from '../CircuitBackground';
import { Menu, X, LayoutDashboard, Plus, Clock, BookUser, BarChart3, Coins, Settings, Globe, Vote, Puzzle, ShieldCheck, HeartHandshake } from 'lucide-react';

const mobileNavItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/create', icon: Plus, label: 'Create Multisig' },
    { to: '/history', icon: Clock, label: 'History' },
    { to: '/address-book', icon: BookUser, label: 'Address Book' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/staking', icon: Coins, label: 'Staking' },
    { to: '/multi-chain', icon: Globe, label: 'Multi-Chain' },
    { to: '/governance', icon: Vote, label: 'Governance' },
    { to: '/plugins', icon: Puzzle, label: 'Plugins' },
    { to: '/two-fa', icon: ShieldCheck, label: '2FA' },
    { to: '/social-recovery', icon: HeartHandshake, label: 'Recovery' },
    { to: '/settings', icon: Settings, label: 'Settings' },
];

export const Layout = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col relative">
            {/* Animated circuit vein background */}
            <CircuitBackground />

            <Navbar />

            {/* Mobile hamburger button */}
            <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-surface/80 backdrop-blur-xl rounded-xl border border-surface-border text-slate-300 hover:text-white transition-colors"
            >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Mobile menu overlay */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <nav className="absolute left-0 top-16 bottom-0 w-72 bg-surface border-r border-surface-border p-4 space-y-1 overflow-y-auto">
                        <p className="px-4 mb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Navigation
                        </p>
                        {mobileNavItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                        ? 'bg-primary/10 text-primary border border-primary/20'
                                        : 'text-slate-400 hover:text-white hover:bg-surface-hover'
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            )}

            <div className="flex flex-1 relative z-10">
                <Sidebar />
                <div className="flex-1 ml-0 lg:ml-64 mt-16 flex flex-col min-h-[calc(100vh-4rem)]">
                    <main className="flex-1">
                        <Outlet />
                    </main>
                    <Footer />
                </div>
            </div>
        </div>
    );
};
