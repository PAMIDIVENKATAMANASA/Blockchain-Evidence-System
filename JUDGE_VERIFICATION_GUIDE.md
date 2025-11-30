# Judge Verification Guide - Step by Step

## IPFS Hash: `QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA`

### Method 1: Using Judge Dashboard (Recommended)

1. **Login as Judge**
   - Go to http://localhost:3000
   - Login with Judge credentials (e.g., `judge@demo.local`)

2. **Find the Evidence**
   - In Judge Dashboard, you'll see all evidence records
   - Look for the one with IPFS Hash: `QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA`

3. **Click "Verify Integrity"**
   - The system automatically:
     - Downloads file from IPFS
     - Recalculates hash
     - Compares with blockchain
     - Shows result: ✅ "100% Authentic" or ❌ "Tampered"

---

### Method 2: Manual Verification via IPFS Commands

#### Step 1: Download the File from IPFS

```bash
# Download the file using the CID
ipfs get QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA -o downloaded_evidence

# Check what was downloaded
ls -lh downloaded_evidence

# View file info
file downloaded_evidence
```

#### Step 2: View File Contents (if text-based)

```bash
# If it's a text file
cat downloaded_evidence

# If it's an image (view with image viewer)
# xdg-open downloaded_evidence  # Linux
# open downloaded_evidence      # macOS
```

#### Step 3: Calculate File Hash Manually

```bash
# Calculate SHA-256 hash (same method used by system)
sha256sum downloaded_evidence

# Or using openssl
openssl dgst -sha256 downloaded_evidence
```

#### Step 4: Check Blockchain Record

```bash
cd /home/manasa/Blockchain/blockchain
npx hardhat console --network localhost
```

Then in the console:

```js
const data = require("../deployment.json")
const ChainOfCustody = await ethers.getContractFactory("ChainOfCustody")
const coc = await ChainOfCustody.attach(data.contractAddress)

// Find which evidenceId has this hash
// You'll need to check MongoDB for the evidenceId first
// Then:
await coc.getOriginalHash(1)  // Replace 1 with actual evidenceId
```

#### Step 5: Compare Hashes

- The blockchain stores: `bytes32` hash (keccak256 of SHA256)
- Your calculated hash: SHA256 hex string
- Convert your hash to match blockchain format for comparison

---

### Method 3: Check via MongoDB

```bash
mongosh
use trustchain

# Find evidence with this IPFS hash
db.evidences.find({ ipfsHash: "QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA" }).pretty()

# This will show:
# - evidenceId
# - fileName
# - fileType
# - fileSize
# - blockchainHash (transaction hash)
# - fileHash (SHA256 hash)
# - status (sealed/verified/tampered)
# - collector info
# - timestamp
```

---

### Quick Verification Script

Save this as `verify_evidence.sh`:

```bash
#!/bin/bash
CID="QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA"

echo "📥 Downloading from IPFS..."
ipfs get $CID -o /tmp/evidence_file

echo "📊 File Info:"
ls -lh /tmp/evidence_file
file /tmp/evidence_file

echo "🔐 SHA-256 Hash:"
sha256sum /tmp/evidence_file

echo "✅ File downloaded to: /tmp/evidence_file"
echo "🔍 Check MongoDB for blockchain hash comparison"
```

Make it executable:
```bash
chmod +x verify_evidence.sh
./verify_evidence.sh
```

