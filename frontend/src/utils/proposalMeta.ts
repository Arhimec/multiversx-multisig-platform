/**
 * Proposal Descriptions — stored in localStorage since on-chain
 * proposals don't have a description field.
 * Key format: `mvx-multisig-desc-{contractAddress}-{actionId}`
 */

const KEY_PREFIX = 'mvx-multisig-desc';

export const saveProposalDescription = (
    contractAddress: string,
    actionId: number,
    description: string
) => {
    const key = `${KEY_PREFIX}-${contractAddress}-${actionId}`;
    localStorage.setItem(key, description);
};

export const getProposalDescription = (
    contractAddress: string,
    actionId: number
): string | null => {
    const key = `${KEY_PREFIX}-${contractAddress}-${actionId}`;
    return localStorage.getItem(key);
};

export const deleteProposalDescription = (
    contractAddress: string,
    actionId: number
) => {
    const key = `${KEY_PREFIX}-${contractAddress}-${actionId}`;
    localStorage.removeItem(key);
};

/**
 * Expiration timestamps for proposals — frontend-only feature.
 * Key format: `mvx-multisig-exp-{contractAddress}-{actionId}`
 */

const EXP_PREFIX = 'mvx-multisig-exp';

export const saveProposalExpiration = (
    contractAddress: string,
    actionId: number,
    expiresAt: Date
) => {
    const key = `${EXP_PREFIX}-${contractAddress}-${actionId}`;
    localStorage.setItem(key, expiresAt.toISOString());
};

export const getProposalExpiration = (
    contractAddress: string,
    actionId: number
): Date | null => {
    const key = `${EXP_PREFIX}-${contractAddress}-${actionId}`;
    const val = localStorage.getItem(key);
    return val ? new Date(val) : null;
};

export const isProposalExpired = (
    contractAddress: string,
    actionId: number
): boolean => {
    const exp = getProposalExpiration(contractAddress, actionId);
    if (!exp) return false;
    return exp.getTime() < Date.now();
};

export const getTimeRemaining = (
    contractAddress: string,
    actionId: number
): string | null => {
    const exp = getProposalExpiration(contractAddress, actionId);
    if (!exp) return null;

    const diff = exp.getTime() - Date.now();
    if (diff <= 0) return 'Expired';

    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);

    if (hours > 24) {
        const days = Math.floor(hours / 24);
        return `${days}d ${hours % 24}h remaining`;
    }
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
};
