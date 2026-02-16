import { useNavigate } from 'react-router-dom';
import { getIsLoggedIn } from '@multiversx/sdk-dapp/out/methods/account/getIsLoggedIn';
import { UnlockPanelManager } from '@multiversx/sdk-dapp/out/managers/UnlockPanelManager';
import { Shield, Lock, Users, Zap } from 'lucide-react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CircuitBackground } from '../components/CircuitBackground';
import { R2Droid } from '../components/R2Droid';

const features = [
    {
        icon: Lock,
        title: 'Multi-Signature Security',
        description: 'Requires multiple approvals before executing any transaction',
    },
    {
        icon: Users,
        title: 'Team Management',
        description: 'Add members, proposers and manage quorum settings',
    },
    {
        icon: Zap,
        title: 'Supernova Ready',
        description: 'Built for sub-second finality on MultiversX',
    },
];

export const UnlockPage = () => {
    const isLoggedIn = getIsLoggedIn();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    const handleConnect = () => {
        const unlockPanelManager = UnlockPanelManager.init({
            loginHandler: () => {
                navigate('/');
            },
            onClose: async () => {
                // user closed the panel
            },
        });
        unlockPanelManager.openUnlockPanel();
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
            {/* Circuit Background */}
            <CircuitBackground />



            <div className="relative z-10 w-full max-w-lg">
                {/* Hero with R2 Droid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10"
                >
                    {/* Robot mascot — rolls side-to-side via CSS */}
                    <div className="flex justify-center mb-6">
                        <R2Droid size={80} />
                    </div>

                    <div className="relative inline-block">
                        <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight relative z-10">
                            <span className="gold-text">Multi</span><span className="gradient-text">SingX</span>
                        </h1>
                        {/* Electric discharge arcs */}
                        {[
                            { d: 'M0,0 L3,-8 L-1,-6 L2,-14', top: '10%', left: '8%', rotate: -15 },
                            { d: 'M0,0 L-4,-7 L0,-5 L-3,-13', top: '5%', left: '85%', rotate: 20 },
                            { d: 'M0,0 L2,-6 L-2,-4 L1,-11', top: '60%', left: '3%', rotate: -30 },
                            { d: 'M0,0 L-3,-7 L1,-5 L-2,-12', top: '55%', left: '92%', rotate: 25 },
                        ].map((arc, i) => (
                            <motion.svg
                                key={i}
                                className="absolute"
                                width="20"
                                height="20"
                                viewBox="-6 -16 12 18"
                                style={{
                                    top: arc.top,
                                    left: arc.left,
                                    transform: `rotate(${arc.rotate}deg)`,
                                    filter: 'drop-shadow(0 0 4px rgba(45, 212, 191, 0.6))',
                                }}
                                animate={{
                                    opacity: [0, 0, 0.9, 0.7, 0.9, 0, 0],
                                }}
                                transition={{
                                    duration: 3 + i * 0.5,
                                    repeat: Infinity,
                                    delay: i * 1.2,
                                    ease: 'easeInOut',
                                }}
                            >
                                <path
                                    d={arc.d}
                                    fill="none"
                                    stroke="#2dd4bf"
                                    strokeWidth="1.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </motion.svg>
                        ))}
                        {/* Electricity arc glow */}
                        <motion.div
                            className="absolute -inset-4 rounded-2xl z-0"
                            animate={{
                                boxShadow: [
                                    '0 0 15px rgba(45, 212, 191, 0.0), 0 0 30px rgba(192, 160, 98, 0.0)',
                                    '0 0 25px rgba(45, 212, 191, 0.15), 0 0 50px rgba(192, 160, 98, 0.08)',
                                    '0 0 15px rgba(45, 212, 191, 0.0), 0 0 30px rgba(192, 160, 98, 0.0)',
                                ],
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    </div>
                    <p className="text-lg text-slate-400 max-w-md mx-auto leading-relaxed">
                        Secure multi-signature vault for the MultiversX blockchain
                    </p>
                </motion.div>

                {/* Connect Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="glass-card p-6 sm:p-8 mb-8"
                >
                    <h2 className="text-lg font-semibold text-white mb-1">Connect Wallet</h2>
                    <p className="text-sm text-slate-500 mb-6">Choose your preferred wallet to get started</p>

                    <button
                        onClick={handleConnect}
                        className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-3"
                    >
                        <Shield className="w-5 h-5" />
                        Connect Wallet
                    </button>

                    <p className="text-xs text-slate-600 text-center mt-4">
                        Compatible with xPortal, DeFi Wallet, Web Wallet, Ledger and more
                    </p>
                </motion.div>

                {/* Features */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="grid grid-cols-3 gap-4"
                >
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className="text-center p-4 rounded-xl bg-surface/30 border border-surface-border/50 hover:border-primary/20 transition-all duration-300"
                        >
                            <feature.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                            <h3 className="text-xs font-semibold text-white mb-1">{feature.title}</h3>
                            <p className="text-[10px] text-slate-500 leading-snug">{feature.description}</p>
                        </div>
                    ))}
                </motion.div>

            </div>
        </div>
    );
};
