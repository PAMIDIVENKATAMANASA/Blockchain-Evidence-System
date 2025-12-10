# TrustChain - Quick Explainer & Verification Guide

## 1) What this project does (short)
- Officers upload evidence files → stored on IPFS (gets IPFS CID).
- File hash (SHA-256, wrapped to bytes32) is stored on blockchain (immutable).
- Metadata is stored in MongoDB (evidenceId, ipfsHash, fileHash, tx hash, etc.).
- Judges/Lawyers can view and verify evidence; system detects tampering by hash comparison.

## 2) Key hashes and why they matter
- IPFS Hash (CID): Where the file lives on IPFS. Used to download the file anywhere.
- Blockchain Hash: SHA-256 of the file, saved on-chain. Used to prove integrity.
- Transaction Hash (deployment/calls): Lets you see on Etherscan when/where it was written.

## 3) Expected outputs (what you should see)
- In the app: Evidence card with IPFS hash, blockchain hash, status (Verified/Tampered).
- On-chain: Transaction(s) on Sepolia Etherscan for `addEvidence`, `getOriginalHash`.
- Events: `EvidenceAdded` events on the contract (viewable on Etherscan).

## 4) How to verify on Etherscan (step-by-step)
1) Get your contract address (`blockchain/deployment.json` or deploy output).
2) Go to `https://sepolia.etherscan.io/address/<CONTRACT_ADDRESS>`.
3) (If not verified) run `npm run verify` in `blockchain/`.
4) Click **Events** → find `EvidenceAdded` → look for your evidenceId.
5) Click the event → confirm the hash matches your app’s blockchain hash.
6) Click **Read Contract** → `getOriginalHash(evidenceId)` → confirm hash matches.

## 5) How to test IPFS hash (is file accessible?)
- Direct gateway: `https://ipfs.io/ipfs/<CID>` (or your public gateway).
- Local/public: `ipfs cat <CID> > /tmp/file` then `sha256sum /tmp/file` (should match stored fileHash in MongoDB and hash on-chain).
- Our routes: `GET /api/evidence/:id/download` (with auth) pulls from IPFS.

## 6) How to explain workflow to your mentor
- Upload: File → IPFS CID → SHA-256 hash → hash to bytes32 → store on blockchain → metadata to MongoDB.
- Verify: Fetch metadata → download from IPFS → recompute hash → compare to on-chain hash → mark Verified/Tampered.
- Why secure: IPFS is content-addressed; blockchain is immutable; hash check detects any change.

## 7) Using deployment/tx hashes
- Deployment tx hash: proves when/where the contract was deployed (view on Etherscan).
- Evidence tx hash: shows when evidence was recorded; includes `EvidenceAdded` event log.
- You can share tx links as proof of record time and integrity.

## 8) If you see “Verified” in the app
- Means current file hash (from IPFS) == on-chain original hash.
- You can cross-check on Etherscan: Events → EvidenceAdded → compare hash; Read Contract → getOriginalHash(evidenceId).

## 9) If you see “Tampered”
- Means hashes differ. File content was changed or wrong CID used.
- Action: Re-upload correct file, or investigate mismatch.

## 10) Quick commands
- Deploy: `npm run deploy:sepolia`
- Verify: `npm run verify`
- Check balance: `node check_balance.js`
- Test RPCs: `node test_rpc_connection.js`

## 11) If Sepolia RPC times out
- Switch to public RPC in `blockchain/.env`:
  ```
  SEPOLIA_RPC_URL=https://rpc.sepolia.org
  ```
  Then retry `npm run deploy:sepolia`.

## 12) Minimal talking points (mentor-ready)
- We store files on IPFS, and store their hashes on Ethereum Sepolia for immutability.
- Verification = recompute hash from IPFS file and compare to on-chain hash.
- Events and transactions are visible on Etherscan; hashes are your proof of integrity.
- A “Verified” badge means the file is unchanged; “Tampered” means content changed.


