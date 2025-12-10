# How to View Transaction Hash on Etherscan

## 🎯 Quick Answer

After uploading evidence, check the response for `etherscanUrl` - **that's your direct link to view the transaction!**

---

## 📋 Method 1: From Upload Response (Easiest)

### When You Upload Evidence:

The server response includes:

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

### View Transaction:

1. **Copy `etherscanUrl`** from the response
2. **Open in browser**
3. **See transaction details** ✅

**Or if your app shows it as a link, just click it!**

---

## 📋 Method 2: From MongoDB

### Get Transaction Hash:

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

### View on Etherscan:

**Copy `blockchainHash` and go to:**
```
https://sepolia.etherscan.io/tx/0x3080e0f285eae82b33edaa41f7ad14c7819def33058cb7e1bd1d1edf98318f55
```

---

## 📋 Method 3: Via Contract Address

### Step 1: Get Contract Address

```bash
cd blockchain
cat deployment.json
```

Copy `contractAddress` (e.g., `0x0dB616520F416fae0968E7e50c807DD3D176D99e`)

### Step 2: Open Contract on Etherscan

```
https://sepolia.etherscan.io/address/0x0dB616520F416fae0968E7e50c807DD3D176D99e
```

### Step 3: View All Transactions

1. **Click "Transactions" tab**
2. **See all transactions** to your contract
3. **Click on any transaction** to see details

### Step 4: View Events

1. **Click "Events" tab**
2. **Find "EvidenceAdded" events**
3. **Click on event** for your evidence
4. **Click transaction hash** link
5. **View transaction** ✅

---

## 🔍 What You'll See on Transaction Page

### Transaction Overview:
- ✅ **Status**: Success
- **From**: Your server/deployer address
- **To**: Your contract address
- **Value**: 0 ETH
- **Gas Used**: Amount consumed
- **Block**: Block number

### Event Logs:
- **Event**: EvidenceAdded
- **evidenceId**: Your evidence ID
- **hash**: Blockchain hash
- **collector**: Officer address
- **timestamp**: When added

---

## 📝 Quick Reference

### For Any Evidence:

**If you have transaction hash:**
```
https://sepolia.etherscan.io/tx/YOUR_TRANSACTION_HASH
```

**If you have contract address:**
```
https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS#events
```
Then find EvidenceAdded event

---

## ✅ Summary

**Easiest way:**
1. Upload evidence
2. Copy `etherscanUrl` from response
3. Open in browser ✅

**Alternative:**
1. Get `blockchainHash` from MongoDB
2. Go to: `https://sepolia.etherscan.io/tx/YOUR_HASH`
3. View transaction ✅

---

**The `etherscanUrl` in the upload response is your direct link!** 🚀

