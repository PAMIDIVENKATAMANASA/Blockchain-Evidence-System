# Complete Guide: How to Check if Data is Tampered

This guide shows you exactly how to check if evidence documents have been tampered with and how to notice when tampering has occurred.

## 🎯 Overview

Your blockchain-based system detects tampering by comparing:
1. **Original Hash** (stored on blockchain when uploaded)
2. **Current Hash** (calculated from file downloaded from IPFS)

If hashes match → **Document is AUTHENTIC** ✅  
If hashes don't match → **Document is TAMPERED** ❌

---

## 📋 Method 1: Using Judge Dashboard (Easiest)

### Step-by-Step Process

#### Step 1: Login as Judge
1. Open browser: http://localhost:3000
2. Login with judge credentials
3. Navigate to **Judge Dashboard**

#### Step 2: View All Evidence
- You'll see a list of all evidence uploaded by officers
- Each evidence shows:
  - Evidence ID
  - File name
  - Officer name
  - Upload date
  - Status (sealed/verified/tampered)

#### Step 3: Verify Evidence
1. Find the evidence you want to verify
2. Click **"Verify Integrity"** button
3. Wait for verification process (takes a few seconds)

#### Step 4: Check Verification Result

**✅ If Document is AUTHENTIC (Not Tampered):**
```
Verification Result: 100% Authentic
Status: VERIFIED
Details:
- Original Hash: 0x7f8a9b2c3d4e5f6a...
- Current Hash: 0x7f8a9b2c3d4e5f6a... (SAME!)
- File Hash: abc123def456...
- IPFS Hash: QmXwnW...
- Collector: Officer Name
- Timestamp: [upload time]
```

**❌ If Document is TAMPERED:**
```
Verification Result: Tampered
Status: TAMPERED
Details:
- Original Hash: 0x7f8a9b2c3d4e5f6a...
- Current Hash: 0x9f8a1b2c3d4e5f6a... (DIFFERENT!)
- File Hash: xyz789uvw012... (DIFFERENT!)
- IPFS Hash: QmXwnW...
- Collector: Officer Name
- Timestamp: [upload time]

⚠️ WARNING: File has been modified!
```

#### Step 5: Understand the Result

- **"100% Authentic"** = File has NOT been changed since upload
- **"Tampered"** = File HAS been modified (even 1 byte change)

---

## 📋 Method 2: Using API (Programmatic)

### Step 1: Get JWT Token

```bash
# Login as judge
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "judge@demo.local",
    "password": "password123"
  }'

# Save the token from response
TOKEN="your_jwt_token_here"
```

### Step 2: Verify Evidence

```bash
# Verify evidence (replace 1 with evidence ID)
curl -X POST http://localhost:5000/api/verification/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq
```

### Step 3: Check Response

