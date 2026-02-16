export type NetworkName = 'mainnet' | 'testnet' | 'devnet';

export interface NetworkConfig {
    name: NetworkName;
    displayName: string;
    apiUrl: string;
    gatewayUrl: string;
    explorerUrl: string;
    walletUrl: string;
    chainId: string;
    egldLabel: string;
    walletConnectProjectId: string;
    multisigContractAddress: string;
    faucetUrl?: string;
}

const NETWORKS: Record<NetworkName, NetworkConfig> = {
    mainnet: {
        name: 'mainnet',
        displayName: 'Mainnet',
        apiUrl: 'https://api.multiversx.com',
        gatewayUrl: 'https://gateway.multiversx.com',
        explorerUrl: 'https://explorer.multiversx.com',
        walletUrl: 'https://wallet.multiversx.com',
        chainId: '1',
        egldLabel: 'EGLD',
        walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '',
        multisigContractAddress: '', // Set after mainnet deploy
    },
    testnet: {
        name: 'testnet',
        displayName: 'Testnet',
        apiUrl: 'https://testnet-api.multiversx.com',
        gatewayUrl: 'https://testnet-gateway.multiversx.com',
        explorerUrl: 'https://testnet-explorer.multiversx.com',
        walletUrl: 'https://testnet-wallet.multiversx.com',
        chainId: 'T',
        egldLabel: 'xEGLD',
        walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '',
        multisigContractAddress: '', // Set after testnet deploy
        faucetUrl: 'https://testnet-wallet.multiversx.com/faucet',
    },
    devnet: {
        name: 'devnet',
        displayName: 'Devnet',
        apiUrl: 'https://devnet-api.multiversx.com',
        gatewayUrl: 'https://devnet-gateway.multiversx.com',
        explorerUrl: 'https://devnet-explorer.multiversx.com',
        walletUrl: 'https://devnet-wallet.multiversx.com',
        chainId: 'D',
        egldLabel: 'xEGLD',
        walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '',
        multisigContractAddress: 'erd1qqqqqqqqqqqqqpgq67k2sfrafzf958z22n90gy7ka83ghgg37k8s45ertq',
        faucetUrl: 'https://devnet-wallet.multiversx.com/faucet',
    },
};

const STORAGE_KEY = 'mvx-multisig-network';

/** Get the currently selected network name */
export const getSelectedNetwork = (): NetworkName => {
    const stored = localStorage.getItem(STORAGE_KEY) as NetworkName | null;
    if (stored && NETWORKS[stored]) return stored;
    // Fallback to env var or devnet
    const envNetwork = (import.meta.env.VITE_NETWORK || 'devnet') as NetworkName;
    return NETWORKS[envNetwork] ? envNetwork : 'devnet';
};

/** Set the active network (triggers page reload to reinit SDK) */
export const setSelectedNetwork = (network: NetworkName) => {
    localStorage.setItem(STORAGE_KEY, network);
    window.location.reload();
};

/** Get all available networks */
export const getAllNetworks = (): NetworkConfig[] => Object.values(NETWORKS);

/** Get the current network config */
export const getNetworkConfig = (): NetworkConfig => NETWORKS[getSelectedNetwork()];

// Backwards compat
export const NETWORK_CONFIG = getNetworkConfig();
