import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';

interface ComingSoonBannerProps {
    feature: string;
}

export const ComingSoonBanner = ({ feature }: ComingSoonBannerProps) => (
    <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex items-center gap-3"
    >
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
            <Construction className="w-5 h-5 text-amber-400" />
        </div>
        <div>
            <p className="text-sm font-semibold text-amber-300">Coming Soon</p>
            <p className="text-xs text-slate-400">
                {feature} is under active development and will be available in a future release.
            </p>
        </div>
    </motion.div>
);
