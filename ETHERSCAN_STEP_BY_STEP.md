# Step-by-Step Guide: Check Your Contract on Etherscan (Sepolia)

## 📋 Prerequisites

✅ Contract deployed to Sepolia  
✅ Transaction hash from deployment  
✅ Contract address saved

---

## 🔍 Step 1: Find Your Contract Address

### Method A: From Deployment Output

When you deployed, you should have seen:
```
ChainOfCustody deployed to: 0x...
Contract on Etherscan: https://sepolia.etherscan.io/address/0x...
```

**Copy the contract address** (the part after "deployed to:")

### Method B: From deployment.json File

```bash
cd blockchain
cat deployment.json
```

Look for `"contractAddress": "0x..."` - that's your contract address.

### Method C: From Transaction Hash

1. Get your deployment transaction hash
2. Go to: `https://sepolia.etherscan.io/tx/YOUR_TX_HASH`
3. On the transaction page, click on the "To" address (it will say "Contract Creation")
4. This takes you to your contract address page

---

## 🌐 Step 2: Open Etherscan

1. **Go to Sepolia Etherscan:**
   ```
   https://sepolia.etherscan.io/
   ```

2. **In the search box** (top of the page), paste your contract address:
   ```
   0xYourContractAddress...
   ```

3. **Press Enter** or click the search icon

---

## 📊 Step 3: View Contract Overview

On the contract page, you'll see several tabs. Here's what each shows:

### Overview Tab (Default)

**What you'll see:**
- **Contract Address**: Your deployed contract address
- **Creator**: Address that deployed the contract (yours)
- **Transaction**: Link to deployment transaction
- **Balance**: Any Sepolia ETH in the contract (usually 0)
- **Contract**: Shows "Contract" (if verified) or "Contract Creation" (if not verified)

**Key information:**
- ✅ **Creator** = Your deployer address
- ✅ **Transaction** = Click to see deployment transaction details

---

## ✅ Step 4: Verify Contract (If Not Verified)

### Check if Verified

Look at the **Code** tab:
- **If verified**: You'll see source code
- **If NOT verified**: You'll see "Contract Source Code Not Verified"

### Verify Your Contract

**Method 1: Using Script (Easiest)**

```bash
cd blockchain
npm run verify
```

**Method 2: Manual on Etherscan**

1. Go to your contract address page
2. Click **"Contract"** tab
3. Click **"Verify and Publish"** button
4. Fill in:
   - **Compiler Type**: Solidity (Single file)
   - **Compiler Version**: `0.8.19`
   - **License**: MIT
   - **Source Code**: Copy from `contracts/ChainOfCustody.sol`
5. Click **"Verify and Publish"**

**After verification:**
- ✅ You'll see green checkmark
- ✅ Source code will be visible
- ✅ "Read Contract" and "Write Contract" tabs will be available

---

## 📜 Step 5: View Contract Code (After Verification)

1. Click **"Code"** tab
2. You'll see:
   - **Contract Source Code**: Full Solidity code
   - **Contract ABI**: JSON interface
   - **Constructor Arguments**: Empty (no constructor)
   - **Swarm Source**: IPFS hash (if available)

**Verify it's your code:**
- Check function names match: `addEvidence`, `getOriginalHash`, etc.
- Check it says "ChainOfCustody"

---

## 📖 Step 6: Read Contract Data

1. Click **"Read Contract"** tab
2. You can query contract functions:

### Check Evidence Count

1. Find **`getEvidenceCount`** function
2. Click **"Query"** button
3. See total number of evidence items

**Example output:**
```
5
```
(Means 5 evidence items have been added)

### View Specific Evidence

1. Find **`getOriginalHash`** function
2. Enter evidence ID (e.g., `5`)
3. Click **"Query"**
4. See:
   - **hash**: Blockchain hash (bytes32)
   - **collector**: Officer address
   - **timestamp**: When evidence was added
   - **exists**: true/false

**Example:**
```
hash: 0xc0a6f0db6b19bc69d0cbffe9548c0f2fc82cabef626179e45b131d557b05cbbd
collector: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
timestamp: 1736162785
exists: true
```

### Check Contract Owner

1. Find **`owner`** function
2. Click **"Query"**
3. See deployer address (contract owner)

### Check if Address is Judge

1. Find **`isJudge`** function
2. Enter an address
3. Click **"Query"**
4. See: true or false

---

## 📊 Step 7: View Transactions

1. Click **"Transactions"** tab
2. You'll see all transactions to/from the contract

### Types of Transactions:

**1. Contract Creation (Deployment)**
- **From**: Your deployer address
- **To**: "Contract Creation"
- **Value**: 0 ETH
- **Status**: ✅ Success

**2. Function Calls (Evidence Added)**
- **From**: Officer address or your server
- **To**: Your contract address
- **Function**: `addEvidence(...)`
- **Status**: ✅ Success

### View Transaction Details:

Click on any transaction hash to see:
- **Transaction Hash**: Unique ID
- **Status**: Success ✅ or Failed ❌
- **Block**: Block number where it was mined
- **From**: Sender address
- **To**: Contract address
- **Gas Used**: Amount of gas consumed
- **Transaction Fee**: Cost in Sepolia ETH

---

## 📝 Step 8: View Events

1. Click **"Events"** tab
2. You'll see all events emitted by the contract

