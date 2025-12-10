# ✅ Quick Etherscan Checklist

## 🎯 Your Evidence ID 5 - Quick Check

### Step 1: Get Contract Address
```bash
cd blockchain
cat deployment.json
# Copy the "contractAddress" value
```

### Step 2: Open Etherscan
```
https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS
```

### Step 3: Check Contract
- [ ] Contract page loads
- [ ] Shows "Contract" or "Contract Creation"
- [ ] Creator address matches your deployer

### Step 4: Verify Contract (If Not Done)
```bash
npm run verify
```

### Step 5: View Evidence ID 5

**Method A: Via Read Contract**
1. Click **"Read Contract"** tab
2. Find **`getOriginalHash`**
3. Enter: `5`
4. Click **"Query"**
5. Verify hash: `0xc0a6f0db6b19bc69d0cbffe9548c0f2fc82cabef626179e45b131d557b05cbbd`

**Method B: Via Events**
1. Click **"Events"** tab
2. Find **EvidenceAdded** event
3. Look for `evidenceId: 5`
4. Click on event
5. Verify hash matches

### Step 6: Verify Hash Matches
- Blockchain hash from Etherscan: `0xc0a6f0db...`
- Your app shows: `0xc0a6f0db...`
- ✅ Should match!

---

## 📋 What to Look For

### ✅ Signs Everything is Working:
- Contract address page loads ✅
- Contract is verified (green checkmark) ✅
- Can see source code ✅
- Events show EvidenceAdded ✅
- Hash matches your app ✅

### ❌ If Something is Wrong:
- Can't find contract → Check address
- Contract not verified → Run `npm run verify`
- No events → Wait a few minutes
- Hash doesn't match → Evidence may be tampered

---

## 🔗 Quick Links Format

Replace `YOUR_CONTRACT_ADDRESS` with your actual address:

- **Contract**: `https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS`
- **Transactions**: `https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS#txs`
- **Events**: `https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS#events`
- **Code**: `https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS#code`
- **Read Contract**: `https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS#readContract`

---

**Follow the detailed guide in `ETHERSCAN_STEP_BY_STEP.md` for complete instructions!** 📚

