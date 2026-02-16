import { Shield, ExternalLink } from 'lucide-react';
import { getSelectedNetwork, getAllNetworks } from '../../config/network';

const networkColors: Record<string, string> = {
    mainnet: 'text-green-400',
    testnet: 'text-yellow-400',
    devnet: 'text-blue-400',
};

export const Footer = () => {
    const network = getSelectedNetwork();
    const networkConfig = getAllNetworks().find(n => n.name === network);

    return (
        <footer className="mt-auto border-t border-surface-border/50 bg-surface/30 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 text-primary/50" />
                        <span className="text-slate-500">MultiSingX Platform v1.0.0</span>
                        <span className="text-slate-700">·</span>
                        <span>Built on MultiversX</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className={`flex items-center gap-1.5 ${networkColors[network] || 'text-primary'}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            <span className="capitalize">{network}</span>
                            {networkConfig && <span className="text-slate-700">· Chain {networkConfig.chainId}</span>}
                        </span>
                        <span className="text-slate-700">·</span>
                        <span>© {new Date().getFullYear()} MultiSingX</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
