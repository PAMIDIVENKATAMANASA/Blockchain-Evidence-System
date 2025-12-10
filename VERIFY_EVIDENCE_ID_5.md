# Verify Evidence ID 5 on Etherscan - Complete Guide

## 📋 Your Contract Information

- **Contract Address**: `0x0dB616520F416fae0968E7e50c807DD3D176D99e`
- **Evidence ID**: 5
- **Network**: Sepolia Testnet

---

## 🚀 Method 1: Via Transaction Hash (Fastest - 2 minutes)

### Step 1: Get Transaction Hash from Your App

From your MongoDB or app, get the transaction hash for Evidence ID 5.

**Or check MongoDB:**
```bash
mongosh "mongodb+srv://..." --eval 'db.evidences.findOne({evidenceId: 5}, {blockchainHash: 1})'
```

### Step 2: Open Transaction on Etherscan

1. **Go to Sepolia Etherscan:**
   ```
   https://sepolia.etherscan.io/
   ```

2. **Paste transaction hash** in search box (from your app/MongoDB)

3. **Press Enter**

### Step 3: View Event Logs

1. **Scroll down** to **"Logs"** section
2. **Click on "EvidenceAdded" event**
3. **View details:**
   - evidenceId: 5
   - hash: Your blockchain hash
   - collector: Officer address
   - timestamp: When added

**✅ If hash matches your app → Evidence is verified!**

---

## 🔍 Method 2: Via Contract Address (Most Complete)

### Step 1: Open Contract Page

**Direct link:**
```
https://sepolia.etherscan.io/address/0x0dB616520F416fae0968E7e50c807DD3D176D99e
```

Or:
1. Go to: `https://sepolia.etherscan.io/`
2. Paste: `0x0dB616520F416fae0968E7e50c807DD3D176D99e`
3. Press Enter

### Step 2: View Events Tab

1. **Click "Events" tab** (top navigation)
2. **Filter by "EvidenceAdded"** (if filter available)
3. **Find event with evidenceId = 5**
4. **Click on the event**

**What you'll see:**
```
Event: EvidenceAdded
- evidenceId: 5
- hash: 0x... (your blockchain hash)
- collector: 0x... (officer address)
- timestamp: [block timestamp]
```

### Step 3: Use Read Contract Tab

1. **Click "Read Contract" tab**
2. **Scroll to find `getOriginalHash` function**
3. **Enter evidence ID**: `5`
4. **Click "Query" button**

**Output:**
```
hash: 0x... (your blockchain hash)
collector: 0x... (officer address)
timestamp: [timestamp number]
exists: true
```

### Step 4: Compare with Your App

**From your app, you have:**
- Evidence ID: 5
- Blockchain Hash: `0xc0a6f0db6b19bc69d0cbffe9548c0f2fc82cabef626179e45b131d557b05cbbd`
- IPFS Hash: `QmWyz1p8FKo5wUhD6XGW11QUjCoAwb1gtWVx74WdKAg3p8`

**From Etherscan, verify:**
- ✅ Hash matches: `0xc0a6f0db...` (should match exactly)
- ✅ Evidence ID = 5
- ✅ Collector address matches officer
- ✅ Timestamp is reasonable

**If all match → Evidence is authentic and not tampered!** ✅

---

## 💻 Method 3: Command Line Verification

### Step 1: Open Hardhat Console

```bash
cd blockchain
npx hardhat console --network sepolia
```

### Step 2: Get Evidence Details

```javascript
// Load contract
const data = require("./deployment.json")
const ChainOfCustody = await ethers.getContractFactory("ChainOfCustody")
const coc = await ChainOfCustody.attach(data.contractAddress)

// Get Evidence ID 5
const evidence = await coc.getOriginalHash(5)
console.log("\n=== Evidence ID 5 Details ===")
console.log("Hash:", evidence.hash)
console.log("Collector:", evidence.collector)
console.log("Timestamp:", new Date(parseInt(evidence.timestamp) * 1000))
console.log("Exists:", evidence.exists)
```

### Step 3: Compare Hash

