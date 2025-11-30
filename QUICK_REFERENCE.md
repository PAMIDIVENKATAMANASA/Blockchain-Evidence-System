# Quick Reference Guide

## 🚀 Quick Commands

### View Users in MongoDB

```bash
# View all users
./view_mongodb_users.sh all

# View only officers
./view_mongodb_users.sh officers

# View only judges
./view_mongodb_users.sh judges

# View only lawyers
./view_mongodb_users.sh lawyers

# Count users by role
./view_mongodb_users.sh count

# Find specific user
./view_mongodb_users.sh user@email.com
```

### Test Hash Comparison

```bash
# Compare IPFS hash with blockchain hash for specific evidence
node test_hash_comparison.js <evidenceId>

# Example:
node test_hash_comparison.js 1
```

### Test Tampering Detection

```bash
# Run tampering detection demonstration
./test_tampering_detection.sh
```

### Fetch Officer Evidence

```bash
# Get all evidence uploaded by an officer
node fetch_officer_evidence.js <officer_email>

# Example:
node fetch_officer_evidence.js officer@demo.local
```

## 📋 Common MongoDB Queries

### Connect to MongoDB
```bash
mongosh trustchain
```

### View All Users
```javascript
db.users.find().pretty()
```

### View All Evidence
```javascript
db.evidences.find().pretty()
```

### Find Evidence by IPFS Hash
```javascript
db.evidences.findOne({ipfsHash: "QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA"})
```

### Find Evidence by Evidence ID
```javascript
db.evidences.findOne({evidenceId: 1})
```

### Find Users by Role
```javascript
db.users.find({role: "officer"}).pretty()
db.users.find({role: "judge"}).pretty()
db.users.find({role: "lawyer"}).pretty()
```

### Count Users
```javascript
db.users.countDocuments()
db.users.aggregate([{$group: {_id: "$role", count: {$sum: 1}}}])
```

## 🔐 Testing Hashes

### Download from IPFS
```bash
ipfs get <IPFS_HASH> -o downloaded_file
```

### Calculate SHA-256 Hash
```bash
sha256sum downloaded_file
# or
openssl dgst -sha256 downloaded_file
```

### Check Blockchain Hash
```bash
cd blockchain
npx hardhat console --network localhost
```
```javascript
const data = require("./deployment.json")
const ChainOfCustody = await ethers.getContractFactory("ChainOfCustody")
const coc = await ChainOfCustody.attach(data.contractAddress)
await coc.getOriginalHash(1)  // Replace 1 with evidenceId
```

## ⚖️ Judge Verification

### Via Web Interface
1. Login at http://localhost:3000
2. Go to Judge Dashboard
3. Click "Verify Integrity" on any evidence

### Via API
```bash
# Login first to get JWT token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"judge@demo.local","password":"password"}'

# Verify evidence (replace TOKEN and evidenceId)
curl -X POST http://localhost:5000/api/verification/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📥 Download Evidence

### Via Web Interface
1. Login as Officer/Judge/Lawyer
2. Navigate to evidence list
3. Click "Download" or "View"

### Via API
```bash
curl -X GET http://localhost:5000/api/evidence/1/download \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -o evidence_file.pdf
```

### Via IPFS Directly
```bash
ipfs get QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA -o file
```

## 🧪 Testing Tampering

### Manual Test
1. Download file from IPFS
2. Modify the file
3. Recalculate hash
4. Compare with blockchain hash
5. Hashes should be different → tampering detected

### Automated Test
```bash
./test_tampering_detection.sh
```

## 📊 Understanding Hashes

| Type | Example | Purpose | Storage |
|------|---------|---------|---------|
| **IPFS Hash (CID)** | `QmXwnW...` | Find file on IPFS | MongoDB |
| **File Hash (SHA-256)** | `abc123...` | Verify file integrity | MongoDB, Blockchain |
| **Blockchain Hash** | `0x7f8a9b...` | Immutable integrity record | Blockchain |

## 🔄 Complete Workflow

### Upload Evidence
```
File → Calculate SHA-256 → Upload to IPFS → Get CID → 
Convert hash to bytes32 → Store on Blockchain → Save metadata to MongoDB
```

### Verify Evidence
```
Get metadata from MongoDB → Download from IPFS → Recalculate hash → 
Get hash from Blockchain → Compare → Result (Authentic/Tampered)
```

## 🆘 Troubleshooting

### IPFS Not Working
```bash
# Check if IPFS daemon is running
ipfs id

# Start IPFS daemon if not running
ipfs daemon
```

### Blockchain Not Working
```bash
# Check if Hardhat node is running
curl http://localhost:8545

# Start Hardhat node
cd blockchain
npx hardhat node
```

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ping')"

# Connect manually
mongosh "mongodb://localhost:27017/trustchain"
```

## 📚 More Information

- **Complete Guide**: See `COMPREHENSIVE_GUIDE.md`
- **Judge Verification**: See `JUDGE_VERIFICATION_GUIDE.md`
- **Project Structure**: See `PROJECT_STRUCTURE.md`
- **Quick Start**: See `QUICK_START.md`

