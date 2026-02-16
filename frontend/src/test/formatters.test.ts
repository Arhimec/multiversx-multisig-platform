import { describe, it, expect } from 'vitest';
import {
    truncateAddress,
    formatBalance,
    formatGas,
    formatActionType,
    isValidAddress,
    formatTimeAgo,
    toAtomicAmount,
    fromAtomicAmount,
} from '../utils/formatters';

describe('truncateAddress', () => {
    it('truncates a valid erd1 address', () => {
        const addr = 'erd1qyu5wthldzr8wx5c9ucg8kjagg0jfs53s8nr3zpz3hypefsdd8ssycr6th';
        expect(truncateAddress(addr)).toBe('erd1qy...ycr6th');
    });

    it('returns empty string for falsy input', () => {
        expect(truncateAddress('')).toBe('');
    });

    it('returns short address unchanged', () => {
        expect(truncateAddress('erd1ab')).toBe('erd1ab');
    });

    it('respects custom char count', () => {
        const addr = 'erd1qyu5wthldzr8wx5c9ucg8kjagg0jfs53s8nr3zpz3hypefsdd8ssycr6th';
        expect(truncateAddress(addr, 10)).toBe('erd1qyu5wt...d8ssycr6th');
    });
});

describe('formatBalance', () => {
    it('formats 1 EGLD', () => {
        expect(formatBalance('1000000000000000000')).toBe('1.0000');
    });

    it('formats 0 EGLD', () => {
        expect(formatBalance('0')).toBe('0.0000');
    });

    it('formats with custom decimals', () => {
        expect(formatBalance('1500000000000000000', 2)).toBe('1.50');
    });

    it('handles empty string', () => {
        expect(formatBalance('')).toBe('0.0000');
    });
});

describe('formatGas', () => {
    it('formats millions', () => {
        expect(formatGas(15_000_000)).toBe('15M');
    });

    it('formats thousands', () => {
        expect(formatGas(50_000)).toBe('50K');
    });

    it('formats small numbers as-is', () => {
        expect(formatGas(500)).toBe('500');
    });
});

describe('formatActionType', () => {
    it('maps known action types', () => {
        expect(formatActionType('AddBoardMember')).toBe('Add Board Member');
        expect(formatActionType('SendTransferExecute')).toBe('Send Transfer');
        expect(formatActionType('SCDeployFromSource')).toBe('Deploy Contract');
    });

    it('returns unknown types as-is', () => {
        expect(formatActionType('CustomAction')).toBe('CustomAction');
    });
});

describe('isValidAddress', () => {
    it('validates correct erd1 addresses', () => {
        const valid = 'erd1qyu5wthldzr8wx5c9ucg8kjagg0jfs53s8nr3zpz3hypefsdd8ssycr6th';
        expect(isValidAddress(valid)).toBe(true);
    });

    it('rejects non-erd1 prefix', () => {
        expect(isValidAddress('0x1234567890abcdef')).toBe(false);
    });

    it('rejects short addresses', () => {
        expect(isValidAddress('erd1short')).toBe(false);
    });
});

describe('formatTimeAgo', () => {
    it('returns "just now" for recent timestamps', () => {
        const now = Math.floor(Date.now() / 1000) - 10;
        expect(formatTimeAgo(now)).toBe('just now');
    });

    it('formats minutes', () => {
        const fiveMinAgo = Math.floor(Date.now() / 1000) - 300;
        expect(formatTimeAgo(fiveMinAgo)).toBe('5m ago');
    });

    it('formats hours', () => {
        const twoHoursAgo = Math.floor(Date.now() / 1000) - 7200;
        expect(formatTimeAgo(twoHoursAgo)).toBe('2h ago');
    });

    it('formats days', () => {
        const threeDaysAgo = Math.floor(Date.now() / 1000) - 259200;
        expect(formatTimeAgo(threeDaysAgo)).toBe('3d ago');
    });
});

describe('toAtomicAmount', () => {
    it('converts 1 EGLD', () => {
        expect(toAtomicAmount('1')).toBe('1000000000000000000');
    });

    it('converts 0.5 EGLD', () => {
        expect(toAtomicAmount('0.5')).toBe('500000000000000000');
    });

    it('converts 1.123456789 EGLD', () => {
        expect(toAtomicAmount('1.123456789')).toBe('1123456789000000000');
    });
});

describe('fromAtomicAmount', () => {
    it('converts to human readable', () => {
        expect(fromAtomicAmount('1000000000000000000')).toBe('1.0000');
    });

    it('handles zero', () => {
        expect(fromAtomicAmount('0')).toBe('0.0000');
    });

    it('handles empty string', () => {
        expect(fromAtomicAmount('')).toBe('0.0000');
    });
});
