# API Reference

## MultiversX APIs Used

The frontend interacts with the MultiversX public API. No custom backend is needed.

### Base URLs

| Network | API URL |
|---|---|
| Mainnet | `https://api.multiversx.com` |
| Testnet | `https://testnet-api.multiversx.com` |
| Devnet | `https://devnet-api.multiversx.com` |

### Endpoints Used

#### Account
```
GET /accounts/{address}
→ { address, balance, nonce, shard }

GET /accounts/{address}/tokens
→ [{ identifier, balance, decimals, name }]
```

#### Transactions
```
GET /accounts/{address}/transactions?size=50&order=desc
→ [{ txHash, sender, receiver, value, status, timestamp, function }]

GET /transactions/{txHash}
→ { txHash, sender, receiver, value, status, results, operations }
```

#### Staking Providers
```
GET /providers
→ [{ provider, serviceFee, delegationCap, numNodes, apr, identity }]

GET /identities
→ [{ identity, name, avatar, description }]
```

#### Network
```
GET /network/config
→ { chainId, gasPerDataByte, minGasLimit, ... }

GET /economics
→ { totalSupply, circulatingSupply, staked, price }
```

## Smart Contract Interaction

The frontend interacts with deployed multisig contracts via `@multiversx/sdk-core`.

### Frontend Integration Layer

File: `frontend/src/contracts/multisigInteraction.ts`

### Common Operations

#### Query pending actions
```typescript
const contract = new SmartContract({ address: new Address(contractAddress) });
const interaction = contract.methods.getPendingActionFullInfo();
const query = interaction.buildQuery();
const response = await provider.queryContract(query);
```

#### Propose a transfer
```typescript
const tx = contract.methods
    .proposeTransferExecute([recipient, amount, functionCall])
    .withGasLimit(15_000_000)
    .withChainID(chainId)
    .buildTransaction();
```

#### Sign an action
```typescript
const tx = contract.methods
    .sign([actionId])
    .withGasLimit(10_000_000)
    .withChainID(chainId)
    .buildTransaction();
```

#### Execute (perform) an action
```typescript
const tx = contract.methods
    .performAction([actionId])
    .withGasLimit(50_000_000)
    .withChainID(chainId)
    .buildTransaction();
```

## localStorage Keys

| Key | Description |
|---|---|
| `mvx-multisig-network` | Selected network (mainnet/testnet/devnet) |
| `mvx-multisig-addresses` | Saved multisig addresses |
| `mvx-multisig-contacts` | Address book contacts |
| `mvx-multisig-proposal-meta` | Proposal descriptions + expirations |
| `mvx-multisig-notifications` | Notification preferences |
| `mvx-multisig-governance` | Governance proposals + votes |
| `mvx-multisig-installed-plugins` | Installed plugin IDs |
| `mvx-multisig-2fa-config` | 2FA configuration |
| `mvx-multisig-social-recovery` | Social recovery guardians |
