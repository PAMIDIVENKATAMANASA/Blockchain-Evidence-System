# Comprehensive Guide: IPFS Hashes, Blockchain Hashes, and Anti-Tampering System

## Table of Contents
1. [Understanding IPFS Hash Keys vs Blockchain Hash Keys](#understanding-hashes)
2. [How to Test Hashes](#testing-hashes)
3. [Testing Blockchain Tampering Detection](#testing-tampering)
4. [Judge's Guide to Document Verification](#judge-verification)
5. [Fetching Documents from IPFS](#fetching-documents)
6. [Complete Anti-Tampering Workflow](#anti-tampering-workflow)
7. [Viewing User Data in MongoDB](#viewing-mongodb-data)

---

## 1. Understanding IPFS Hash Keys vs Blockchain Hash Keys {#understanding-hashes}

### IPFS Hash (CID - Content Identifier)

**What it is:**
- IPFS Hash (CID) is a unique identifier generated when a file is uploaded to IPFS
- Example: `QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA`
- It's like a permanent address to retrieve the file from IPFS network

**Purpose:**
1. **File Retrieval**: Used to download the actual file from IPFS
2. **Content Addressing**: IPFS uses content-addressed storage (same file = same hash)
3. **Decentralized Storage**: File can be retrieved from any IPFS node that has it

**Where it's stored:**
- MongoDB `evidence` collection → `ipfsHash` field
- Used by the system to download files when needed

### Blockchain Hash (File Integrity Hash)

**What it is:**
- SHA-256 hash of the file content (converted to bytes32 using Keccak256)
- Example: `0x7f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a`
- This is the actual file content hash, not the IPFS CID

**Purpose:**
1. **Integrity Verification**: Proves the file hasn't been modified
2. **Tampering Detection**: Any change to file content changes this hash
3. **Immutable Record**: Stored on blockchain (cannot be changed)

**How it's generated:**
```
File Buffer → SHA-256 Hash → Convert to Bytes32 (Keccak256) → Store on Blockchain
```

**Where it's stored:**
- Blockchain smart contract → `evidenceRecords[evidenceId].hash`
- MongoDB `evidence` collection → `fileHash` field (for reference)

### Key Differences

| Aspect | IPFS Hash (CID) | Blockchain Hash |
|--------|----------------|-----------------|
| **Type** | IPFS Content Identifier | SHA-256 file hash |
| **Purpose** | Find and retrieve file | Verify file integrity |
| **Storage** | MongoDB | Blockchain (immutable) |
| **Changes if** | File content changes | File content changes |
| **Used for** | Downloading files | Verifying authenticity |

---

## 2. How to Test Hashes {#testing-hashes}

### Test IPFS Hash

**Method 1: Using IPFS Command Line**

```bash
# Download file using IPFS CID
ipfs get QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA -o test_file

# Verify the CID matches
ipfs add test_file
# Should show the same CID if file is unchanged
```

**Method 2: Using API Endpoint**

```bash
# Get evidence details (includes IPFS hash)
curl -X GET http://localhost:5000/api/evidence/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Method 3: Check MongoDB**

```bash
mongosh
use trustchain
db.evidences.find({}, {ipfsHash: 1, fileName: 1}).pretty()
```

### Test Blockchain Hash

**Method 1: Using Hardhat Console**

```bash
cd blockchain
npx hardhat console --network localhost
```

```javascript
const data = require("./deployment.json")
const ChainOfCustody = await ethers.getContractFactory("ChainOfCustody")
const coc = await ChainOfCustody.attach(data.contractAddress)

// Get original hash from blockchain
const result = await coc.getOriginalHash(1)  // Replace 1 with evidenceId
console.log("Blockchain Hash:", result.hash)
console.log("Collector:", result.collector)
console.log("Timestamp:", new Date(parseInt(result.timestamp) * 1000))
```

**Method 2: Calculate File Hash Manually**

```bash
# Download file from IPFS first
ipfs get QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA -o test_file

# Calculate SHA-256 hash
sha256sum test_file
# or
openssl dgst -sha256 test_file

# Compare with blockchain hash stored in MongoDB
mongosh trustchain --eval 'db.evidences.findOne({evidenceId: 1}, {fileHash: 1})'
```

**Method 3: Create Test Script**

Create `test_hashes.js`:

```javascript
const { downloadFromIPFS, calculateFileHash } = require('./server/services/ipfs');
const { getOriginalHash } = require('./server/services/blockchain');
const { ethers } = require('ethers');

async function testHashes(evidenceId, ipfsHash) {
  console.log('📥 Downloading from IPFS...');
  const ipfsResult = await downloadFromIPFS(ipfsHash);
  
  console.log('🔐 Calculating file hash...');
  const fileHash = calculateFileHash(ipfsResult.buffer);
  const hashBytes32 = ethers.keccak256(ethers.toUtf8Bytes(fileHash));
  
  console.log('⛓️  Getting blockchain hash...');
  const blockchainData = await getOriginalHash(evidenceId);
  
  console.log('\n=== COMPARISON ===');
  console.log('IPFS CID:', ipfsHash);
  console.log('File Hash (SHA-256):', fileHash);
  console.log('File Hash (Bytes32):', hashBytes32);
  console.log('Blockchain Hash:', blockchainData.hash);
  console.log('Match:', hashBytes32.toLowerCase() === blockchainData.hash.toLowerCase() ? '✅ YES' : '❌ NO');
}

// Usage: node test_hashes.js 1 QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA
testHashes(process.argv[2], process.argv[3]);
```

Run it:
```bash
node test_hashes.js 1 QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA
```

---

## 3. Testing Blockchain Tampering Detection {#testing-tampering}

### Test Case 1: Verify Authentic Document (Not Tampered)

**Step 1: Upload a Test File**
```bash
# Use the web interface or API
curl -X POST http://localhost:5000/api/evidence/upload \
  -H "Authorization: Bearer OFFICER_TOKEN" \
  -F "file=@test_document.pdf" \
  -F "description=Test evidence"
```

**Step 2: Verify as Judge**
```bash
# Verify the evidence (evidenceId from Step 1 response)
curl -X POST http://localhost:5000/api/verification/1 \
  -H "Authorization: Bearer JUDGE_TOKEN"
```

**Expected Result:**
```json
{
  "verificationResult": "100% Authentic",
  "isAuthentic": true,
  "details": {
    "originalHash": "0x...",
    "currentHash": "0x...",
    "fileHash": "...",
    "ipfsHash": "..."
  }
}
```

### Test Case 2: Test Tampering Detection

**Step 1: Download File from IPFS**
```bash
ipfs get QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA -o original_file
```

**Step 2: Modify the File (Tamper it)**
```bash
# For text files, add a character
echo "TAMPERED" >> original_file

# For binary files, you might use hexedit or similar tools
# Or create a modified version programmatically
```

**Step 3: Re-upload Modified File to IPFS**
```bash
# This will create a NEW IPFS hash (different CID)
ipfs add original_file
# Note: This creates a new CID, but we're testing if someone replaced the file
```

**Step 4: Try to Verify**
```bash
# The system should detect tampering when:
# 1. File is downloaded from IPFS
# 2. Hash is recalculated
# 3. Compared with blockchain hash
# 4. Hashes don't match → "Tampered" result
```

**Expected Result:**
```json
{
  "verificationResult": "Tampered",
  "isAuthentic": false,
  "details": {
    "originalHash": "0xABC...",  // From blockchain
    "currentHash": "0xDEF...",   // From modified file (different!)
    ...
  }
}
```

### Test Case 3: Automated Tampering Test Script

Create `test_tampering.sh`:

```bash
#!/bin/bash
EVIDENCE_ID=$1
IPFS_HASH=$2

echo "🧪 Testing Tampering Detection for Evidence ID: $EVIDENCE_ID"
echo ""

# Step 1: Download original file
echo "📥 Downloading original file..."
ipfs get "$IPFS_HASH" -o /tmp/original_evidence

# Step 2: Calculate original hash
ORIGINAL_HASH=$(sha256sum /tmp/original_evidence | cut -d' ' -f1)
echo "🔐 Original SHA-256 Hash: $ORIGINAL_HASH"

# Step 3: Tamper the file (add data)
echo "⚠️  Tampering file..."
echo "TAMPERED_DATA" >> /tmp/original_evidence

# Step 4: Calculate new hash
TAMPERED_HASH=$(sha256sum /tmp/original_evidence | cut -d' ' -f1)
echo "🔐 Tampered SHA-256 Hash: $TAMPERED_HASH"

# Step 5: Compare
if [ "$ORIGINAL_HASH" != "$TAMPERED_HASH" ]; then
    echo "✅ Tampering detected! Hashes don't match."
    echo "   This proves the system can detect file modifications."
else
    echo "❌ Error: Hashes match (shouldn't happen)"
fi

# Cleanup
rm /tmp/original_evidence
```

Run it:
```bash
chmod +x test_tampering.sh
./test_tampering.sh 1 QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA
```

---

## 4. Judge's Guide to Document Verification {#judge-verification}

### Method 1: Using Judge Dashboard (Web Interface)

1. **Login as Judge**
   - Go to: http://localhost:3000
   - Login with judge credentials

2. **View All Evidence**
   - Judge dashboard shows all evidence from all officers
   - Each evidence shows:
     - Evidence ID
     - File name
     - Officer name
     - Upload timestamp
     - Status (sealed/verified/tampered)

3. **Verify Evidence**
   - Click "Verify Integrity" button on any evidence
   - System automatically:
     - Downloads file from IPFS using IPFS hash
     - Recalculates SHA-256 hash
     - Retrieves original hash from blockchain
     - Compares hashes
     - Shows result: ✅ "100% Authentic" or ❌ "Tampered"

4. **View Verification Details**
   - Original hash from blockchain
   - Current hash of downloaded file
   - IPFS CID
   - Collector information
   - Timestamps

### Method 2: Using API (Programmatic)

**Verify Evidence:**
```bash
# Get JWT token first (login as judge)
TOKEN="your_judge_jwt_token"

# Verify evidence
curl -X POST http://localhost:5000/api/verification/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "evidenceId": 1,
  "fileName": "evidence.pdf",
  "verificationResult": "100% Authentic",
  "isAuthentic": true,
  "details": {
    "originalHash": "0x7f8a9b2c3d4e5f6a...",
    "currentHash": "0x7f8a9b2c3d4e5f6a...",
    "fileHash": "abc123def456...",
    "ipfsHash": "QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA",
    "collector": "Officer John Doe",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "blockchainTimestamp": "2024-01-15T10:30:05.000Z"
  }
}
```

**View Verification History:**
```bash
curl -X GET http://localhost:5000/api/verification/1/history \
  -H "Authorization: Bearer $TOKEN"
```

### Method 3: Manual Verification (Advanced)

**Step 1: Get Evidence Metadata from MongoDB**
```bash
mongosh trustchain --eval 'db.evidences.findOne({evidenceId: 1}).pretty()'
```

**Step 2: Download File from IPFS**
```bash
# Get IPFS hash from MongoDB
IPFS_HASH="QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA"
ipfs get "$IPFS_HASH" -o /tmp/judge_evidence
```

**Step 3: Calculate File Hash**
```bash
FILE_HASH=$(sha256sum /tmp/judge_evidence | cut -d' ' -f1)
echo "File Hash: $FILE_HASH"
```

**Step 4: Get Original Hash from Blockchain**
```bash
cd blockchain
npx hardhat console --network localhost
```

```javascript
const data = require("./deployment.json")
const ChainOfCustody = await ethers.getContractFactory("ChainOfCustody")
const coc = await ChainOfCustody.attach(data.contractAddress)

const result = await coc.getOriginalHash(1)
console.log("Blockchain Hash:", result.hash)
```

**Step 5: Compare**
- If hashes match → Document is authentic ✅
- If hashes don't match → Document is tampered ❌

### Verification Checklist for Judge

- [ ] Evidence ID matches case file
- [ ] Officer name matches chain of custody records
- [ ] Timestamp is consistent with case timeline
- [ ] Verification shows "100% Authentic"
- [ ] Original hash matches current hash
- [ ] IPFS hash is valid and file downloads successfully
- [ ] No discrepancies in blockchain timestamp vs MongoDB timestamp

---

## 5. Fetching Documents from IPFS {#fetching-documents}

### Method 1: Through Web Application (Officer/Judge/Lawyer)

**For Officers:**
1. Login to officer dashboard
2. View "My Evidence" list
3. Click on any evidence
4. Click "Download" or "View" button
5. System automatically fetches from IPFS using stored IPFS hash

**API Endpoint Used:**
```
GET /api/evidence/:evidenceId/download
```

### Method 2: Using API Directly

```bash
# Get JWT token (login first)
TOKEN="your_jwt_token"

# Download evidence file
curl -X GET "http://localhost:5000/api/evidence/1/download" \
  -H "Authorization: Bearer $TOKEN" \
  -o downloaded_evidence.pdf
```

**For Judge/Lawyer (see all evidence):**
```bash
# Get all evidence list
curl -X GET "http://localhost:5000/api/evidence" \
  -H "Authorization: Bearer $TOKEN"

# Then download specific evidence
curl -X GET "http://localhost:5000/api/evidence/1/download" \
  -H "Authorization: Bearer $TOKEN" \
  -o evidence_file.pdf
```

### Method 3: Direct IPFS Access

**Step 1: Get IPFS Hash from MongoDB**
```bash
mongosh trustchain --eval 'db.evidences.findOne({evidenceId: 1}, {ipfsHash: 1, fileName: 1})'
```

**Step 2: Download from IPFS**
```bash
# Using IPFS CLI
ipfs get QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA -o downloaded_file

# Using IPFS Gateway (public)
curl "https://ipfs.io/ipfs/QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA" -o file

# Using local gateway
curl "http://localhost:8080/ipfs/QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA" -o file
```

**Step 3: View File**
```bash
# Text files
cat downloaded_file

# PDF files
xdg-open downloaded_file  # Linux
open downloaded_file      # macOS

# Images
xdg-open downloaded_file
```

### Method 4: Programmatic Fetch (Node.js)

```javascript
const { downloadFromIPFS } = require('./server/services/ipfs');
const Evidence = require('./server/models/Evidence');

async function fetchEvidenceByOfficer(officerId) {
  // Get evidence from MongoDB
  const evidences = await Evidence.find({ collectorId: officerId });
  
  for (const evidence of evidences) {
    console.log(`Fetching: ${evidence.fileName} (IPFS: ${evidence.ipfsHash})`);
    
    // Download from IPFS
    const result = await downloadFromIPFS(evidence.ipfsHash);
    
    // Save to file system
    const fs = require('fs');
    fs.writeFileSync(`./downloads/${evidence.fileName}`, result.buffer);
    
    console.log(`✅ Downloaded: ${evidence.fileName}`);
  }
}

// Usage
fetchEvidenceByOfficer('officer_mongodb_id');
```

### Complete Fetch Script

Create `fetch_officer_evidence.js`:

```javascript
const mongoose = require('mongoose');
const Evidence = require('./server/models/Evidence');
const { downloadFromIPFS } = require('./server/services/ipfs');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trustchain';

async function fetchOfficerEvidence(officerEmail) {
  await mongoose.connect(MONGODB_URI);
  
  const User = mongoose.model('User');
  const officer = await User.findOne({ email: officerEmail, role: 'officer' });
  
  if (!officer) {
    console.error('Officer not found');
    process.exit(1);
  }
  
  const evidences = await Evidence.find({ collectorId: officer._id });
  
  console.log(`Found ${evidences.length} evidence files from ${officer.name}`);
  
  const downloadDir = path.join(__dirname, 'downloads', officer.email);
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }
  
  for (const evidence of evidences) {
    try {
      console.log(`\n📥 Downloading: ${evidence.fileName}`);
      console.log(`   IPFS Hash: ${evidence.ipfsHash}`);
      
      const result = await downloadFromIPFS(evidence.ipfsHash);
      
      const filePath = path.join(downloadDir, evidence.fileName);
      fs.writeFileSync(filePath, result.buffer);
      
      console.log(`✅ Saved to: ${filePath}`);
    } catch (error) {
      console.error(`❌ Error downloading ${evidence.fileName}:`, error.message);
    }
  }
  
  await mongoose.disconnect();
}

// Usage: node fetch_officer_evidence.js officer@example.com
fetchOfficerEvidence(process.argv[2]);
```

Run it:
```bash
node fetch_officer_evidence.js officer@demo.local
```

---

## 6. Complete Anti-Tampering Workflow {#anti-tampering-workflow}

### Overview: How the System Prevents Data Tampering

The system uses a **three-layer security architecture**:

1. **IPFS Layer**: Decentralized file storage (immutable by design)
2. **Blockchain Layer**: Immutable hash record
3. **MongoDB Layer**: Metadata and indexing

### Complete Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    EVIDENCE UPLOAD WORKFLOW                      │
└─────────────────────────────────────────────────────────────────┘

1. OFFICER UPLOADS FILE
   └─> File Buffer in Memory
       │
       ├─> [STEP 1] Calculate SHA-256 Hash
       │   └─> fileHash = SHA256(fileBuffer)
       │
       ├─> [STEP 2] Upload to IPFS
       │   └─> ipfsHash (CID) = IPFS.add(fileBuffer)
       │       └─> File stored on IPFS network
       │
       ├─> [STEP 3] Convert Hash to Bytes32
       │   └─> hashBytes32 = keccak256(fileHash)
       │
       └─> [STEP 4] Store Hash on Blockchain
           └─> evidenceId = blockchain.addEvidence(hashBytes32)
               └─> Hash permanently recorded (IMMUTABLE)
           │
           └─> [STEP 5] Save Metadata to MongoDB
               └─> Store: evidenceId, ipfsHash, fileHash, blockchainHash
```

```
┌─────────────────────────────────────────────────────────────────┐
│                  EVIDENCE VERIFICATION WORKFLOW                  │
└─────────────────────────────────────────────────────────────────┘

1. JUDGE REQUESTS VERIFICATION
   │
   ├─> [STEP 1] Get Evidence Metadata from MongoDB
   │   └─> Retrieve: evidenceId, ipfsHash, fileHash
   │
   ├─> [STEP 2] Download File from IPFS
   │   └─> fileBuffer = IPFS.get(ipfsHash)
   │       └─> Downloads original file content
   │
   ├─> [STEP 3] Recalculate File Hash
   │   └─> currentHash = SHA256(fileBuffer)
   │   └─> currentHashBytes32 = keccak256(currentHash)
   │
   ├─> [STEP 4] Get Original Hash from Blockchain
   │   └─> originalHashBytes32 = blockchain.getOriginalHash(evidenceId)
   │       └─> Retrieves immutable hash stored during upload
   │
   └─> [STEP 5] Compare Hashes
       │
       ├─> IF currentHashBytes32 == originalHashBytes32
       │   └─> ✅ "100% Authentic" - File NOT tampered
       │
       └─> IF currentHashBytes32 != originalHashBytes32
           └─> ❌ "Tampered" - File HAS been modified
```

### Detailed Anti-Tampering Mechanisms

#### Mechanism 1: Cryptographic Hashing

**SHA-256 Hash Function:**
- Any change to file content (even 1 bit) produces completely different hash
- One-way function: cannot reverse hash to get original file
- Deterministic: same file always produces same hash

**Example:**
```
Original file: "Evidence Document"
SHA-256: abc123def456...

Modified file: "Evidence DocumentX" (added 1 character)
SHA-256: xyz789uvw012... (completely different!)
```

#### Mechanism 2: Blockchain Immutability

**Blockchain Storage:**
- Hash is stored in smart contract on blockchain
- Blockchain is immutable (cannot be changed once written)
- Even if MongoDB is compromised, blockchain hash remains secure

**Smart Contract Function:**
```solidity
function addEvidence(bytes32 _hash, address _collector) external returns (uint256) {
    // Hash is permanently stored
    evidenceRecords[evidenceId] = Evidence({
        hash: _hash,  // This can NEVER be changed
        collector: _collector,
        timestamp: block.timestamp,
        exists: true
    });
}
```

#### Mechanism 3: IPFS Content Addressing

**IPFS Properties:**
- Content-addressed: File content determines the hash (CID)
- If file is modified, IPFS creates new CID
- Original file remains accessible at original CID
- Prevents replacement attacks

#### Mechanism 4: Three-Point Verification

**Verification Points:**
1. **MongoDB Metadata**: Contains IPFS hash, file hash, blockchain transaction hash
2. **IPFS Storage**: Contains actual file content
3. **Blockchain Record**: Contains immutable file hash

**Attack Scenarios & Protection:**

**Scenario 1: Someone modifies file on IPFS**
- ❌ **Impossible**: IPFS is content-addressed. Modified file = new CID
- ✅ **Protection**: System uses original IPFS CID. Modified file won't be found.

**Scenario 2: Someone modifies MongoDB record**
- ⚠️ **Possible**: MongoDB can be modified
- ✅ **Protection**: Verification always checks blockchain (immutable)
- ✅ **Result**: Even if MongoDB shows wrong data, blockchain hash reveals tampering

**Scenario 3: Someone replaces file on IPFS with same name**
- ❌ **Impossible**: Different file content = different CID
- ✅ **Protection**: Original CID stored in blockchain cannot be changed

**Scenario 4: Someone modifies blockchain**
- ❌ **Impossible**: Blockchain is immutable. Requires 51% attack on entire network.

**Scenario 5: Officer uploads, then modifies file locally**
- ✅ **Detection**: When verified, current hash won't match blockchain hash
- ✅ **Result**: Status changes to "tampered"

### Complete Workflow Example

**Upload Flow:**
```
1. Officer uploads "crime_photo.jpg" (2MB)
   ↓
2. System calculates: fileHash = "abc123..."
   ↓
3. System uploads to IPFS → gets CID: "QmXwnW..."
   ↓
4. System converts hash: bytes32 = keccak256("abc123...")
   ↓
5. System calls blockchain.addEvidence(bytes32, officerAddress)
   ↓
6. Blockchain returns: evidenceId = 1, txHash = "0xdef456..."
   ↓
7. System saves to MongoDB:
   {
     evidenceId: 1,
     fileName: "crime_photo.jpg",
     ipfsHash: "QmXwnW...",
     fileHash: "abc123...",
     blockchainHash: "0xdef456...",
     status: "sealed"
   }
```

**Verification Flow:**
```
1. Judge clicks "Verify Evidence #1"
   ↓
2. System gets from MongoDB:
   - evidenceId: 1
   - ipfsHash: "QmXwnW..."
   ↓
3. System downloads from IPFS:
   - fileBuffer = IPFS.get("QmXwnW...")
   ↓
4. System recalculates hash:
   - currentHash = SHA256(fileBuffer) = "abc123..."
   - currentBytes32 = keccak256("abc123...")
   ↓
5. System gets from blockchain:
   - originalBytes32 = blockchain.getOriginalHash(1)
   ↓
6. System compares:
   - currentBytes32 == originalBytes32? → YES ✅
   ↓
7. Result: "100% Authentic"
   - Status updated in MongoDB: "verified"
```

**Tampering Detection Flow:**
```
1. Attacker modifies file on IPFS (hypothetically)
   ↓
2. Judge verifies Evidence #1
   ↓
3. System downloads modified file:
   - fileBuffer = IPFS.get("QmXwnW...") → Gets modified file
   ↓
4. System recalculates:
   - currentHash = SHA256(modifiedFile) = "xyz789..." (different!)
   - currentBytes32 = keccak256("xyz789...")
   ↓
5. System gets from blockchain:
   - originalBytes32 = blockchain.getOriginalHash(1) = "abc123..."
   ↓
6. System compares:
   - currentBytes32 != originalBytes32 → NO ❌
   ↓
7. Result: "Tampered"
   - Status updated: "tampered"
   - Judge is alerted
```

### Security Guarantees

✅ **File Content Integrity**: SHA-256 hash ensures any modification is detected
✅ **Storage Immutability**: Blockchain ensures hash record cannot be altered
✅ **Decentralized Storage**: IPFS ensures file availability even if server is down
✅ **Audit Trail**: All operations timestamped on blockchain
✅ **Chain of Custody**: Collector address permanently recorded

---

## 7. Viewing User Data in MongoDB {#viewing-mongodb-data}

### Database Connection Details

**Database Name:** `trustchain`
**Default URI:** `mongodb://localhost:27017/trustchain`

### Collections in MongoDB

1. **users** - User accounts (officers, judges, lawyers)
2. **evidences** - Evidence metadata and IPFS/blockchain hashes

### Method 1: Using MongoDB Shell (mongosh)

**Connect to MongoDB:**
```bash
mongosh
# or
mongosh "mongodb://localhost:27017/trustchain"
```

**Switch to Database:**
```javascript
use trustchain
```

**View All Users:**
```javascript
// List all users
db.users.find().pretty()

// Count users
db.users.countDocuments()

// View users by role
db.users.find({role: "officer"}).pretty()
db.users.find({role: "judge"}).pretty()
db.users.find({role: "lawyer"}).pretty()
```

**View Specific User:**
```javascript
// By email
db.users.findOne({email: "officer@demo.local"}).pretty()

// By ID
db.users.findOne({_id: ObjectId("...")}).pretty()

// By name
db.users.find({name: /John/i}).pretty()
```

**View User Fields:**
```javascript
// View only specific fields
db.users.find({}, {
  name: 1,
  email: 1,
  role: 1,
  walletAddress: 1,
  createdAt: 1
}).pretty()
```

### Method 2: Using Command Line (One-liners)

**View All Users:**
```bash
mongosh trustchain --eval "db.users.find().pretty()"
```

**Count Users by Role:**
```bash
mongosh trustchain --eval "db.users.aggregate([{$group: {_id: '$role', count: {$sum: 1}}}])"
```

**Find User by Email:**
```bash
mongosh trustchain --eval 'db.users.findOne({email: "officer@demo.local"}).pretty()'
```

**Export Users to JSON:**
```bash
mongoexport --db=trustchain --collection=users --out=users.json --pretty
```

### Method 3: Using Node.js Script

Create `view_users.js`:

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', userSchema);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trustchain';

async function viewUsers() {
  await mongoose.connect(MONGODB_URI);
  
  console.log('\n=== ALL USERS ===\n');
  const users = await User.find({});
  users.forEach((user, index) => {
    console.log(`User ${index + 1}:`);
    console.log(`  ID: ${user._id}`);
    console.log(`  Name: ${user.name}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Role: ${user.role}`);
    console.log(`  Wallet: ${user.walletAddress || 'Not set'}`);
    console.log(`  Created: ${user.createdAt}`);
    console.log('');
  });
  
  console.log('\n=== USERS BY ROLE ===\n');
  const roleCounts = await User.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ]);
  roleCounts.forEach(role => {
    console.log(`${role._id}: ${role.count} users`);
  });
  
  await mongoose.disconnect();
}

viewUsers().catch(console.error);
```

Run it:
```bash
node view_users.js
```

### Method 4: Using MongoDB Compass (GUI)

1. **Install MongoDB Compass** (if not installed)
   - Download from: https://www.mongodb.com/products/compass

2. **Connect to Database**
   - Connection String: `mongodb://localhost:27017`
   - Database: `trustchain`

3. **Browse Collections**
   - Click on `users` collection
   - View documents in table or JSON format
   - Use filters and search

### Complete User Data Query Examples

**All Officers:**
```javascript
db.users.find({role: "officer"}, {
  name: 1,
  email: 1,
  walletAddress: 1,
  createdAt: 1,
  _id: 0
}).pretty()
```

**Users Created in Last 7 Days:**
```javascript
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

db.users.find({
  createdAt: { $gte: sevenDaysAgo }
}).pretty()
```

**Users with Wallet Address:**
```javascript
db.users.find({
  walletAddress: { $exists: true, $ne: "" }
}).pretty()
```

**Users Without Wallet Address:**
```javascript
db.users.find({
  $or: [
    { walletAddress: { $exists: false } },
    { walletAddress: "" }
  ]
}).pretty()
```

**Sort Users by Creation Date:**
```javascript
db.users.find().sort({createdAt: -1}).pretty()
```

**Get User Statistics:**
```javascript
// Total users
db.users.countDocuments()

// By role
db.users.aggregate([
  {
    $group: {
      _id: "$role",
      count: { $sum: 1 },
      users: { $push: { name: "$name", email: "$email" } }
    }
  }
]).pretty()
```

### Viewing Evidence Data (Related)

**Evidence Uploaded by Specific User:**
```javascript
// First, get user ID
const user = db.users.findOne({email: "officer@demo.local"})

// Then find evidence
db.evidences.find({collectorId: user._id}).pretty()
```

**All Evidence with User Details:**
```javascript
db.evidences.find().populate('collectorId').pretty()
// Note: populate might not work in mongosh, use aggregation instead:

db.evidences.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "collectorId",
      foreignField: "_id",
      as: "collector"
    }
  }
]).pretty()
```

### Quick Reference Commands

```bash
# Connect to MongoDB
mongosh trustchain

# View all users
db.users.find().pretty()

# View all evidence
db.evidences.find().pretty()

# Count documents
db.users.countDocuments()
db.evidences.countDocuments()

# Find by email
db.users.findOne({email: "judge@demo.local"})

# Find evidence by IPFS hash
db.evidences.findOne({ipfsHash: "QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA"})

# Find evidence by evidenceId
db.evidences.findOne({evidenceId: 1})

# Export to JSON
mongoexport --db=trustchain --collection=users --out=users.json
```

---

## Summary

### Key Takeaways

1. **IPFS Hash (CID)**: Used to locate and download files from IPFS network
2. **Blockchain Hash**: Immutable record of file integrity (SHA-256 converted to bytes32)
3. **Tampering Detection**: System compares current file hash with blockchain hash
4. **Three-Layer Security**: IPFS (storage) + Blockchain (immutable hash) + MongoDB (metadata)
5. **Judge Verification**: Can verify any evidence through web interface or API
6. **MongoDB Access**: Use `mongosh trustchain` to view user and evidence data

### Testing Checklist

- [ ] Test IPFS hash retrieval
- [ ] Test blockchain hash verification
- [ ] Test tampering detection (modify file and verify)
- [ ] Test judge verification workflow
- [ ] Test document download from IPFS
- [ ] View users in MongoDB
- [ ] View evidence records in MongoDB

---

**Last Updated:** 2024
**Project:** TrustChain - Blockchain-based Digital Evidence Chain of Custody System

