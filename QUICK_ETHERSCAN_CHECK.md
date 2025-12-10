# Quick Guide: How to Check Your Contract on Etherscan

## 🚀 Quick Start

### 1. Deploy Contract

```bash
cd blockchain
npm run deploy:sepolia
```

**Copy the contract address and transaction hash from output!**

### 2. Verify Contract

```bash
npm run verify
```

### 3. View on Etherscan

Open in browser:
```
https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS
```

---

## 📍 Where to Find Things on Etherscan

### Contract Page Overview

**URL**: `https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS`

**Tabs to Check:**

1. **📊 Overview**
   - Contract address
   - Creator (deployer)
   - Transaction count
   - Balance

2. **✅ Code** (After Verification)
   - Full source code
   - Contract ABI
   - Verified ✅ badge

3. **📜 Read Contract**
   - Query contract functions
   - View evidence data
   - Check evidence count

4. **✏️ Write Contract**
   - Interact with contract
   - Requires wallet connection
   - Can call functions like `addEvidence`

5. **📊 Events**
   - All contract events
   - `EvidenceAdded` events
   - `JudgeGranted` events
   - Filterable by event type

6. **📝 Transactions**
   - All transactions to/from contract
   - Deployment transaction
   - Function calls

---

## 🔍 What to Look For

### ✅ Contract Verified

- Code tab shows source code
- Green "Contract" badge
- "Read Contract" tab available

### 📊 Evidence Added

1. Go to **Events** tab
2. Look for **EvidenceAdded** events
3. Click event to see:
   - Evidence ID
   - Hash stored on blockchain
   - Collector address
   - Timestamp

### 🔗 View Specific Transaction

```
https://sepolia.etherscan.io/tx/YOUR_TRANSACTION_HASH
```

Shows:
- Transaction status (Success/Failed)
- Gas used
- Events emitted
- Input data

---

## 📋 Quick Checklist

- [ ] Contract deployed ✅
- [ ] Contract verified ✅
- [ ] Can view source code ✅
- [ ] Can view events ✅
- [ ] Can query contract functions ✅

---

**For detailed guide, see `ETHERSCAN_GUIDE.md`** 📚

