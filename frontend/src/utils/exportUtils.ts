/**
 * Export utilities — generate CSV and PDF from transaction history data.
 */

interface ExportRow {
    id: number;
    type: string;
    description: string;
    status: string;
    date: string;
    signers: string;
    txHash: string;
}

export const generateCSV = (data: ExportRow[]): string => {
    const headers = ['ID', 'Type', 'Description', 'Status', 'Date', 'Signers', 'TX Hash'];
    const rows = data.map(row => [
        row.id,
        `"${row.type}"`,
        `"${row.description}"`,
        row.status,
        row.date,
        `"${row.signers}"`,
        row.txHash,
    ].join(','));

    return [headers.join(','), ...rows].join('\n');
};

export const downloadCSV = (data: ExportRow[], filename: string = 'multisig-history') => {
    const csv = generateCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const downloadJSON = (data: any, filename: string = 'multisig-history') => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