### Event Types:

**1. EvidenceAdded**
- Triggered when evidence is uploaded
- Shows:
  - **evidenceId**: Evidence ID (e.g., 5)
  - **hash**: Blockchain hash
  - **collector**: Officer address
  - **timestamp**: When added

**2. JudgeGranted**
- Triggered when judge privileges are granted
- Shows judge address

**3. LawyerGranted**
- Triggered when lawyer privileges are granted
- Shows lawyer address

### View Event Details:

1. Click on any event
2. See detailed information:
   - **Event Name**: e.g., "EvidenceAdded"
   - **Parameters**: All event parameters
   - **Transaction Hash**: Link to transaction
   - **Block Number**: Where it was recorded

### Find Specific Evidence:

1. Go to **"Events"** tab
2. Click **"Filter"** button
3. Select **"EvidenceAdded"** event
4. Click **"Apply"**
5. See only evidence addition events

---

## 🔗 Step 9: View Specific Evidence Transaction

From your app, you have:
- **Evidence ID**: 5
- **Blockchain Hash**: `0xc0a6f0db6b19bc69d0cbffe9548c0f2fc82cabef626179e45b131d557b05cbbd`

### Method 1: From Events

1. Go to contract address page
2. Click **"Events"** tab
3. Find **EvidenceAdded** event with evidenceId = 5
4. Click on the event
5. Click on **Transaction Hash**
6. See full transaction details

### Method 2: Search Transaction Hash

If you have the transaction hash from MongoDB or API:

1. Go to: `https://sepolia.etherscan.io/tx/YOUR_TX_HASH`
2. View transaction details
3. Click **"Logs"** tab to see events

---

## 🎯 Step 10: Verify Evidence on Blockchain

### Check Evidence Hash Matches:

1. Go to contract address page
2. Click **"Read Contract"** tab
3. Find **`getOriginalHash`** function
4. Enter evidence ID: **5**
5. Click **"Query"**
6. Compare the hash:
   - **Hash from blockchain**: `0xc0a6f0db6b19bc69d0cbffe9548c0f2fc82cabef626179e45b131d557b05cbbd`
   - **Hash from your app**: Should match!

**If hashes match:**
- ✅ Evidence is authentic
- ✅ Not tampered

**If hashes don't match:**
- ❌ Evidence has been tampered

---

## 📱 Step 11: View on Mobile

Etherscan is mobile-friendly:

1. Open browser on phone
2. Go to: `https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS`
3. Same interface, optimized for mobile

---

## 🔍 Quick Reference: What to Check

### ✅ Contract Verification Checklist:

- [ ] Contract address is correct
- [ ] Contract is verified (green checkmark)
- [ ] Source code is visible
- [ ] Owner address matches your deployer
- [ ] Can query contract functions

### ✅ Evidence Verification Checklist:

- [ ] EvidenceAdded events are visible
- [ ] Evidence ID matches your app
- [ ] Hash from blockchain matches app hash
- [ ] Collector address is correct
- [ ] Timestamp makes sense

---

## 📊 Example: Your Evidence ID 5

Based on your app showing Evidence ID 5:

### Step-by-Step:

1. **Go to contract address page**
   ```
   https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS
   ```

2. **Click "Events" tab**

3. **Find EvidenceAdded event with evidenceId = 5**
   - Look for event showing:
     - `evidenceId: 5`
     - `hash: 0xc0a6f0db...`

4. **Click on the event**

5. **Verify hash matches:**
   - Blockchain hash: `0xc0a6f0db6b19bc69d0cbffe9548c0f2fc82cabef626179e45b131d557b05cbbd`
   - Should match your app's blockchain hash ✅

6. **Click "Read Contract" tab**

7. **Query `getOriginalHash(5)`**
   - Enter: `5`
   - Click "Query"
   - Verify hash matches ✅

---

## 🆘 Troubleshooting

### Problem: Can't find contract

**Solution:**
- Make sure you're on Sepolia Etherscan: `https://sepolia.etherscan.io/`
- Check contract address is correct (starts with 0x)
- Verify contract was deployed successfully

### Problem: Contract not verified

**Solution:**
- Run: `npm run verify` in blockchain directory
- Or verify manually on Etherscan (see Step 4)

### Problem: No events showing

**Solution:**
- Wait a few minutes (sometimes events take time to index)
- Check if transactions were successful
- Refresh the page

### Problem: Can't query functions

**Solution:**
- Contract must be verified first
- Use "Read Contract" tab (not "Write Contract")
- Make sure you're entering correct parameter types

---

## 📝 Summary: Quick Steps

1. **Find contract address**: Check `deployment.json` or deployment output
2. **Go to Etherscan**: `https://sepolia.etherscan.io/`
3. **Search contract address**: Paste in search box
4. **View contract**: See overview, code, transactions, events
5. **Verify contract**: Run `npm run verify` or verify manually
6. **Check evidence**: Use "Read Contract" tab → `getOriginalHash`
7. **View events**: Click "Events" tab → Find "EvidenceAdded"

---

## 🔗 Important Links

- **Sepolia Etherscan**: https://sepolia.etherscan.io/
- **Your Contract**: `https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS`
- **Transactions**: `https://sepolia.etherscan.io/tx/YOUR_TX_HASH`

---

**Follow these steps to check everything on Etherscan!** 🎉

