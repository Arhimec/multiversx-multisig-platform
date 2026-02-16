/**
 * Utility formatters for the MultiversX Multisig Platform
 */

/**
 * Truncate a bech32 address for display: erd1abc...xyz
 */
export const truncateAddress = (address: string, chars = 6): string => {
    if (!address || address.length < chars * 2) return address || '';
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

/**
 * Format a balance from base denomination (10^18) to human readable
 */
export const formatBalance = (balance: string, decimals = 4): string => {
    const num = BigInt(balance || '0');
    const egld = Number(num) / 1e18;
    return egld.toFixed(decimals);
};

/**
 * Format gas to human readable (e.g., 15M)
 */
export const formatGas = (gas: number): string => {
    if (gas >= 1_000_000) return `${(gas / 1_000_000).toFixed(0)}M`;
    if (gas >= 1_000) return `${(gas / 1_000).toFixed(0)}K`;
    return gas.toString();
};

/**
 * Parse action type enum name to human-readable label
 */
export const formatActionType = (actionType: string): string => {
    const labels: Record<string, string> = {
        Nothing: 'Nothing',
        AddBoardMember: 'Add Board Member',
        AddProposer: 'Add Proposer',
        RemoveUser: 'Remove User',
        ChangeQuorum: 'Change Quorum',
        SendTransferExecute: 'Send Transfer',
        SendAsyncCall: 'Async Call',
        SCDeployFromSource: 'Deploy Contract',
        SCUpgradeFromSource: 'Upgrade Contract',
    };
    return labels[actionType] || actionType;
};

/**
 * Validate a MultiversX bech32 address
 */
export const isValidAddress = (address: string): boolean => {
    return address.startsWith('erd1') && address.length === 62;
};

/**
 * Format a timestamp to relative time
 */
export const formatTimeAgo = (timestamp: number): string => {
    const seconds = Math.floor(Date.now() / 1000 - timestamp);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(timestamp * 1000).toLocaleDateString();
};

/**
 * Convert EGLD amount from human readable to base denomination
 */
export const toAtomicAmount = (amount: string): string => {
    const [integer, decimal = ''] = amount.split('.');
    const paddedDecimal = decimal.padEnd(18, '0').slice(0, 18);
    return BigInt(integer + paddedDecimal).toString();
};

/**
 * Convert EGLD amount from base denomination to human readable
 */
export const fromAtomicAmount = (amount: string, decimals = 4): string => {
    const num = BigInt(amount || '0');
    const egld = Number(num) / 1e18;
    return egld.toFixed(decimals);
};
