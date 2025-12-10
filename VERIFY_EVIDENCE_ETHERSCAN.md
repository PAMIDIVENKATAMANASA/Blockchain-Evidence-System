# Step-by-Step: Verify Evidence ID 5 on Etherscan

## 📋 What You Have

From your terminal output:
- **Transaction Hash**: `0x3080e0f285eae82b33edaa41f7ad14c7819def33058cb7e1bd1d1edf98318f55`
- **Contract Address**: `0x5fbdb2315678afecb367f032d93f642f64180aa3`
- **From Address**: `0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266`
- **Block Number**: 5
- **Evidence ID**: 5

---

## 🚀 Method 1: Verify via Transaction Hash (Easiest)

### Step 1: Open Transaction on Etherscan

1. **Go to Sepolia Etherscan:**
   ```
   https://sepolia.etherscan.io/
   ```

2. **Paste your transaction hash in search box:**
   ```
   0x3080e0f285eae82b33edaa41f7ad14c7819def33058cb7e1bd1d1edf98318f55
   ```

3. **Press Enter** or click search icon

### Step 2: View Transaction Details

**What you'll see:**
- ✅ **Status**: Success (green checkmark)
- **From**: `0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266`
- **To**: `0x5fbdb2315678afecb367f032d93f642f64180aa3` (your contract)
- **Value**: 0 ETH
- **Gas Used**: 118562
- **Block**: 5

### Step 3: View Event Logs

1. **Scroll down** to **"Logs"** section
2. **Click on the log entry** (should show "EvidenceAdded" event)
3. **View event details:**
   - **Event Name**: `EvidenceAdded`
   - **Topics**: 
     - Topic[0]: Event signature
     - Topic[1]: evidenceId (5)
     - Topic[2]: hash (bytes32)
     - Topic[3]: collector address
   - **Data**: Additional event data

**You'll see:**
```
Event: EvidenceAdded
- evidenceId: 5
- hash: 0x... (your blockchain hash)
- collector: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
- timestamp: [block timestamp]
```

### Step 4: Verify Hash Matches

Compare the hash from Etherscan with your app:
- **Etherscan hash**: From event log
- **Your app hash**: Should match exactly ✅

---

## 🔍 Method 2: Verify via Contract Address

### Step 1: Open Contract Page

1. **Go to Sepolia Etherscan:**
   ```
   https://sepolia.etherscan.io/
   ```

2. **Paste contract address:**
   ```
   0x5fbdb2315678afecb367f032d93f642f64180aa3
   ```

3. **Press Enter**

### Step 2: View Events Tab

1. **Click "Events" tab** (top navigation)
2. **Find "EvidenceAdded" events**
3. **Look for evidenceId = 5**
4. **Click on the event** to see details

**What you'll see:**
- Evidence ID: 5
- Hash: `0x...` (your blockchain hash)
- Collector: Officer address
- Timestamp: When it was added

### Step 3: Use Read Contract Tab

1. **Click "Read Contract" tab**
2. **Find `getOriginalHash` function**
3. **Enter evidence ID**: `5`
4. **Click "Query" button**

**You'll see:**
```
hash: 0x... (your blockchain hash)
collector: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
timestamp: [timestamp]
exists: true
```

### Step 4: Verify All Details Match

Compare with your app:
- ✅ **Evidence ID**: Should be 5
- ✅ **Hash**: Should match blockchain hash from your app
- ✅ **Collector**: Should match officer address
- ✅ **Timestamp**: Should match upload time

---

## 💻 Method 3: Verify via Command Line

### Step 1: Get Evidence Count

```bash
cd blockchain
npx hardhat console --network sepolia
```

Then in console:
```javascript
const data = require("./deployment.json")
const ChainOfCustody = await ethers.getContractFactory("ChainOfCustody")
const coc = await ChainOfCustody.attach(data.contractAddress)

// Get total evidence count
const count = await coc.getEvidenceCount()
console.log("Total evidence:", count.toString())
```

### Step 2: Get Evidence ID 5 Details

```javascript
// Get evidence ID 5 details
const result = await coc.getOriginalHash(5)
console.log("Evidence ID 5:")
console.log("Hash:", result.hash)
console.log("Collector:", result.collector)
console.log("Timestamp:", new Date(parseInt(result.timestamp) * 1000))
console.log("Exists:", result.exists)
```

### Step 3: Compare with Your App

- **Hash from blockchain**: `result.hash`
- **Hash from your app**: Should match ✅

---

## 📊 Complete Verification Checklist

### ✅ Transaction Verification

- [ ] Transaction hash found on Etherscan
- [ ] Status shows "Success"
- [ ] To address matches contract address
- [ ] Gas used matches (118562)
- [ ] Block number matches (5)

