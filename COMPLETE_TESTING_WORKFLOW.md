# Complete Testing Workflow - Tampering Detection

This guide provides a step-by-step workflow to test if your blockchain-based evidence system is working correctly and detecting tampering.

## 🎯 Overview

The testing workflow covers:
1. **Setup and Preparation**
2. **Upload Evidence** (Officer)
3. **Verify Evidence** (Judge) - Test Authentic Document
4. **Test Tampering Detection** - Test Modified Document
5. **Check Public Access** - Test IPFS Public Gateway
6. **Verify MongoDB Atlas** - Check Data Storage
---
## 📋 Prerequisites Checklist

Before starting, ensure:

- [ ] Server is running (`cd server && npm start`)
- [ ] Client is running (`cd client && npm run dev`)
- [ ] Blockchain node is running (`cd blockchain && npx hardhat node`)
- [ ] IPFS daemon is running (`ipfs daemon`)
- [ ] MongoDB Atlas is configured and connected
- [ ] IPFS public gateway is configured

---

## 🔄 Complete Testing Workflow

### Phase 1: Initial Setup and Preparation

#### Step 1.1: Check All Services are Running

```bash
# Terminal 1: Check blockchain
curl http://localhost:8545
# Should return JSON-RPC response

# Terminal 2: Check server
curl http://localhost:5000/api/health
# Should return: {"status":"OK","message":"TrustChain API is running"}

# Terminal 3: Check IPFS
ipfs id
# Should show your IPFS node info

# Terminal 4: Check MongoDB Atlas connection
cd server
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => { console.log('✅ MongoDB Atlas connected'); process.exit(0); }).catch(e => { console.error('❌ Error:', e.message); process.exit(1); });"
```

#### Step 1.2: Create Test Accounts (if not exists)

1. **Open Web Interface**: http://localhost:3000
2. **Register Test Users**:
   - Officer: `officer@test.com` / `password123`
   - Judge: `judge@test.com` / `password123`
   - Lawyer: `lawyer@test.com` / `password123`

#### Step 1.3: Prepare Test File

Create a test evidence file:

```bash
# Create test evidence document
cat > /tmp/test_evidence.txt << EOF
Case Number: TEST-001
Date: $(date)
Officer: Test Officer
Location: Test Location
Description: This is a test evidence document for tampering detection.
Content: Original evidence data - DO NOT MODIFY
EOF

echo "✅ Test file created: /tmp/test_evidence.txt"
```

---

### Phase 2: Upload Evidence (Officer Workflow)

#### Step 2.1: Login as Officer

1. Open browser: http://localhost:3000
2. Login with officer credentials
3. Navigate to Officer Dashboard

#### Step 2.2: Upload Evidence

1. Click "Upload Evidence" button
2. Select file: `/tmp/test_evidence.txt`
3. Fill in details:
   - Description: "Test evidence for tampering detection"
   - GPS Latitude: 12.9716 (optional)
   - GPS Longitude: 77.5946 (optional)
4. Click "Upload & Seal Evidence"

#### Step 2.3: Note Important Information

After upload, note down:

- **Evidence ID**: `___` (e.g., 1)
- **IPFS Hash (CID)**: `___` (e.g., `QmXwnW...`)
- **Blockchain Transaction Hash**: `___` (e.g., `0x7f8a9b...`)
- **Upload Timestamp**: `___`

#### Step 2.4: Verify Upload in MongoDB Atlas

```bash
# Connect to MongoDB Atlas
mongosh "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/trustchain"

# Find the uploaded evidence
db.evidences.find().sort({createdAt: -1}).limit(1).pretty()
```

Expected fields:
- `evidenceId`: Should match
- `ipfsHash`: Should be the CID
- `blockchainHash`: Should be transaction hash
- `status`: Should be "sealed"
- `collectorName`: Should be officer name

#### Step 2.5: Verify Upload on Blockchain

```bash
cd blockchain
npx hardhat console --network localhost
```

