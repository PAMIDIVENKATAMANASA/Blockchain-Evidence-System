# Complete Guide: Viewing and Verifying Contracts on Etherscan (Sepolia)

This guide shows you how to deploy your TrustChain contract to Sepolia testnet and view/verify it on Etherscan.

## 📋 Prerequisites

✅ Sepolia ETH in your wallet (get free testnet ETH from faucets)  
✅ Environment variables configured  
✅ Contract deployed to Sepolia

---

## 🚀 Step 1: Deploy Contract to Sepolia

### Configure Environment

Your `.env` file in `blockchain/` should have:
```bash
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/7131a74d24af420298d28095445bef38
SEPOLIA_PRIVATE_KEY=0x6f1c58178a7ec68531d13b950a58a7d6c553633759fd9f53310be3982398ee67
ETHERSCAN_API_KEY=Z8AKGG8BWFRYSQHTT88UVW247EIZJ3FE5I
```

### Deploy

```bash
cd blockchain
npm install  # If not already done

# Compile contract
npx hardhat compile

# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia

# Or use npm script
npm run deploy:sepolia
```

### Expected Output

```
ChainOfCustody deployed to: 0xYourContractAddress...
Contract owner: 0xYourDeployerAddress...
Deployer address: 0xYourDeployerAddress...
Transaction hash: 0xYourTxHash...
View on Etherscan: https://sepolia.etherscan.io/tx/0xYourTxHash...
Contract on Etherscan: https://sepolia.etherscan.io/address/0xYourContractAddress...
Deployment info saved to deployment.json
```

**📝 Note the contract address and transaction hash!**

---

## 🔍 Step 2: View Contract on Etherscan

### Method 1: Via Deployment Output

After deployment, you'll see links like:
```
View on Etherscan: https://sepolia.etherscan.io/tx/0xYourTxHash...
Contract on Etherscan: https://sepolia.etherscan.io/address/0xYourContractAddress...
```

Click these links or copy them to your browser.

### Method 2: Manual Search

1. Go to **Sepolia Etherscan**: https://sepolia.etherscan.io/
2. Enter your **contract address** in the search box
3. Click "Search"

### What You'll See on Contract Page

#### 📊 Contract Overview Tab

- **Contract Address**: Your deployed contract address
- **Creator**: Deployer address
- **Transaction Hash**: Deployment transaction
- **Balance**: Sepolia ETH balance (if any)
- **Contract**: Shows "Contract" if verified, "Contract Creation" if not

#### 📝 Code Tab (Before Verification)

Before verification, you'll see:
```
This contract is not verified on Etherscan. Verify and Publish your contract source code to enable this feature.
```

#### ✅ Code Tab (After Verification)

After verification, you'll see:
- **Contract Source Code**: Full Solidity code
- **Contract ABI**: JSON ABI
- **Contract Creation Code**: Bytecode used for deployment
- **Constructor Arguments**: Empty (no constructor args)

#### 📜 Read Contract Tab

Interact with contract functions (read-only):
- `evidenceCounter()` - Get total evidence count
- `evidenceRecords(uint256)` - Get evidence by ID
- `getOriginalHash(uint256)` - Get evidence hash
- `getEvidenceCount()` - Get total count
- `owner()` - Get contract owner
- `isJudge(address)` - Check if address is judge
- `isLawyer(address)` - Check if address is lawyer

#### ✏️ Write Contract Tab

Call contract functions (requires wallet connection):
- `addEvidence(bytes32,address)` - Add evidence
- `grantJudge(address)` - Grant judge (owner only)
- `grantLawyer(address)` - Grant lawyer (owner only)

#### 📊 Events Tab

View contract events:
- **EvidenceAdded**: When evidence is added
- **JudgeGranted**: When judge is granted
- **LawyerGranted**: When lawyer is granted

---

## ✅ Step 3: Verify Contract on Etherscan

### Why Verify?

Verification enables:
- ✅ View contract source code on Etherscan
- ✅ Interact with contract via UI
- ✅ Verify contract authenticity
- ✅ Build trust with users

### Method 1: Using Verification Script (Recommended)

```bash
cd blockchain
npm run verify
```

Or directly:
```bash
npx hardhat run scripts/verify.js --network sepolia
```

### Method 2: Manual Verification

1. **Go to Contract Page** on Etherscan
2. Click **"Contract"** tab
3. Click **"Verify and Publish"**
4. Fill in details:
   - **Compiler Type**: Solidity (Single file) or Standard JSON Input
   - **Compiler Version**: `0.8.19` (check in hardhat.config.js)
   - **License**: MIT
   - **Source Code**: Copy from `contracts/ChainOfCustody.sol`
5. Click **"Verify and Publish"**

### Method 3: Using Hardhat Verify Plugin

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

Example:
```bash
npx hardhat verify --network sepolia 0xYourContractAddress
```

### Expected Output

```
Verifying contract at: 0xYourContractAddress
Network: sepolia
Successfully submitted source code for contract
contracts/ChainOfCustody.sol:ChainOfCustody at 0xYourContractAddress
for verification on the block explorer. Waiting for verification result...

Successfully verified contract ChainOfCustody on Etherscan.
https://sepolia.etherscan.io/address/0xYourContractAddress#code
```

---

## 📊 Step 4: View Transactions and Events

### View Deployment Transaction

1. Click on the **transaction hash** from deployment
2. Or go to: `https://sepolia.etherscan.io/tx/YOUR_TX_HASH`

