/**
 * MultiversX Multisig — Contract Interaction Layer
 *
 * Uses sdk-core v15 API:
 *   - SmartContractTransactionsFactory for tx building
 *   - Direct HTTP API calls for queries (bypasses SDK bech32 bug)
 */

import {
    AbiRegistry,
    Address,
    AddressValue,
    BigUIntValue,
    BytesValue,
    SmartContractTransactionsFactory,
    Transaction,
    TransactionsFactoryConfig,
    U32Value,
} from '@multiversx/sdk-core';
import abiJson from './multisig.abi.json';
import { NETWORK_CONFIG } from '../config/network';

// ─── Compatibility note ─────────────────────────────────────────────────────
// sdk-network-providers v2 internally calls Address.bech32() which was renamed
// to Address.toBech32() in sdk-core v15. We bypass this by using direct HTTP
// queries to the API instead of SmartContractController.query().

// ─── ABI & Provider Setup ───────────────────────────────────────────────────

const abiRegistry = AbiRegistry.create(abiJson as any);
const factoryConfig = new TransactionsFactoryConfig({ chainID: NETWORK_CONFIG.chainId });

const factory = new SmartContractTransactionsFactory({
    config: factoryConfig,
    abi: abiRegistry,
});

// ─── Types ──────────────────────────────────────────────────────────────────

export interface MultisigInfo {
    address: string;
    quorum: number;
    numBoardMembers: number;
    numProposers: number;
    boardMembers: string[];
    proposers: string[];
    actionLastIndex: number;
}

export type UserRole = 'None' | 'Proposer' | 'BoardMember';

// ─── Direct API Query (bypasses SDK bech32 bug) ─────────────────────────────

async function queryContractDirect(
    contractAddress: string,
    func: string,
    args: string[] = [],
): Promise<any> {
    const url = `${NETWORK_CONFIG.apiUrl}/query`;
    const body = {
        scAddress: contractAddress,
        funcName: func,
        args: args,
    };
    const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!resp.ok) throw new Error(`Query ${func} failed: ${resp.status}`);
    const data = await resp.json();
    if (data.returnCode !== 'ok') throw new Error(`Query ${func}: ${data.returnCode} - ${data.returnMessage}`);
    return data.returnData ?? [];
}

/** Decode a base64 value to a number */
function decodeNumber(b64: string): number {
    if (!b64) return 0;
    const buf = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    let n = 0;
    for (const byte of buf) n = n * 256 + byte;
    return n;
}

/** Decode a base64 value to a bech32 address */
function decodeAddress(b64: string): string {
    if (!b64) return '';
    const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    return Address.newFromHex(hex).toBech32();
}

/** Encode a bech32 address to hex for query args */
function addressToHex(bech32Addr: string): string {
    return Address.newFromBech32(bech32Addr).toHex();
}

/** Encode a number to hex for query args */
function numberToHex(n: number): string {
    if (n === 0) return '';
    const hex = n.toString(16);
    return hex.length % 2 === 0 ? hex : '0' + hex;
}

async function queryScalar(contractAddress: string, func: string, hexArgs: string[] = []): Promise<number> {
    const result = await queryContractDirect(contractAddress, func, hexArgs);
    return decodeNumber(result?.[0] ?? '');
}

export async function getQuorum(contractAddress: string): Promise<number> {
    const val = await queryScalar(contractAddress, 'getQuorum');
    return Number(val ?? 0);
}

export async function getNumBoardMembers(contractAddress: string): Promise<number> {
    const val = await queryScalar(contractAddress, 'getNumBoardMembers');
    return Number(val ?? 0);
}

export async function getNumProposers(contractAddress: string): Promise<number> {
    const val = await queryScalar(contractAddress, 'getNumProposers');
    return Number(val ?? 0);
}

export async function getActionLastIndex(contractAddress: string): Promise<number> {
    const val = await queryScalar(contractAddress, 'getActionLastIndex');
    return Number(val ?? 0);
}

export async function getUserRole(contractAddress: string, userAddress: string): Promise<UserRole> {
    try {
        const result = await queryContractDirect(contractAddress, 'userRole', [addressToHex(userAddress)]);
        const roleNum = decodeNumber(result?.[0] ?? '');
        // SC returns: 0 = None, 1 = Proposer, 2 = BoardMember
        if (roleNum === 2) return 'BoardMember';
        if (roleNum === 1) return 'Proposer';
        return 'None';
    } catch {
        return 'None';
    }
}

export async function getAllBoardMembers(contractAddress: string): Promise<string[]> {
    try {
        const result = await queryContractDirect(contractAddress, 'getAllBoardMembers');
        return (result ?? []).filter((b: string) => b).map(decodeAddress);
    } catch (err) {
        console.error('getAllBoardMembers error:', err);
        return [];
    }
}