```javascript
const data = require("./deployment.json")
const ChainOfCustody = await ethers.getContractFactory("ChainOfCustody")
const coc = await ChainOfCustody.attach(data.contractAddress)

// Get evidence count
await coc.getEvidenceCount()

// Get evidence details (replace 1 with your evidenceId)
const result = await coc.getOriginalHash(1)
console.log("Hash:", result.hash)
console.log("Collector:", result.collector)
console.log("Timestamp:", new Date(parseInt(result.timestamp) * 1000))
```

---

### Phase 3: Verify Authentic Document (Judge Workflow)

#### Step 3.1: Login as Judge

1. Open browser: http://localhost:3000 (or new incognito window)
2. Login with judge credentials
3. Navigate to Judge Dashboard

#### Step 3.2: View All Evidence

You should see the evidence uploaded by the officer in the list.

#### Step 3.3: Verify Evidence Integrity

1. Find the evidence in the list
2. Click "Verify Integrity" button
3. Wait for verification process

#### Step 3.4: Check Verification Result

**Expected Result:**
```
✅ Verification Result: 100% Authentic
Status: VERIFIED
Details:
- Original Hash: 0x7f8a9b...
- Current Hash: 0x7f8a9b... (should match!)
- File Hash: abc123...
- IPFS Hash: QmXwnW...
- Collector: Test Officer
- Timestamp: [upload time]
```

**If you see "100% Authentic":**
- ✅ System is working correctly!
- ✅ Document has NOT been tampered with
- ✅ Blockchain hash matches current file hash

#### Step 3.5: Verify via API

```bash
# Get JWT token (login first)
TOKEN="your_judge_jwt_token"

# Verify evidence
curl -X POST http://localhost:5000/api/verification/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq
```

Expected response:
```json
{
  "verificationResult": "100% Authentic",
  "isAuthentic": true,
  "details": {
    "originalHash": "0x...",
    "currentHash": "0x...",
    ...
  }
}
```

---

### Phase 4: Test Tampering Detection

#### Step 4.1: Modify the Original File

**Important:** We'll create a modified version to test tampering detection:

```bash
# Create a modified version of the evidence
cp /tmp/test_evidence.txt /tmp/tampered_evidence.txt

# Add tampered content
echo "" >> /tmp/tampered_evidence.txt
echo "TAMPERED: Unauthorized modification added on $(date)" >> /tmp/tampered_evidence.txt

# Calculate new hash (should be different)
echo "🔐 Original file hash:"
sha256sum /tmp/test_evidence.txt

echo "🔐 Tampered file hash:"
sha256sum /tmp/tampered_evidence.txt
# These should be DIFFERENT!
```

#### Step 4.2: Replace File on IPFS (Simulating Tampering)

```bash
# Get the IPFS CID from Phase 2
CID="QmXwnW..."  # Replace with your actual CID

# Add tampered file to IPFS (creates new CID)
NEW_CID=$(ipfs add -Q /tmp/tampered_evidence.txt)
echo "New CID for tampered file: $NEW_CID"

# Note: Original CID still exists, but we're simulating a scenario
# where someone modified the file
```

**Alternative Test - Direct File Modification:**

Actually, IPFS doesn't allow file modification - each file gets a unique CID. To properly test tampering detection, we need to:

1. Download the original file
2. Modify it
3. Re-upload it
4. Try to verify with the original CID

But the verification system downloads from the original CID, so it will still get the original file. 

**Better Test Method:**

Instead, let's test by directly modifying the downloaded file hash calculation:

#### Step 4.3: Manual Tampering Test

```bash
# Download original file from IPFS
CID="QmXwnW..."  # Your evidence CID
ipfs get "$CID" -o /tmp/downloaded_evidence.txt

# Modify the downloaded file
echo "TAMPERED DATA" >> /tmp/downloaded_evidence.txt

# Calculate hash of modified file
MODIFIED_HASH=$(sha256sum /tmp/downloaded_evidence.txt | cut -d' ' -f1)
echo "Modified file hash: $MODIFIED_HASH"

# Compare with original (from MongoDB)
mongosh "mongodb+srv://..." --eval 'db.evidences.findOne({evidenceId: 1}, {fileHash: 1})'
# The hashes should be DIFFERENT
```

