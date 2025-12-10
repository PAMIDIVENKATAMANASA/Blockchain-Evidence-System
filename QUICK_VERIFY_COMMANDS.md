# Quick Commands: Verify Evidence ID 5

## 🚀 Fastest Way (Copy-Paste)

### Step 1: Open Transaction on Etherscan

**Copy this URL and open in browser:**
```
https://sepolia.etherscan.io/tx/0x3080e0f285eae82b33edaa41f7ad14c7819def33058cb7e1bd1d1edf98318f55
```

### Step 2: View Event Logs

1. Scroll down to **"Logs"** section
2. Click on **"EvidenceAdded"** event
3. See evidence details ✅

---

## 💻 Command Line Verification

### Get Evidence Details

```bash
cd blockchain
npx hardhat console --network sepolia
```

**Then run:**
```javascript
const data = require("./deployment.json")
const ChainOfCustody = await ethers.getContractFactory("ChainOfCustody")
const coc = await ChainOfCustody.attach(data.contractAddress)

// Get Evidence ID 5
const evidence = await coc.getOriginalHash(5)
console.log("Evidence ID 5:")
console.log("Hash:", evidence.hash)
console.log("Collector:", evidence.collector)
console.log("Timestamp:", new Date(parseInt(evidence.timestamp) * 1000))
console.log("Exists:", evidence.exists)
```

**Compare hash with your app - should match!** ✅

---

## 🔗 Direct Links

**Transaction:**
```
https://sepolia.etherscan.io/tx/0x3080e0f285eae82b33edaa41f7ad14c7819def33058cb7e1bd1d1edf98318f55
```

**Contract:**
```
https://sepolia.etherscan.io/address/0x5fbdb2315678afecb367f032d93f642f64180aa3
```

**Contract Events:**
```
https://sepolia.etherscan.io/address/0x5fbdb2315678afecb367f032d93f642f64180aa3#events
```

**Read Contract:**
```
https://sepolia.etherscan.io/address/0x5fbdb2315678afecb367f032d93f642f64180aa3#readContract
```

---

## ✅ What to Check

1. **Transaction Status**: Should be "Success" ✅
2. **Event**: EvidenceAdded with evidenceId = 5 ✅
3. **Hash**: Matches your app's blockchain hash ✅
4. **Collector**: Matches officer address ✅

---

**Open the transaction link above to verify!** 🎯