export async function getAllProposers(contractAddress: string): Promise<string[]> {
    try {
        const result = await queryContractDirect(contractAddress, 'getAllProposers');
        return (result ?? []).filter((b: string) => b).map(decodeAddress);
    } catch {
        return [];
    }
}

export async function getActionSignerCount(contractAddress: string, actionId: number): Promise<number> {
    return queryScalar(contractAddress, 'getActionSignerCount', [numberToHex(actionId)]);
}

export async function getActionSigners(contractAddress: string, actionId: number): Promise<string[]> {
    try {
        const result = await queryContractDirect(contractAddress, 'getActionSigners', [numberToHex(actionId)]);
        return (result ?? []).filter((b: string) => b).map(decodeAddress);
    } catch {
        return [];
    }
}

export async function isSigned(contractAddress: string, userAddress: string, actionId: number): Promise<boolean> {
    try {
        const result = await queryContractDirect(contractAddress, 'signed', [addressToHex(userAddress), numberToHex(actionId)]);
        return decodeNumber(result?.[0] ?? '') !== 0;
    } catch {
        return false;
    }
}

export async function quorumReached(contractAddress: string, actionId: number): Promise<boolean> {
    try {
        const result = await queryContractDirect(contractAddress, 'quorumReached', [numberToHex(actionId)]);
        return decodeNumber(result?.[0] ?? '') !== 0;
    } catch {
        return false;
    }
}

/**
 * Fetches full multisig information in a single batch
 */
export async function getMultisigInfo(contractAddress: string): Promise<MultisigInfo> {
    const [quorum, numBoardMembers, numProposers, boardMembers, proposers, actionLastIndex] =
        await Promise.all([
            getQuorum(contractAddress),
            getNumBoardMembers(contractAddress),
            getNumProposers(contractAddress),
            getAllBoardMembers(contractAddress),
            getAllProposers(contractAddress),
            getActionLastIndex(contractAddress),
        ]);

    return {
        address: contractAddress,
        quorum,
        numBoardMembers,
        numProposers,
        boardMembers,
        proposers,
        actionLastIndex,
    };
}

// ─── Transaction Builders ───────────────────────────────────────────────────

const GAS_SIGN = 15_000_000n;
const GAS_UNSIGN = 15_000_000n;
const GAS_DISCARD = 15_000_000n;
const GAS_PERFORM = 100_000_000n;
const GAS_PROPOSE = 25_000_000n;

export async function buildSignTransaction(contractAddress: string, actionId: number, sender: string): Promise<Transaction> {
    return factory.createTransactionForExecute(
        Address.newFromBech32(sender),
        {
            contract: Address.newFromBech32(contractAddress),
            function: 'sign',
            gasLimit: GAS_SIGN,
            arguments: [new U32Value(actionId)],
        },
    );
}

export async function buildUnsignTransaction(contractAddress: string, actionId: number, sender: string): Promise<Transaction> {
    return factory.createTransactionForExecute(
        Address.newFromBech32(sender),
        {
            contract: Address.newFromBech32(contractAddress),
            function: 'unsign',
            gasLimit: GAS_UNSIGN,
            arguments: [new U32Value(actionId)],
        },
    );
}

export async function buildDiscardActionTransaction(contractAddress: string, actionId: number, sender: string): Promise<Transaction> {
    return factory.createTransactionForExecute(
        Address.newFromBech32(sender),
        {
            contract: Address.newFromBech32(contractAddress),
            function: 'discardAction',
            gasLimit: GAS_DISCARD,
            arguments: [new U32Value(actionId)],
        },
    );
}

export async function buildPerformActionTransaction(contractAddress: string, actionId: number, sender: string): Promise<Transaction> {
    return factory.createTransactionForExecute(
        Address.newFromBech32(sender),
        {
            contract: Address.newFromBech32(contractAddress),
            function: 'performAction',
            gasLimit: GAS_PERFORM,
            arguments: [new U32Value(actionId)],
        },
    );
}

// ─── Propose Transaction Builders ───────────────────────────────────────────

export async function buildProposeAddBoardMember(contractAddress: string, memberAddress: string, sender: string): Promise<Transaction> {
    return factory.createTransactionForExecute(
        Address.newFromBech32(sender),
        {
            contract: Address.newFromBech32(contractAddress),
            function: 'proposeAddBoardMember',
            gasLimit: GAS_PROPOSE,
            arguments: [new AddressValue(Address.newFromBech32(memberAddress))],
        },
    );
}

