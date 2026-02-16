# Smart Contract Reference

## Overview

The MultiversX Multisig smart contract implements a multi-signature wallet where multiple board members must approve actions before execution. It is written in Rust using the `multiversx-sc` framework.

## Contract Address

After deployment, update the contract address in:
```
frontend/src/config/network.ts → NETWORK_CONFIG.multisigContractAddress
```

## Roles

| Role | Value | Can Propose | Can Sign | Can Discard |
|---|---|---|---|---|
| None | 0 | ❌ | ❌ | ❌ |
| Proposer | 1 | ✅ | ❌ | ✅ |
| BoardMember | 2 | ✅ | ✅ | ✅ |

## Actions (Proposals)

| Action | Description |
|---|---|
| `AddBoardMember` | Add or promote user to board member |
| `AddProposer` | Add or demote user to proposer |
| `RemoveUser` | Remove any user (board/proposer) |
| `ChangeQuorum` | Change the number of required signatures |
| `SendTransferExecute` | Send EGLD or call SC endpoint (sync) |
| `SendAsyncCall` | Send EGLD/ESDT or call SC endpoint (async) |
| `SCDeployFromSource` | Deploy a new smart contract from source |
| `SCUpgradeFromSource` | Upgrade an existing smart contract |

## Endpoints

### Init & Upgrade

```rust
#[init]
fn init(&self, quorum: usize, board: MultiValueEncoded<ManagedAddress>)

#[upgrade]
fn upgrade(&self, quorum: usize, board: MultiValueEncoded<ManagedAddress>)
```

### Deposit
```rust
#[payable("*")]
#[endpoint]
fn deposit(&self)  // Receive EGLD/ESDT
```

### Propose Actions
```rust
fn proposeAddBoardMember(board_member_address: ManagedAddress) -> usize
fn proposeAddProposer(proposer_address: ManagedAddress) -> usize
fn proposeRemoveUser(user_address: ManagedAddress) -> usize
fn proposeChangeQuorum(new_quorum: usize) -> usize
fn proposeTransferExecute(to, egld_amount, function_call) -> usize
fn proposeAsyncCall(to, egld_amount, function_call) -> usize
fn proposeSCDeployFromSource(amount, source, code_metadata, arguments) -> usize
fn proposeSCUpgradeFromSource(sc_address, amount, source, code_metadata, arguments) -> usize
```

### Sign / Unsign
```rust
fn sign(action_id: usize)      // Board member signs
fn unsign(action_id: usize)    // Board member withdraws signature
```

### Execute
```rust
fn performAction(action_id: usize) -> OptionalValue<ManagedAddress>
```
Requires `quorum` valid signatures to execute.

### Discard
```rust
fn discardAction(action_id: usize)  // Remove action (requires 0 signatures)
```

### View Functions
```rust
fn getPendingActionFullInfo() -> MultiValueEncoded<ActionFullInfo>
fn signed(user: ManagedAddress, action_id: usize) -> bool
fn userRole(user: ManagedAddress) -> UserRole
fn getAllBoardMembers() -> MultiValueEncoded<ManagedAddress>
fn getAllProposers() -> MultiValueEncoded<ManagedAddress>
fn getQuorum() -> usize
fn getNumBoardMembers() -> usize
fn getNumProposers() -> usize
fn getActionLastIndex() -> usize
fn getActionData(action_id: usize) -> Action
fn getActionSignerCount(action_id: usize) -> usize
fn getActionValidSignerCount(action_id: usize) -> usize
fn quorumReached(action_id: usize) -> bool
```

## Build & Test

```bash
# Prerequisites
rustup target add wasm32-unknown-unknown
pip3 install multiversx-sdk-cli

# Build
cd contract/meta && cargo run -- build

# Output
contract/output/multiversx-multisig.wasm    # Compiled bytecode
contract/output/multiversx-multisig.abi.json # ABI for frontend
```

## Storage Layout

| Key | Type | Description |
|---|---|---|
| `quorum` | `usize` | Required signatures |
| `user` | `UserMapper` | User ID ↔ address mapping |
| `user_role:{id}` | `UserRole` | Role per user |
| `action_data` | `VecMapper<Action>` | All proposed actions |
| `action_signer_ids:{id}` | `UnorderedSetMapper<usize>` | Signers per action |
| `num_board_members` | `usize` | Board member count |
| `num_proposers` | `usize` | Proposer count |