#### Step 4.4: Use Test Script for Tampering Detection

We have a test script that simulates tampering:

```bash
# Run tampering detection test
./test_tampering_detection.sh
```

This script:
1. Creates an original file
2. Calculates its hash
3. Modifies the file
4. Recalculates hash
5. Shows that hashes are different (proving tampering detection works)

#### Step 4.5: Real-World Tampering Test

To test actual tampering detection in the system:

1. **Upload new evidence** (as officer)
2. **Note the Evidence ID** (e.g., 2)
3. **Get the file from IPFS**:
   ```bash
   CID="your_cid_here"
   ipfs get "$CID" -o /tmp/evidence_file
   ```

4. **Modify the file**:
   ```bash
   echo "TAMPERED" >> /tmp/evidence_file
   ```

5. **Replace on IPFS** (this creates a new CID, but we'll simulate):
   - Actually, you can't modify IPFS content directly
   - But we can test if the verification system would detect it

6. **Better approach - Test hash comparison directly**:
   ```bash
   # Use the hash comparison script
   node test_hash_comparison.js 1
   ```

   If you manually modify the file that gets downloaded, you'll see:
   ```
   ❌ RESULT: TAMPERED
   The file HAS been modified!
   Current hash does NOT match blockchain hash.
   ```

---

### Phase 5: Test IPFS Public Gateway Access

#### Step 5.1: Get Your Public IP Address

```bash
PUBLIC_IP=$(curl -s ifconfig.me)
echo "Your public IP: $PUBLIC_IP"
```

#### Step 5.2: Test Public Gateway Locally

```bash
CID="QmXwnW..."  # Your evidence CID

# Test local gateway
curl -I http://localhost:8080/ipfs/$CID
# Should return 200 OK
```

#### Step 5.3: Test Public Gateway from Another Device

On a different computer/phone:

```
http://YOUR_PUBLIC_IP:8080/ipfs/QmXwnW...
```

Or use online service:
```
https://ipfs.io/ipfs/QmXwnW...
https://gateway.ipfs.io/ipfs/QmXwnW...
https://cloudflare-ipfs.com/ipfs/QmXwnW...
```

#### Step 5.4: Verify Gateway URL in Evidence Response

Check if API returns gateway URL:

```bash
# Get evidence details
curl http://localhost:5000/api/evidence/1 \
  -H "Authorization: Bearer $TOKEN" | jq
```

Should include:
```json
{
  "evidence": {
    "ipfsHash": "QmXwnW...",
    "ipfsGatewayURL": "http://YOUR_IP:8080/ipfs/QmXwnW...",
    ...
  }
}
```

---

### Phase 6: Verify MongoDB Atlas Storage

#### Step 6.1: Connect to MongoDB Atlas

```bash
# Using mongosh
mongosh "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/trustchain"
```

#### Step 6.2: Check All Collections

```javascript
// Show all collections
show collections

// Should see:
// - users
// - evidences
```

#### Step 6.3: View Users

```javascript
db.users.find().pretty()
```

#### Step 6.4: View Evidence

```javascript
db.evidences.find().pretty()
```

#### Step 6.5: Verify Data Integrity

```javascript
// Check evidence with specific ID
db.evidences.findOne({evidenceId: 1}).pretty()

// Verify fields exist:
// - evidenceId ✓
// - fileName ✓
// - ipfsHash ✓
// - blockchainHash ✓
// - fileHash ✓
// - status ✓
```

---

## ✅ Testing Checklist

### Upload Phase
- [ ] Officer can login
- [ ] Officer can upload evidence
- [ ] Evidence gets IPFS CID
- [ ] Evidence hash stored on blockchain
- [ ] Evidence metadata saved to MongoDB Atlas
- [ ] Evidence status is "sealed"

### Verification Phase
- [ ] Judge can login
- [ ] Judge can see all evidence
- [ ] Judge can verify evidence
- [ ] Verification shows "100% Authentic" for original file
- [ ] Verification details are correct
- [ ] Evidence status updates to "verified"

### Tampering Detection Phase
- [ ] Modified file produces different hash
- [ ] Verification detects tampering (if file modified)
- [ ] Status updates to "tampered" when detected

### Public Access Phase
- [ ] IPFS gateway is accessible locally (port 8080)
- [ ] IPFS gateway is accessible from public IP
- [ ] Files can be viewed via public gateway URL
- [ ] Gateway URLs are included in API responses

### MongoDB Atlas Phase
- [ ] Can connect to MongoDB Atlas
- [ ] Data is stored correctly
- [ ] Can query users collection
- [ ] Can query evidences collection
- [ ] Data persists after server restart

---

## 🧪 Automated Test Scripts

### Test 1: Hash Comparison Test

```bash
# Test hash comparison for evidence
node test_hash_comparison.js <evidenceId>
```

### Test 2: Tampering Detection Test

```bash
# Run tampering detection demonstration
./test_tampering_detection.sh
```

### Test 3: MongoDB Atlas Connection Test

```bash
# Test MongoDB Atlas connection
cd server
node -e "
require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Atlas connected');
    return mongoose.connection.db.listCollections().toArray();
  })
  .then(collections => {
    console.log('Collections:', collections.map(c => c.name));
    process.exit(0);
  })
  .catch(e => {
    console.error('❌ Error:', e.message);
    process.exit(1);
  });
"
```

### Test 4: IPFS Public Gateway Test

```bash
# Test public gateway access
node test_ipfs_public_gateway.js <CID>
```

---

## 📊 Expected Results Summary

### Successful Test Results:

| Test | Expected Result | Status |
|------|----------------|--------|
| Upload Evidence | Evidence ID assigned, CID generated | ✅ |
| Store on Blockchain | Transaction hash received | ✅ |
| Save to MongoDB Atlas | Document saved with all fields | ✅ |
| Verify Authentic File | "100% Authentic" | ✅ |
| Hash Comparison | Hashes match | ✅ |
| Test Tampering | Different hash detected | ✅ |
| Public Gateway | File accessible via public URL | ✅ |
| MongoDB Atlas Access | Can query and view data | ✅ |

---

## 🔍 Troubleshooting

### Problem: Verification shows "Tampered" for original file

**Possible causes:**
- File hash calculation changed
- Blockchain hash retrieval issue
- File corruption during download

**Solution:**
- Check hash calculation in code
- Verify blockchain connection
- Re-upload and test again

### Problem: Can't access public gateway

**Possible causes:**
- Firewall blocking port 8080
- IPFS gateway not configured
- Router not forwarding ports

**Solution:**
- Check firewall rules
- Verify IPFS gateway configuration
- Configure port forwarding

### Problem: MongoDB Atlas connection failed

**Possible causes:**
- Wrong connection string
- IP not whitelisted
- Wrong credentials

**Solution:**
- Verify connection string
- Check Network Access settings
- Verify username/password

---

## 📝 Test Report Template

After completing tests, document results:

```
TEST REPORT
===========

Date: ___________
Tester: ___________

Phase 1: Setup
- Blockchain: [ ] Running [ ] Not Running
- Server: [ ] Running [ ] Not Running
- IPFS: [ ] Running [ ] Not Running
- MongoDB Atlas: [ ] Connected [ ] Not Connected

Phase 2: Upload
- Evidence ID: ___________
- IPFS CID: ___________
- Blockchain TX: ___________
- Status: [ ] Success [ ] Failed

Phase 3: Verification
- Verification Result: ___________
- Status: [ ] Authentic [ ] Tampered
- Details: ___________

Phase 4: Tampering Detection
- Test Result: [ ] Detected [ ] Not Detected
- Hash Comparison: [ ] Match [ ] No Match

Phase 5: Public Gateway
- Local Access: [ ] Working [ ] Not Working
- Public Access: [ ] Working [ ] Not Working
- URL: ___________

Phase 6: MongoDB Atlas
- Connection: [ ] Success [ ] Failed
- Data Visible: [ ] Yes [ ] No
- Collections: ___________

Overall Status: [ ] PASS [ ] FAIL

Notes:
___________
```

---

**Follow this workflow to thoroughly test your system!** 🚀

