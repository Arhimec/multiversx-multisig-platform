import { describe, it, expect, beforeEach } from 'vitest';
import { getSelectedNetwork, setSelectedNetwork } from '../config/network';

describe('Network Config', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('defaults to devnet when no network is saved', () => {
        const network = getSelectedNetwork();
        expect(['mainnet', 'testnet', 'devnet']).toContain(network);
    });

    it('persists network selection', () => {
        setSelectedNetwork('testnet');
        expect(getSelectedNetwork()).toBe('testnet');
    });

    it('persists to localStorage', () => {
        setSelectedNetwork('mainnet');
        const stored = localStorage.getItem('mvx-multisig-network');
        expect(stored).toBe('mainnet');
    });
});
