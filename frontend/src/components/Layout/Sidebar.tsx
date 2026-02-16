import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Plus, Clock, BookUser, Shield, Bell, BarChart3, Coins, Settings, Globe, Vote, Puzzle, ShieldCheck, HeartHandshake, Image } from 'lucide-react';
import { getSelectedNetwork } from '../../config/network';
import { useNotifications } from '../../hooks/useNotifications';

const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/create', icon: Plus, label: 'Create Multisig' },
    { to: '/history', icon: Clock, label: 'History' },
    { to: '/address-book', icon: BookUser, label: 'Address Book' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics', section: 'Insights' },
    { to: '/staking', icon: Coins, label: 'Staking' },
    { to: '/multi-chain', icon: Globe, label: 'Multi-Chain', section: 'Vision' },
    { to: '/governance', icon: Vote, label: 'Governance' },
    { to: '/nft-treasury', icon: Image, label: 'NFT Treasury' },
    { to: '/plugins', icon: Puzzle, label: 'Plugins' },
    { to: '/two-fa', icon: ShieldCheck, label: '2FA' },
    { to: '/social-recovery', icon: HeartHandshake, label: 'Recovery' },
    { to: '/settings', icon: Settings, label: 'Settings', section: 'System' },
];

const networkColors: Record<string, string> = {
    mainnet: 'text-green-400',
    testnet: 'text-yellow-400',
    devnet: 'text-blue-400',
};

export const Sidebar = () => {
    const network = getSelectedNetwork();
    const { pendingCount, hasNew, clearNew } = useNotifications();

    return (
        <aside className="hidden lg:flex flex-col fixed left-0 top-16 bottom-0 w-64 bg-surface/50 backdrop-blur-xl border-r border-surface-border z-40">
            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                <p className="px-4 mb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Navigation
                </p>
                {navItems.map((item) => (
                    <div key={item.to}>
                        {(item as any).section && (
                            <p className="px-4 mt-5 mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                {(item as any).section}
                            </p>
                        )}
                        <NavLink
                            to={item.to}
                            end={item.end}
                            onClick={item.to === '/' ? clearNew : undefined}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                                    ? 'bg-primary/10 text-primary border border-primary/20'
                                    : 'text-slate-400 hover:text-white hover:bg-surface-hover'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                            {item.label}
                            {item.to === '/' && hasNew && pendingCount > 0 && (
                                <span className="ml-auto px-2 py-0.5 text-[10px] font-bold bg-primary/20 text-primary rounded-full animate-pulse-soft">
                                    {pendingCount}
                                </span>
                            )}
                        </NavLink>
                    </div>
                ))}
            </nav>

            {/* Bottom info */}
            <div className="p-4 m-3 mb-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className={`text-xs font-semibold capitalize ${networkColors[network] || 'text-primary'}`}>
                        {network}
                    </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                    {network === 'mainnet'
                        ? 'You are on MultiversX mainnet. Real funds!'
                        : `You are on the MultiversX ${network}. Funds are not real.`}
                </p>
            </div>
        </aside>
    );
};
