import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe, Wifi, WifiOff } from 'lucide-react';
import {
    getSelectedNetwork,
    setSelectedNetwork,
    getAllNetworks,
    type NetworkName,
} from '../config/network';

const networkColors: Record<NetworkName, string> = {
    mainnet: '#22c55e',  // green
    testnet: '#eab308',  // yellow
    devnet: '#3b82f6',   // blue
};

const networkIcons: Record<NetworkName, typeof Globe> = {
    mainnet: Globe,
    testnet: Wifi,
    devnet: WifiOff,
};

export const NetworkSelector = () => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const current = getSelectedNetwork();
    const networks = getAllNetworks();
    const color = networkColors[current];

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-surface-border hover:border-primary/30 bg-bg transition-all text-sm"
            >
                <div
                    className="w-2 h-2 rounded-full animate-pulse-soft"
                    style={{ backgroundColor: color }}
                />
                <span className="text-slate-300 font-medium capitalize hidden sm:inline">
                    {current}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-surface-border rounded-xl shadow-2xl shadow-black/40 py-1 z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <p className="px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                        Select Network
                    </p>
                    {networks.map((net) => {
                        const Icon = networkIcons[net.name];
                        const isActive = net.name === current;
                        return (
                            <button
                                key={net.name}
                                onClick={() => {
                                    if (!isActive) setSelectedNetwork(net.name);
                                    setOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-slate-300 hover:bg-surface-hover hover:text-white'
                                    }`}
                            >
                                <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: networkColors[net.name] }}
                                />
                                <Icon className="w-4 h-4" />
                                <span className="font-medium">{net.displayName}</span>
                                {isActive && (
                                    <span className="ml-auto text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                                        Active
                                    </span>
                                )}
                            </button>
                        );
                    })}
                    <div className="border-t border-surface-border mt-1 pt-2 px-4 pb-2">
                        <p className="text-[10px] text-slate-600 leading-relaxed">
                            {current === 'mainnet'
                                ? '⚠️ Real funds — be careful!'
                                : 'Test network — funds are not real.'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