export async function buildProposeAddProposer(contractAddress: string, proposerAddress: string, sender: string): Promise<Transaction> {
    return factory.createTransactionForExecute(
        Address.newFromBech32(sender),
        {
            contract: Address.newFromBech32(contractAddress),
            function: 'proposeAddProposer',
            gasLimit: GAS_PROPOSE,
            arguments: [new AddressValue(Address.newFromBech32(proposerAddress))],
        },
    );
}

export async function buildProposeRemoveUser(contractAddress: string, userAddress: string, sender: string): Promise<Transaction> {
    return factory.createTransactionForExecute(
        Address.newFromBech32(sender),
        {
            contract: Address.newFromBech32(contractAddress),
            function: 'proposeRemoveUser',
            gasLimit: GAS_PROPOSE,
            arguments: [new AddressValue(Address.newFromBech32(userAddress))],
        },
    );
}

export async function buildProposeChangeQuorum(contractAddress: string, newQuorum: number, sender: string): Promise<Transaction> {
    return factory.createTransactionForExecute(
        Address.newFromBech32(sender),
        {
            contract: Address.newFromBech32(contractAddress),
            function: 'proposeChangeQuorum',
            gasLimit: GAS_PROPOSE,
            arguments: [new U32Value(newQuorum)],
        },
    );
}

export async function buildProposeTransferExecute(
    contractAddress: string,
    to: string,
    egldAmount: string,
    sender: string,
    functionName?: string,
    args?: Buffer[],
): Promise<Transaction> {
    const callArgs: any[] = [
        new AddressValue(Address.newFromBech32(to)),
        new BigUIntValue(BigInt(egldAmount)),
    ];

    if (functionName) {
        callArgs.push(new BytesValue(Buffer.from(functionName)));
        if (args) {
            args.forEach((arg) => callArgs.push(new BytesValue(arg)));
        }
    }

    return factory.createTransactionForExecute(
        Address.newFromBech32(sender),
        {
            contract: Address.newFromBech32(contractAddress),
            function: 'proposeTransferExecute',
            gasLimit: GAS_PROPOSE,
            arguments: callArgs,
        },
    );
}

export async function buildProposeAsyncCall(
    contractAddress: string,
    to: string,
    egldAmount: string,
    sender: string,
    functionName?: string,
    args?: Buffer[],
): Promise<Transaction> {
    const callArgs: any[] = [
        new AddressValue(Address.newFromBech32(to)),
        new BigUIntValue(BigInt(egldAmount)),
    ];

    if (functionName) {
        callArgs.push(new BytesValue(Buffer.from(functionName)));
        if (args) {
            args.forEach((arg) => callArgs.push(new BytesValue(arg)));
        }
    }

    return factory.createTransactionForExecute(
        Address.newFromBech32(sender),
        {
            contract: Address.newFromBech32(contractAddress),
            function: 'proposeAsyncCall',
            gasLimit: GAS_PROPOSE,
            arguments: callArgs,
        },
    );
}

// ─── Deposit (send funds to multisig) ───────────────────────────────────────

export async function buildDepositTransaction(
    contractAddress: string,
    egldAmount: string,
    sender: string,
): Promise<Transaction> {
    return factory.createTransactionForExecute(
        Address.newFromBech32(sender),
        {
            contract: Address.newFromBech32(contractAddress),
            function: 'deposit',
            gasLimit: 10_000_000n,
            arguments: [],
            nativeTransferAmount: BigInt(egldAmount),
        },
    );
}

// ─── Staking Convenience Builders ───────────────────────────────────────────

export async function buildProposeDelegation(
    contractAddress: string,
    providerAddress: string,
    egldAmount: string,
    sender: string,
): Promise<Transaction> {
    return buildProposeAsyncCall(contractAddress, providerAddress, egldAmount, sender, 'delegate');
}

export async function buildProposeUndelegation(
    contractAddress: string,
    providerAddress: string,
    egldAmount: string,
    sender: string,
): Promise<Transaction> {
    return buildProposeAsyncCall(contractAddress, providerAddress, '0', sender, 'unDelegate', [
        Buffer.from(BigInt(egldAmount).toString(16).padStart(2, '0'), 'hex'),
    ]);
}

export async function buildProposeClaimRewards(
    contractAddress: string,
    providerAddress: string,
    sender: string,
): Promise<Transaction> {
    return buildProposeAsyncCall(contractAddress, providerAddress, '0', sender, 'claimRewards');
}

// ─── Transaction Sending Helper ─────────────────────────────────────────────

/**
 * Sends a transaction via sdk-dapp's TransactionManager
 * This integrates with the wallet signing flow
 */
export async function sendMultisigTransaction(transaction: Transaction): Promise<string> {
    const { TransactionManager } = await import('@multiversx/sdk-dapp/out/managers/TransactionManager');

    const txManager = TransactionManager.getInstance();
    const result = await txManager.send([transaction]);

    return result?.toString() ?? '';
}
