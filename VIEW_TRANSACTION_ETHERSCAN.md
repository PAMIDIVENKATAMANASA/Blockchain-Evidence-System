# How to View Transaction Hash on Etherscan

## 🎯 Quick Answer

After uploading evidence, you'll get a response with `etherscanUrl`. **Click that link** or copy it to view the transaction on Etherscan!

---

## 📋 Method 1: From Upload Response (Easiest)

### Step 1: Upload Evidence

When you upload evidence via your app, the response includes:

```json
{
  "evidence": {
    "evidenceId": 5,
    "blockchainHash": "0x3080e0f285eae82b33edaa41f7ad14c7819def33058cb7e1bd1d1edf98318f55",
    "etherscanUrl": "https://sepolia.etherscan.io/tx/0x3080e0f285eae82b33edaa41f7ad14c7819def33058cb7e1bd1d1edf98318f55",
    "network": "sepolia"
  }
}
```

### Step 2: Use the Etherscan URL

**Copy `etherscanUrl` and open in browser:**
```
https://sepolia.etherscan.io/tx/0x3080e0f285eae82b33edaa41f7ad14c7819def33058cb7e1bd1d1edf98318f55
```

**Or click the link directly** if your app shows it as a clickable link.

---

## 📋 Method 2: From MongoDB

### Step 1: Get Transaction Hash from MongoDB

```bash
mongosh "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/trustchain"
```

```javascript
// Get evidence by ID
db.evidences.findOne({evidenceId: 5}, {blockchainHash: 1, evidenceId: 1, fileName: 1})
```

**Output:**
```json
{
  "evidenceId": 5,
  "fileName": "example.pdf",
  "blockchainHash": "0x3080e0f285eae82b33edaa41f7ad14c7819def33058cb7e1bd1d1edf98318f55"
}
```

### Step 2: Open on Etherscan

**Copy the `blockchainHash` and go to:**
```
https://sepolia.etherscan.io/tx/0x3080e0f285eae82b33edaa41f7ad14c7819def33058cb7e1bd1d1edf98318f55
```

---

## 📋 Method 3: From Your App UI

If your app displays the transaction hash:

1. **Find the evidence** in your app
2. **Look for "Transaction Hash"** or "Blockchain Hash"
3. **Copy the hash** (starts with `0x...`)
4. **Go to Sepolia Etherscan**: `https://sepolia.etherscan.io/`
5. **Paste hash** in search box
6. **Press Enter**

---

## 📋 Method 4: Via Contract Address (View All Evidence)

### Step 1: Get Contract Address

```bash
cd blockchain
cat deployment.json
```

Copy the `contractAddress` (e.g., `0x0dB616520F416fae0968E7e50c807DD3D176D99e`)

### Step 2: Open Contract on Etherscan

```
https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS
```

### Step 3: View Events

1. **Click "Events" tab**
2. **Find "EvidenceAdded" events**
3. **Click on event** for your evidence ID
4. **Click "Transaction Hash"** link
5. **View transaction details** ✅

---

## 🔍 What You'll See on Transaction Page

### Transaction Details:
- ✅ **Status**: Success (green checkmark)
- **From**: Your server/deployer address
- **To**: Your contract address
- **Value**: 0 ETH
- **Gas Used**: Amount of gas
- **Block**: Block number

### Event Logs:
- **Event**: EvidenceAdded
- **evidenceId**: Your evidence ID (e.g., 5)
- **hash**: Blockchain hash
- **collector**: Officer address
- **timestamp**: When added

---

## 📝 Quick Reference

### For Evidence ID 5:

**If you have transaction hash:**
```
https://sepolia.etherscan.io/tx/YOUR_TRANSACTION_HASH
```

**If you have contract address:**
```
https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS#events
```
Then find EvidenceAdded event with evidenceId = 5

---

## 🎯 Summary

**Easiest way:**
1. Upload evidence
2. Copy `etherscanUrl` from response
3. Open in browser ✅

**Alternative:**
1. Get `blockchainHash` from MongoDB
2. Go to: `https://sepolia.etherscan.io/tx/YOUR_HASH`
3. View transaction ✅

---

**The `etherscanUrl` in the upload response is the quickest way!** 🚀

