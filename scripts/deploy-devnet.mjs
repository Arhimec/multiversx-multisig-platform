/**
 * MultiversX Multisig — Deploy Script (Devnet)
 *
 * Usage:
 *   node scripts/deploy-devnet.mjs --pem=wallet.pem --quorum=1 --board=erd1...
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = Object.fromEntries(
    process.argv.slice(2).map((arg) => {
        const [key, value] = arg.replace('--', '').split('=');
        return [key, value];
    })
);

const DEVNET_API = 'https://devnet-api.multiversx.com';
const DEVNET_CHAIN_ID = 'D';
const GAS_LIMIT_DEPLOY = 150_000_000;
const WASM_PATH = join(__dirname, '..', 'contract', 'output', 'multiversx-multisig.wasm');

async function deploy() {
    console.log('🚀 MultiversX Multisig — Deploy to Devnet\n');

    if (!args.pem) {
        console.error('❌ Usage: node scripts/deploy-devnet.mjs --pem=wallet.pem --quorum=1 --board=erd1...');
        process.exit(1);
    }

    const quorum = parseInt(args.quorum || '1');
    const boardAddresses = (args.board || '').split(',').filter(Boolean);

    if (boardAddresses.length === 0) {
        console.error('❌ Missing --board. Provide comma-separated erd1... addresses');
        process.exit(1);
    }

    if (quorum > boardAddresses.length) {
        console.error(`❌ Quorum (${quorum}) > board size (${boardAddresses.length})`);
        process.exit(1);
    }

    console.log(`📋 Quorum: ${quorum} | Board: ${boardAddresses.length}`);

    // Load WASM & PEM
    let wasmCode, pemContent;
    try {
        wasmCode = readFileSync(WASM_PATH);
        console.log(`📦 WASM: ${(wasmCode.length / 1024).toFixed(1)} KB`);
    } catch {
        console.error(`❌ WASM not found. Run: cd contract/meta && cargo run -- build --no-wasm-opt`);
        process.exit(1);
    }

    try {
        pemContent = readFileSync(args.pem, 'utf-8');
    } catch {
        console.error(`❌ PEM file not found: ${args.pem}`);
        process.exit(1);
    }

    // Import SDK
    const {
        UserSigner,
        Address,
        SmartContractTransactionsFactory,
        TransactionsFactoryConfig,
        TransactionComputer,
        AbiRegistry,
        U32Value,
        AddressValue,
        ApiNetworkProvider,
    } = await import('@multiversx/sdk-core');

    // ABI
    const abiPath = join(__dirname, '..', 'contract', 'output', 'multiversx-multisig.abi.json');
    const abiJson = JSON.parse(readFileSync(abiPath, 'utf-8'));
    const abiRegistry = AbiRegistry.create(abiJson);

    // Signer
    const signer = UserSigner.fromPem(pemContent);
    const signerAddress = signer.getAddress();
    const bech32 = signerAddress.toBech32 ? signerAddress.toBech32() : signerAddress.toString();
    console.log(`🔑 Deployer: ${bech32}`);

    // Provider & account
    const provider = new ApiNetworkProvider(DEVNET_API, {
        timeout: 10000,
        clientName: 'multisig-deploy',
    });
    const account = await provider.getAccount(signerAddress);
    const balance = Number(account.balance) / 1e18;
    console.log(`💰 Balance: ${balance.toFixed(4)} xEGLD`);

    if (balance < 0.1) {
        console.error('❌ Need at least 0.1 xEGLD. Faucet: https://devnet-wallet.multiversx.com/faucet');
        process.exit(1);
    }

    // Build deploy TX using the v15 factory
    const factoryConfig = new TransactionsFactoryConfig({ chainID: DEVNET_CHAIN_ID });
    const factory = new SmartContractTransactionsFactory({
        config: factoryConfig,
        abi: abiRegistry,
    });

    const deployTx = factory.createTransactionForDeploy({
        sender: signerAddress,
        bytecode: wasmCode,
        gasLimit: BigInt(GAS_LIMIT_DEPLOY),
        isUpgradeable: true,
        isReadable: true,
        isPayable: false,
        isPayableBySmartContract: false,
        arguments: [quorum, ...boardAddresses.map((addr) => new Address(addr))],
    });

    deployTx.nonce = BigInt(account.nonce);

    // Sign
    const computer = new TransactionComputer();
    const serialized = computer.computeBytesForSigning(deployTx);
    const signature = await signer.sign(serialized);
    deployTx.signature = signature;

    // Send
    console.log('\n📡 Sending deploy transaction...');
    const txHash = await provider.sendTransaction(deployTx);
    console.log(`✅ TX Hash: ${txHash}`);
    console.log(`🔗 https://devnet-explorer.multiversx.com/transactions/${txHash}`);

    // Wait
    console.log('\n⏳ Waiting 12s for execution...');
    await new Promise((r) => setTimeout(r, 12000));

    // Compute contract address
    const contractAddress = Address.newFromBech32
        ? Address.newFromBech32(bech32)
        : new Address(bech32);

    // SC address = hash(deployer + nonce)
    const { SmartContract } = await import('@multiversx/sdk-core').catch(() => ({}));
    let scAddress;
    try {
        scAddress = SmartContract
            ? SmartContract.computeAddress(signerAddress, Number(account.nonce))
            : null;
    } catch {
        // Fallback: compute from API
    }

    // Try to verify on chain
    try {
        const txOnNetwork = await provider.getTransaction(txHash);
        // Try to extract SC address from tx results
        const scResults = txOnNetwork.contractResults || txOnNetwork.smartContractResults || [];
        let deployedAddress = scAddress
            ? (scAddress.toBech32 ? scAddress.toBech32() : scAddress.toString())
            : null;

        // Check logs for deployed address
        if (!deployedAddress && txOnNetwork.logs && txOnNetwork.logs.events) {
            const scDeployEvent = txOnNetwork.logs.events.find(e => e.identifier === 'SCDeploy');
            if (scDeployEvent && scDeployEvent.address) {
                deployedAddress = scDeployEvent.address;
            }
        }

        if (deployedAddress) {
            console.log(`\n🎉 Contract deployed!`);
            console.log(`📍 Address: ${deployedAddress}`);
            console.log(`🔗 https://devnet-explorer.multiversx.com/accounts/${deployedAddress}`);
            console.log(`\n➡️  Update frontend/src/config/network.ts with:`);
            console.log(`    multisigContractAddress: "${deployedAddress}"`);
        } else {
            console.log(`\n⚠️  TX sent but address not confirmed. Check explorer manually.`);
        }
    } catch (err) {
        console.log(`\n⚠️  Could not verify. Check explorer: https://devnet-explorer.multiversx.com/transactions/${txHash}`);
    }
}

deploy().catch((err) => {
    console.error('\n❌ Deploy failed:', err.message || err);
    if (process.env.DEBUG) console.error(err);
    process.exit(1);
});