**Transaction Details:**
- **Status**: Success ✅
- **From**: Your deployer address
- **To**: Contract address (or "Contract Creation")
- **Gas Used**: Gas consumed
- **Transaction Fee**: Cost in Sepolia ETH

### View Contract Events

1. Go to your **contract address** page
2. Click **"Events"** tab
3. View all events emitted by the contract

**When Evidence is Added:**
```
Event: EvidenceAdded
- evidenceId: 1
- hash: 0x7f8a9b2c...
- collector: 0xAddress...
- timestamp: 1234567890
```

**When Judge is Granted:**
```
Event: JudgeGranted
- judge: 0xAddress...
```

---

## 🔍 Step 5: Check Evidence Transactions

### After Uploading Evidence (via your app)

1. **Get Transaction Hash** from your MongoDB or API response
2. **Search on Etherscan**: https://sepolia.etherscan.io/tx/YOUR_TX_HASH

### View Evidence Events

1. Go to **contract address** page
2. Click **"Events"** tab
3. Filter by **"EvidenceAdded"**
4. Click on any event to see details:
   - Evidence ID
   - Hash (stored on blockchain)
   - Collector address
   - Timestamp

### View Evidence on Contract

1. Go to **contract address** page
2. Click **"Read Contract"** tab
3. Use `getOriginalHash(uint256)` function:
   - Enter evidence ID (e.g., 1)
   - Click "Query"
   - View: hash, collector, timestamp, exists

---

## 📱 Step 6: Update Server Configuration

After deploying to Sepolia, update your server to use Sepolia:

### Update `server/.env`:

```bash
# Update RPC URL to Sepolia
BLOCKCHAIN_RPC_URL=https://sepolia.infura.io/v3/7131a74d24af420298d28095445bef38

# Use same private key (or different one)
PRIVATE_KEY=0x6f1c58178a7ec68531d13b950a58a7d6c553633759fd9f53310be3982398ee67
```

### Restart Server

```bash
cd server
npm start
```

The server will now use the Sepolia network and your deployed contract.

---

## 🔗 Quick Links Reference

### Sepolia Etherscan
- **Main**: https://sepolia.etherscan.io/
- **Your Contract**: `https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS`
- **Transaction**: `https://sepolia.etherscan.io/tx/YOUR_TX_HASH`

### Testnet Faucets (Get Free Sepolia ETH)
- **Alchemy Faucet**: https://sepoliafaucet.com/
- **Infura Faucet**: https://www.infura.io/faucet/sepolia
- **PoW Faucet**: https://sepolia-faucet.pk910.de/

---

## 📋 Checklist

### Deployment
- [ ] Environment variables configured
- [ ] Contract compiled successfully
- [ ] Contract deployed to Sepolia
- [ ] Contract address saved to `deployment.json`
- [ ] Transaction hash noted

### Verification
- [ ] Contract verified on Etherscan
- [ ] Source code visible on Etherscan
- [ ] ABI accessible
- [ ] Contract functions visible in "Read Contract" tab

### Configuration
- [ ] Server `.env` updated with Sepolia RPC URL
- [ ] Server `.env` updated with contract address (if needed)
- [ ] Server restarted

### Testing
- [ ] Can view contract on Etherscan
- [ ] Can view deployment transaction
- [ ] Can read contract functions
- [ ] Can view events after uploading evidence

---

## 🧪 Example Workflow

### 1. Deploy Contract

```bash
cd blockchain
npm run deploy:sepolia
```

Output:
```
ChainOfCustody deployed to: 0x1234...5678
View on Etherscan: https://sepolia.etherscan.io/address/0x1234...5678
```

### 2. Verify Contract

```bash
npm run verify
```

Output:
```
✅ Contract verified successfully!
View on Etherscan: https://sepolia.etherscan.io/address/0x1234...5678#code
```

### 3. View on Etherscan

1. Open: https://sepolia.etherscan.io/address/0x1234...5678
2. Check **"Code"** tab - should show source code ✅
3. Check **"Read Contract"** tab - can query functions ✅

### 4. Upload Evidence (via your app)

1. Login as Officer
2. Upload evidence file
3. Note the transaction hash from response

### 5. View Evidence Transaction

1. Go to: `https://sepolia.etherscan.io/tx/YOUR_TX_HASH`
2. View transaction details
3. Click **"Logs"** tab to see `EvidenceAdded` event

### 6. View Evidence on Contract

1. Go to contract address page
2. Click **"Events"** tab
3. Find `EvidenceAdded` event
4. Click on event to see evidence details

---

## 🆘 Troubleshooting

### Problem: "Contract not verified"

**Solution:**
- Run verification script: `npm run verify`
- Or manually verify on Etherscan

### Problem: "Insufficient funds"

**Solution:**
- Get free Sepolia ETH from faucets
- Ensure deployer wallet has enough ETH for gas

### Problem: "Contract deployment failed"

**Solution:**
- Check RPC URL is correct
- Check private key is correct
- Check wallet has Sepolia ETH
- Check network is Sepolia (chainId: 11155111)

### Problem: "Verification failed"

**Solution:**
- Check compiler version matches (0.8.19)
- Check contract source code matches
- Check constructor arguments (should be empty)
- Try manual verification on Etherscan

---

## 📝 Quick Reference Commands

```bash
# Deploy to Sepolia
cd blockchain
npm run deploy:sepolia

# Verify on Etherscan
npm run verify

# View deployment info
cat deployment.json

# Check contract on Etherscan
# Visit: https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS
```

---

**Your contract is now on Sepolia and viewable on Etherscan!** 🎉

