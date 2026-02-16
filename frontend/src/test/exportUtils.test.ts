import { describe, it, expect } from 'vitest';
import { generateCSV } from '../utils/exportUtils';

const mockData = [
    {
        id: 1,
        type: 'SendTransfer',
        description: 'Pay alice',
        status: 'executed',
        date: '2025-01-15',
        signers: 'alice, bob',
        txHash: '0xabc123',
    },
    {
        id: 2,
        type: 'AddBoardMember',
        description: 'Add carol',
        status: 'pending',
        date: '2025-01-16',
        signers: 'bob',
        txHash: '0xdef456',
    },
];

describe('generateCSV', () => {
    it('generates valid CSV with headers', () => {
        const csv = generateCSV(mockData);
        const lines = csv.split('\n');

        expect(lines[0]).toBe('ID,Type,Description,Status,Date,Signers,TX Hash');
        expect(lines.length).toBe(3); // header + 2 rows
    });

    it('wraps text fields in quotes', () => {
        const csv = generateCSV(mockData);
        const firstRow = csv.split('\n')[1];

        expect(firstRow).toContain('"SendTransfer"');
        expect(firstRow).toContain('"Pay alice"');
        expect(firstRow).toContain('"alice, bob"');
    });

    it('handles empty data', () => {
        const csv = generateCSV([]);
        const lines = csv.split('\n');

        expect(lines.length).toBe(1); // only header
        expect(lines[0]).toBe('ID,Type,Description,Status,Date,Signers,TX Hash');
    });
});
