import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccount } from '@multiversx/sdk-dapp/out/methods/account/getAccount';
import { Shield, Plus, Trash2, AlertTriangle, CheckCircle2, Users, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export const CreatePage = () => {
    const account = getAccount();
    const navigate = useNavigate();
    const [quorum, setQuorum] = useState(1);
    const [boardMembers, setBoardMembers] = useState<string[]>([account?.address || '']);
    const [isDeploying, setIsDeploying] = useState(false);

    const addBoardMember = () => {
        setBoardMembers([...boardMembers, '']);
    };

    const removeBoardMember = (index: number) => {
        if (boardMembers.length <= 1) return;
        const newMembers = boardMembers.filter((_, i) => i !== index);
        setBoardMembers(newMembers);
        if (quorum > newMembers.length) {
            setQuorum(newMembers.length);
        }
    };

    const updateBoardMember = (index: number, value: string) => {
        const newMembers = [...boardMembers];
        newMembers[index] = value;
        setBoardMembers(newMembers);
    };

    const validMembers = boardMembers.filter((m) => m.startsWith('erd1') && m.length === 62);
    const isValid = validMembers.length >= 1 && quorum >= 1 && quorum <= validMembers.length;

    const handleDeploy = async () => {
        if (!isValid) return;

        setIsDeploying(true);
        try {
            toast.success('Multisig deployment will be available after contract is deployed to devnet.');
        } catch (error) {
            toast.error('Deployment failed. Please try again.');
        } finally {
            setIsDeploying(false);
        }
    };

    return (
        <div className="page-container max-w-3xl">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="section-title mb-1">Create Multisig Wallet</h1>
                <p className="text-slate-500">Set up a new multi-signature wallet with custom signers and quorum</p>
            </motion.div>

            {/* Info Banner */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-start gap-3 p-4 mb-6 rounded-xl bg-primary/5 border border-primary/10"
            >
                <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                    <p className="text-sm text-primary font-medium mb-1">How it works</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        A multisig wallet requires M-of-N signatures to execute transactions. Board members can
                        propose and sign actions, while proposers can only create proposals.
                    </p>
                </div>
            </motion.div>

            {/* Board Members */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6 mb-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-semibold text-white">Board Members</h2>
                    </div>
                    <span className="text-sm text-slate-500">
                        {validMembers.length} valid member{validMembers.length !== 1 ? 's' : ''}
                    </span>
                </div>

                <div className="space-y-3">
                    <AnimatePresence>
                        {boardMembers.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-center gap-3"
                            >
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={member}
                                        onChange={(e) => updateBoardMember(index, e.target.value)}
                                        placeholder="erd1..."
                                        className="input-field font-mono text-sm pr-10"
                                    />
                                    {member.startsWith('erd1') && member.length === 62 && (
                                        <CheckCircle2 className="w-4 h-4 text-success absolute right-3 top-1/2 -translate-y-1/2" />
                                    )}
                                </div>
                                <button
                                    onClick={() => removeBoardMember(index)}
                                    disabled={boardMembers.length <= 1}
                                    className="p-3 rounded-xl text-slate-500 hover:text-danger hover:bg-danger/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <button
                    onClick={addBoardMember}
                    className="mt-4 w-full py-3 border-2 border-dashed border-surface-border hover:border-primary/30 rounded-xl text-sm text-slate-500 hover:text-primary flex items-center justify-center gap-2 transition-all"
                >
                    <Plus className="w-4 h-4" />
                    Add Board Member
                </button>
            </motion.div>

            {/* Quorum */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6 mb-6"
            >
                <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-5 h-5 text-accent" />
                    <h2 className="text-lg font-semibold text-white">Quorum</h2>
                </div>

                <p className="text-sm text-slate-400 mb-4">
                    Minimum number of signatures required to execute an action
                </p>

                <div className="flex items-center gap-4">
                    <input
                        type="range"
                        min={1}
                        max={Math.max(validMembers.length, 1)}
                        value={quorum}
                        onChange={(e) => setQuorum(Number(e.target.value))}
                        className="flex-1 h-2 bg-surface-hover rounded-full appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                       [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary 
                       [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary/30
                       [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                    <div className="flex items-center gap-2 px-4 py-2 bg-bg rounded-xl border border-surface-border min-w-[100px] justify-center">
                        <span className="text-xl font-bold text-primary">{quorum}</span>
                        <span className="text-sm text-slate-500">of {Math.max(validMembers.length, 1)}</span>
                    </div>
                </div>

                {quorum > validMembers.length && validMembers.length > 0 && (
                    <div className="flex items-center gap-2 mt-3 text-xs text-warning">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Quorum cannot exceed the number of valid board members
                    </div>
                )}
            </motion.div>

            {/* Deploy Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <button
                    onClick={handleDeploy}
                    disabled={!isValid || isDeploying}
                    className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    {isDeploying ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            Deploying...
                        </>
                    ) : (
                        <>
                            <Shield className="w-5 h-5" />
                            Deploy Multisig Wallet
                        </>
                    )}
                </button>
            </motion.div>
        </div>
    );
};