**Compare `evidence.hash` with your app's blockchain hash:**
- Your app hash: `0xc0a6f0db6b19bc69d0cbffe9548c0f2fc82cabef626179e45b131d557b05cbbd`
- Blockchain hash: Should match exactly ✅

### Step 4: Get Transaction Hash

```javascript
// Get total count
const count = await coc.getEvidenceCount()
console.log("\nTotal evidence:", count.toString())

// Get transaction hash for evidence 5 (from events)
// You can also check MongoDB for the transaction hash
```

---

## 📊 Complete Verification Checklist

### ✅ Step-by-Step Verification

1. **Open Contract on Etherscan**
   - [ ] Go to: `https://sepolia.etherscan.io/address/0x0dB616520F416fae0968E7e50c807DD3D176D99e`
   - [ ] Page loads successfully

2. **Check Events**
   - [ ] Click "Events" tab
   - [ ] Find EvidenceAdded event with evidenceId = 5
   - [ ] Hash matches: `0xc0a6f0db...`

3. **Query Contract**
   - [ ] Click "Read Contract" tab
   - [ ] Query `getOriginalHash(5)`
   - [ ] Hash matches your app ✅
   - [ ] Collector matches officer ✅
   - [ ] exists = true ✅

4. **Compare Details**
   - [ ] Evidence ID = 5 ✅
   - [ ] Blockchain hash matches ✅
   - [ ] Collector address matches ✅
   - [ ] Timestamp is correct ✅

---

## 🔗 Quick Links

**Your Contract:**
```
https://sepolia.etherscan.io/address/0x0dB616520F416fae0968E7e50c807DD3D176D99e
```

**Contract Events:**
```
https://sepolia.etherscan.io/address/0x0dB616520F416fae0968E7e50c807DD3D176D99e#events
```

**Read Contract:**
```
https://sepolia.etherscan.io/address/0x0dB616520F416fae0968E7e50c807DD3D176D99e#readContract
```

**Transactions:**
```
https://sepolia.etherscan.io/address/0x0dB616520F416fae0968E7e50c807DD3D176D99e#txs
```

---

## 📝 Get Transaction Hash from MongoDB

If you need the transaction hash:

```bash
mongosh "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/trustchain" --eval 'db.evidences.findOne({evidenceId: 5}, {blockchainHash: 1, evidenceId: 1, fileName: 1}).pretty()'
```

Then use that transaction hash:
```
https://sepolia.etherscan.io/tx/YOUR_TRANSACTION_HASH
```

---

## ✅ Expected Results

### On Etherscan Events Tab:

```
Event: EvidenceAdded
- evidenceId: 5
- hash: 0xc0a6f0db6b19bc69d0cbffe9548c0f2fc82cabef626179e45b131d557b05cbbd
- collector: 0x... (officer address)
- timestamp: [block timestamp]
```

### On Read Contract Tab:

```
getOriginalHash(5):
- hash: 0xc0a6f0db6b19bc69d0cbffe9548c0f2fc82cabef626179e45b131d557b05cbbd
- collector: 0x... (officer address)
- timestamp: [timestamp]
- exists: true
```

### Verification Result:

**If hash matches:**
- ✅ Evidence ID 5 is recorded on blockchain
- ✅ Hash matches (not tampered)
- ✅ Evidence is authentic

**If hash doesn't match:**
- ❌ Evidence may have been tampered
- ❌ Check if you're looking at correct evidence ID
- ❌ Verify transaction hash is correct

---

## 🎯 Quick Summary

**Fastest way to verify:**

1. **Open contract**: `https://sepolia.etherscan.io/address/0x0dB616520F416fae0968E7e50c807DD3D176D99e`
2. **Click "Events" tab**
3. **Find EvidenceAdded with evidenceId = 5**
4. **Verify hash matches**: `0xc0a6f0db...` ✅

**Or use Read Contract:**

1. **Click "Read Contract" tab**
2. **Query `getOriginalHash(5)`**
3. **Compare hash with your app** ✅

---

**Follow these steps to verify Evidence ID 5 on Etherscan!** 🎉