**Authentic Response:**
```json
{
  "evidenceId": 1,
  "fileName": "evidence.pdf",
  "verificationResult": "100% Authentic",
  "isAuthentic": true,
  "details": {
    "originalHash": "0x7f8a9b2c3d4e5f6a...",
    "currentHash": "0x7f8a9b2c3d4e5f6a...",
    "fileHash": "abc123...",
    "ipfsHash": "QmXwnW...",
    "collector": "Officer Name",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

**Tampered Response:**
```json
{
  "evidenceId": 1,
  "fileName": "evidence.pdf",
  "verificationResult": "Tampered",
  "isAuthentic": false,
  "details": {
    "originalHash": "0x7f8a9b2c3d4e5f6a...",
    "currentHash": "0x9f8a1b2c3d4e5f6a...",
    "fileHash": "xyz789...",
    "ipfsHash": "QmXwnW...",
    "collector": "Officer Name",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

**Key Indicators:**
- `isAuthentic: true` → Not tampered
- `isAuthentic: false` → Tampered
- Compare `originalHash` and `currentHash` - they should be identical

---

## 📋 Method 3: Manual Verification (Advanced)

### Step 1: Get Evidence Metadata

```bash
# Connect to MongoDB
mongosh "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/trustchain"

# Get evidence details
db.evidences.findOne({evidenceId: 1})
```

Note down:
- `ipfsHash`: The IPFS CID
- `fileHash`: The original SHA-256 hash
- `blockchainHash`: The blockchain transaction hash

### Step 2: Download File from IPFS

```bash
# Download file using IPFS CID
CID="QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA"
ipfs get "$CID" -o /tmp/downloaded_evidence
```

### Step 3: Calculate Current Hash

```bash
# Calculate SHA-256 hash of downloaded file
CURRENT_HASH=$(sha256sum /tmp/downloaded_evidence | cut -d' ' -f1)
echo "Current Hash: $CURRENT_HASH"
```

### Step 4: Get Original Hash from Blockchain

```bash
cd blockchain
npx hardhat console --network localhost
```

```javascript
const data = require("./deployment.json")
const ChainOfCustody = await ethers.getContractFactory("ChainOfCustody")
const coc = await ChainOfCustody.attach(data.contractAddress)

// Get original hash (replace 1 with evidence ID)
const result = await coc.getOriginalHash(1)
const originalHashBytes32 = result.hash

// Convert to hex string for comparison
const originalHash = ethers.utils.hexlify(originalHashBytes32)
console.log("Original Hash (from blockchain):", originalHash)
```

### Step 5: Compare Hashes

**If hashes match:**
- ✅ Document is **AUTHENTIC** (not tampered)

**If hashes don't match:**
- ❌ Document is **TAMPERED** (has been modified)

---

## 📋 Method 4: Using Test Script

### Run Hash Comparison Test

```bash
# Test hash comparison for specific evidence
node test_hash_comparison.js <evidenceId>

# Example:
node test_hash_comparison.js 1
```

**Output for Authentic Document:**
```
✅ RESULT: 100% AUTHENTIC
The file has NOT been tampered with.
Current hash matches blockchain hash.

📊 Hash Comparison:
   Current Hash:    0x7f8a9b2c3d4e5f6a...
   Blockchain Hash: 0x7f8a9b2c3d4e5f6a...
   Match:           ✅ YES
```

**Output for Tampered Document:**
```
❌ RESULT: TAMPERED
The file HAS been modified!
Current hash does NOT match blockchain hash.

📊 Hash Comparison:
   Current Hash:    0x9f8a1b2c3d4e5f6a...
   Blockchain Hash: 0x7f8a9b2c3d4e5f6a...
   Match:           ❌ NO
```

---

## 🔍 How to Notice Data Has Been Tampered

### Visual Indicators in Dashboard

1. **Status Badge**
   - ✅ Green "VERIFIED" = Authentic
   - ❌ Red "TAMPERED" = Modified

2. **Verification Result**
   - "100% Authentic" = Safe
   - "Tampered" = Warning!

3. **Hash Comparison**
   - Hashes match = Good
   - Hashes different = Bad

### What Happens When Data is Tampered

#### Scenario 1: File Modified After Upload

1. **Original Upload:**
   - File: `evidence.pdf` (100 KB)
   - Hash: `abc123...`
   - Status: `sealed`

2. **Someone Modifies File:**
   - File: `evidence.pdf` (101 KB) - added content
   - New Hash: `xyz789...` (different!)

3. **Verification Detects:**
   - Original Hash: `abc123...`
   - Current Hash: `xyz789...`
   - Result: **TAMPERED** ❌

#### Scenario 2: File Replaced

1. **Original Upload:**
   - File: `photo.jpg` (original image)
   - Hash: `def456...`

2. **Someone Replaces File:**
   - File: `photo.jpg` (different image)
   - New Hash: `uvw012...` (completely different!)

3. **Verification Detects:**
   - Original Hash: `def456...`
   - Current Hash: `uvw012...`
   - Result: **TAMPERED** ❌

### Real-World Example

**Step 1: Officer Uploads Evidence**
```
Evidence ID: 1
File: crime_scene_photo.jpg
IPFS Hash: QmXwnW...
Original Hash: 0x7f8a9b2c3d4e5f6a...
Status: sealed
```

**Step 2: Judge Verifies (First Time)**
```
Verification Result: 100% Authentic ✅
Status: verified
```

**Step 3: Someone Tampers File**
- Downloads file from IPFS
- Modifies image (adds/removes content)
- Re-uploads to IPFS (creates new CID)

**Step 4: Judge Verifies Again**
```
Verification Result: Tampered ❌
Status: tampered

Original Hash: 0x7f8a9b2c3d4e5f6a...
Current Hash:  0x9f8a1b2c3d4e5f6a... (DIFFERENT!)

⚠️ WARNING: Evidence has been modified!
```

---

## 🚨 Warning Signs of Tampering

### 1. Hash Mismatch
- Original hash ≠ Current hash
- **Action:** Document is tampered

### 2. Status Changed to "TAMPERED"
- System automatically updates status
- **Action:** Investigate immediately

### 3. File Size Changed
- Original size ≠ Current size
- **Action:** Check if file was modified

### 4. Verification Result Shows "Tampered"
- Clear indicator in dashboard
- **Action:** Do not use as evidence

---

## ✅ Verification Checklist

Use this checklist when verifying evidence:

- [ ] Evidence ID matches case file
- [ ] Officer name matches records
- [ ] Upload timestamp is consistent
- [ ] Verification shows "100% Authentic"
- [ ] Original hash matches current hash
- [ ] Status is "verified" (not "tampered")
- [ ] File downloads successfully from IPFS
- [ ] No discrepancies in timestamps

**If any item fails → Evidence may be compromised!**

---

## 🔬 Technical Details: How Tampering Detection Works

### Hash Function Properties

1. **Deterministic:** Same file = Same hash
2. **One-way:** Cannot reverse hash to get file
3. **Avalanche Effect:** Small change = Completely different hash

### Example:

```
Original File: "Evidence Document"
SHA-256: abc123def456...

Modified File: "Evidence DocumentX" (added 1 character)
SHA-256: xyz789uvw012... (completely different!)

Even 1 byte change = Different hash!
```

### Why Blockchain is Important

- **Immutable:** Hash stored on blockchain cannot be changed
- **Permanent:** Record exists forever
- **Trusted:** No single point of failure

---

## 📊 Comparison Table

| Aspect | Authentic Document | Tampered Document |
|--------|-------------------|-------------------|
| **Status** | ✅ VERIFIED | ❌ TAMPERED |
| **Verification Result** | "100% Authentic" | "Tampered" |
| **Hash Match** | ✅ YES | ❌ NO |
| **Original Hash** | 0x7f8a9b... | 0x7f8a9b... |
| **Current Hash** | 0x7f8a9b... (same) | 0x9f8a1b... (different) |
| **Can Use as Evidence?** | ✅ YES | ❌ NO |

---

## 🛠️ Troubleshooting

### Problem: Verification always shows "Tampered" for new uploads

**Possible causes:**
- Hash calculation changed
- Blockchain connection issue
- File corruption during download

**Solution:**
- Check hash calculation in code
- Verify blockchain connection
- Re-upload and test

### Problem: Can't verify evidence

**Possible causes:**
- Evidence not found
- IPFS connection issue
- Blockchain connection issue

**Solution:**
- Check evidence ID exists
- Verify IPFS daemon is running
- Check blockchain node is running

---

## 📝 Quick Reference

### Check if Tampered (Quick Method)

1. Login as Judge
2. Click "Verify Integrity"
3. Check result:
   - ✅ "100% Authentic" = Not tampered
   - ❌ "Tampered" = Has been modified

### Check Hash Manually

```bash
# Download file
ipfs get <CID> -o file

# Calculate hash
sha256sum file

# Compare with blockchain hash
# (Use test_hash_comparison.js script)
```

---

## 🎓 Summary

### How to Check if Data is Tampered:

1. **Use Judge Dashboard** → Click "Verify Integrity"
2. **Check Status** → Should be "VERIFIED" (not "TAMPERED")
3. **Compare Hashes** → Original and current should match
4. **Look for Warnings** → System will show "Tampered" if detected

### How to Notice Tampering:

1. **Status Changes** → From "verified" to "tampered"
2. **Hash Mismatch** → Original ≠ Current hash
3. **Verification Result** → Shows "Tampered" instead of "100% Authentic"
4. **System Alerts** → Dashboard highlights tampered evidence

**Remember:** The system automatically detects tampering. You just need to verify and check the results!

---

**Your system is designed to automatically detect tampering. Just verify and check the results!** 🛡️

