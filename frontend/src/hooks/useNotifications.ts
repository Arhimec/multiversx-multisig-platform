import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { NETWORK_CONFIG } from '../config/network';

const POLL_INTERVAL = 15000; // 15 seconds
const STORAGE_KEY = 'mvx-multisig-last-action-count';

interface NotificationState {
    pendingCount: number;
    hasNew: boolean;
}

const getStoredCount = (): number => {
    try {
        return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
    } catch {
        return 0;
    }
};

export const useNotifications = () => {
    const [state, setState] = useState<NotificationState>({ pendingCount: 0, hasNew: false });
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const checkForNewActions = useCallback(async () => {
        try {
            const addresses = JSON.parse(localStorage.getItem('mvx-multisig-addresses') || '[]');
            const defaultAddr = NETWORK_CONFIG.multisigContractAddress;
            const allAddresses = defaultAddr ? [defaultAddr, ...addresses.filter((a: string) => a !== defaultAddr)] : addresses;

            let totalPending = 0;

            for (const addr of allAddresses) {
                try {
                    const res = await fetch(`${NETWORK_CONFIG.apiUrl}/accounts/${addr}/transactions?size=5&status=success`);
                    if (res.ok) {
                        const txs = await res.json();
                        const pending = txs.filter((tx: any) => {
                            const fn = tx.function || '';
                            return ['proposeAddBoardMember', 'proposeAddProposer', 'proposeSendEgld', 'proposeChangeQuorum', 'proposeSCDeploy'].includes(fn);
                        });
                        totalPending += pending.length;
                    }
                } catch {
                    // skip
                }
            }

            const lastCount = getStoredCount();
            if (totalPending > lastCount && lastCount > 0) {
                setState({ pendingCount: totalPending, hasNew: true });
                toast('🔔 New proposal detected!', {
                    style: {
                        background: '#12121a',
                        color: '#22d3ee',
                        border: '1px solid rgba(34, 211, 238, 0.2)',
                    },
                });
            } else {
                setState({ pendingCount: totalPending, hasNew: totalPending > lastCount });
            }

            localStorage.setItem(STORAGE_KEY, String(totalPending));
        } catch {
            // silent fail
        }
    }, []);

    useEffect(() => {
        checkForNewActions();
        intervalRef.current = setInterval(checkForNewActions, POLL_INTERVAL);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [checkForNewActions]);

    const clearNew = useCallback(() => {
        setState(prev => ({ ...prev, hasNew: false }));
    }, []);

    return { ...state, clearNew, refresh: checkForNewActions };
};