### ✅ Event Verification

- [ ] EvidenceAdded event visible
- [ ] evidenceId = 5
- [ ] Hash matches your app's blockchain hash
- [ ] Collector address matches officer
- [ ] Timestamp is correct

### ✅ Contract Verification

- [ ] Can query `getOriginalHash(5)`
- [ ] Hash matches
- [ ] Collector matches
- [ ] Timestamp matches
- [ ] exists = true

---

## 🔗 Quick Links

**Replace with your actual addresses:**

- **Transaction**: `https://sepolia.etherscan.io/tx/0x3080e0f285eae82b33edaa41f7ad14c7819def33058cb7e1bd1d1edf98318f55`
- **Contract**: `https://sepolia.etherscan.io/address/0x5fbdb2315678afecb367f032d93f642f64180aa3`
- **Contract Events**: `https://sepolia.etherscan.io/address/0x5fbdb2315678afecb367f032d93f642f64180aa3#events`
- **Read Contract**: `https://sepolia.etherscan.io/address/0x5fbdb2315678afecb367f032d93f642f64180aa3#readContract`

---

## 📝 Step-by-Step Summary

### Quickest Method (2 minutes):

1. **Copy transaction hash**: `0x3080e0f285eae82b33edaa41f7ad14c7819def33058cb7e1bd1d1edf98318f55`
2. **Go to**: `https://sepolia.etherscan.io/tx/0x3080e0f285eae82b33edaa41f7ad14c7819def33058cb7e1bd1d1edf98318f55`
3. **Scroll to "Logs" section**
4. **Click on "EvidenceAdded" event**
5. **Verify**:
   - evidenceId = 5 ✅
   - Hash matches your app ✅
   - Collector address matches ✅

### Detailed Method (5 minutes):

1. **Go to contract**: `https://sepolia.etherscan.io/address/0x5fbdb2315678afecb367f032d93f642f64180aa3`
2. **Click "Events" tab**
3. **Find EvidenceAdded event with evidenceId = 5**
4. **Click "Read Contract" tab**
5. **Query `getOriginalHash(5)`**
6. **Compare all details** with your app

---

## 🧪 Test Commands

### Command 1: Get Transaction Receipt

```bash
cd blockchain
npx hardhat console --network sepolia
```

```javascript
const provider = ethers.provider
const txHash = "0x3080e0f285eae82b33edaa41f7ad14c7819def33058cb7e1bd1d1edf98318f55"
const receipt = await provider.getTransactionReceipt(txHash)
console.log("Transaction receipt:", receipt)
console.log("Events:", receipt.logs)
```

### Command 2: Parse Event

```javascript
const data = require("./deployment.json")
const ChainOfCustody = await ethers.getContractFactory("ChainOfCustody")
const coc = await ChainOfCustody.attach(data.contractAddress)

// Parse events from transaction
const receipt = await ethers.provider.getTransactionReceipt("0x3080e0f285eae82b33edaa41f7ad14c7819def33058cb7e1bd1d1edf98318f55")
const event = coc.interface.parseLog(receipt.logs[0])
console.log("Evidence ID:", event.args.evidenceId.toString())
console.log("Hash:", event.args.hash)
console.log("Collector:", event.args.collector)
```

### Command 3: Get All Evidence

```javascript
const count = await coc.getEvidenceCount()
console.log("Total evidence:", count.toString())

// Get all evidence IDs
for (let i = 1; i <= count; i++) {
  const evidence = await coc.getOriginalHash(i)
  console.log(`Evidence ${i}:`, {
    hash: evidence.hash,
    collector: evidence.collector,
    timestamp: new Date(parseInt(evidence.timestamp) * 1000)
  })
}
```

---

## ✅ Verification Result

**If everything matches:**
- ✅ Evidence ID 5 is recorded on blockchain
- ✅ Hash matches (not tampered)
- ✅ Details are correct
- ✅ Evidence is authentic

**If something doesn't match:**
- ❌ Check transaction hash is correct
- ❌ Verify you're looking at the right evidence ID
- ❌ Check contract address is correct

---

## 🎯 Quick Reference

**Your Evidence ID 5 Details:**
- Transaction: `0x3080e0f285eae82b33edaa41f7ad14c7819def33058cb7e1bd1d1edf98318f55`
- Contract: `0x5fbdb2315678afecb367f032d93f642f64180aa3`
- Block: 5
- Gas: 118562

**Verify on Etherscan:**
1. Open transaction link above
2. Check Logs → EvidenceAdded event
3. Verify hash matches your app ✅

---

**Follow these steps to verify your evidence on Etherscan!** 🎉

