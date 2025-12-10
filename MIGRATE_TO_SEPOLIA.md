# Migrate TrustChain to Sepolia Testnet (Public Explorer Compatible)

This guide moves the smart contract deployment from local Hardhat to the public Sepolia Ethereum test network so transactions and contracts are visible on Etherscan.

## Prerequisites
- Node.js and npm installed
- Hardhat deps already installed in `blockchain/`
- Testnet wallet funded with Sepolia ETH (use a faucet)
- API keys:
  - RPC provider (Alchemy or Infura) for Sepolia
  - Etherscan API key (for verification)

## 1) Configure Environment

Create an env file for Hardhat (do **not** commit keys):

Path: `blockchain/.env` (example values below)
```
ALCHEMY_SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
# or:
# SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY

# Use a fresh, funded Sepolia wallet; include 0x prefix
SEPOLIA_PRIVATE_KEY=0xYOUR_PRIVATE_KEY

# For Etherscan verification
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_KEY
```

Template provided: `blockchain/SEPOLIA_ENV_TEMPLATE.txt`

## 2) Verify Hardhat Config

`blockchain/hardhat.config.js` now includes:
- `networks.sepolia` using `ALCHEMY_SEPOLIA_URL` or `SEPOLIA_RPC_URL`
- `etherscan.apiKey` using `ETHERSCAN_API_KEY`

No further code changes needed.

## 3) Deploy to Sepolia

From `blockchain/`:
```bash
npm install        # if not already
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

Note the deployed contract address and transaction hash printed by the script.

## 4) Update Server to Use Sepolia

Set these in `server/.env`:
```
BLOCKCHAIN_RPC_URL=<same as ALCHEMY_SEPOLIA_URL or SEPOLIA_RPC_URL>
PRIVATE_KEY=<same deployer key or another signer key>
```

Copy the new `deployment.json` (produced in `blockchain/`) so the server points to the Sepolia contract address.

## 5) Verify on Etherscan

From `blockchain/`:
```bash
# Replace <ADDRESS> with your deployed contract
npx hardhat verify --network sepolia <ADDRESS>
```

The ChainOfCustody contract has **no constructor arguments**, so no extra params are needed.

After verification, view the contract at:
```
https://sepolia.etherscan.io/address/<ADDRESS>#code
```

## 6) View Transactions on Explorer
- Contract address: `https://sepolia.etherscan.io/address/<ADDRESS>`
- Transactions: `https://sepolia.etherscan.io/address/<ADDRESS>#tokentxns` (or normal tx tab)
- Events: check the “Events” tab; look for `EvidenceAdded` logs.

## 7) Re-point the Frontend (if needed)
- Ensure the frontend or any scripts that call the backend use the backend that has `BLOCKCHAIN_RPC_URL` set to Sepolia.
- If the frontend connects directly with ethers.js, update its RPC/provider to Sepolia as well.

## 8) Checklist
- [ ] Sepolia RPC URL in `blockchain/.env`
- [ ] Sepolia private key in `blockchain/.env` (funded testnet wallet)
- [ ] Etherscan API key in `blockchain/.env`
- [ ] Deployed with `--network sepolia`
- [ ] New `deployment.json` copied/used by server
- [ ] Server `BLOCKCHAIN_RPC_URL` points to Sepolia
- [ ] Contract verified on Etherscan
- [ ] Confirmed transactions visible on Sepolia Etherscan

## 9) Troubleshooting
- **Insufficient funds**: Ensure the deployer wallet has Sepolia ETH (use faucet).
- **RPC errors**: Check the correct RPC URL and that the key is valid.
- **Verification failed**: Re-run `hardhat verify` ensuring the exact same bytecode (no code changes after deploy) and correct address/network/API key.
- **Server still hitting localhost**: Update `BLOCKCHAIN_RPC_URL` in `server/.env`, restart the server.


