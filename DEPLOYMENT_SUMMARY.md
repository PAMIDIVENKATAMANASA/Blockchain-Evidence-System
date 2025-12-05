# Deployment Summary - Complete Setup Guide

This document summarizes all the changes made to connect your system to MongoDB Atlas and configure IPFS for public gateway access.

## 📋 What Was Configured

### 1. ✅ MongoDB Atlas Connection
- Created complete setup guide: `MONGODB_ATLAS_SETUP.md`
- Server already configured to use `MONGODB_URI` environment variable
- Created test script: `test_mongodb_atlas.js`

### 2. ✅ IPFS Public Gateway
- Created complete setup guide: `IPFS_PUBLIC_GATEWAY_SETUP.md`
- Updated IPFS service to include `getPublicGatewayURL()` function
- Updated evidence routes to return public gateway URLs in responses
- Created test script: `test_ipfs_public_gateway.js`

### 3. ✅ Complete Testing Workflow
- Created comprehensive testing guide: `COMPLETE_TESTING_WORKFLOW.md`
- Includes step-by-step workflow for tampering detection
- Includes all testing phases and checklists

## 🚀 Quick Start Guide

### Step 1: Connect to MongoDB Atlas

1. **Get MongoDB Atlas Connection String**
   - Create account at https://www.mongodb.com/cloud/atlas
   - Create cluster and database user
   - Get connection string

2. **Update Environment Variables**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env and add your MongoDB Atlas connection string
   ```

3. **Test Connection**
   ```bash
   node test_mongodb_atlas.js
   ```

### Step 2: Configure IPFS Public Gateway

1. **Configure IPFS**
   ```bash
   # Set gateway to be accessible publicly
   ipfs config Addresses.Gateway /ip4/0.0.0.0/tcp/8080
   ipfs config --bool Gateway.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
   
   # Restart IPFS daemon
   ipfs daemon
   ```

2. **Get Your Public IP**
   ```bash
   curl ifconfig.me
   ```

3. **Update Environment Variables**
   ```bash
   # In server/.env, add:
   IPFS_GATEWAY_URL=http://YOUR_PUBLIC_IP:8080
   ```

4. **Test Gateway**
   ```bash
   node test_ipfs_public_gateway.js QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA
   ```

### Step 3: Follow Testing Workflow

1. **Read Complete Testing Guide**
   ```bash
   cat COMPLETE_TESTING_WORKFLOW.md
   ```

2. **Run Through Testing Phases**
   - Phase 1: Setup and Preparation
   - Phase 2: Upload Evidence
   - Phase 3: Verify Authentic Document
   - Phase 4: Test Tampering Detection
   - Phase 5: Test Public Gateway
   - Phase 6: Verify MongoDB Atlas

## 📝 Environment Variables

Create `server/.env` file with:

```bash
# MongoDB Atlas (replace with your connection string)
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/trustchain?retryWrites=true&w=majority

# IPFS Public Gateway (replace with your public IP)
IPFS_GATEWAY_URL=http://YOUR_PUBLIC_IP:8080

# Other existing variables
PORT=5000
JWT_SECRET=your-super-secret-jwt-key
BLOCKCHAIN_RPC_URL=http://localhost:8545
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
IPFS_URL=http://localhost:5001
```

See `server/.env.example` for complete template.

## 🧪 Testing Scripts

All test scripts are in the root directory:

1. **Test MongoDB Atlas Connection**
   ```bash
   node test_mongodb_atlas.js
   ```

2. **Test IPFS Public Gateway**
   ```bash
   node test_ipfs_public_gateway.js <CID>
   ```

3. **Test Hash Comparison**
   ```bash
   node test_hash_comparison.js <evidenceId>
   ```

4. **Test Tampering Detection**
   ```bash
   ./test_tampering_detection.sh
   ```

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `MONGODB_ATLAS_SETUP.md` | Complete guide to connect MongoDB Atlas |
| `IPFS_PUBLIC_GATEWAY_SETUP.md` | Complete guide to configure IPFS public gateway |
| `COMPLETE_TESTING_WORKFLOW.md` | Step-by-step testing workflow for tampering detection |
| `COMPREHENSIVE_GUIDE.md` | Original comprehensive guide (all questions answered) |
| `QUICK_REFERENCE.md` | Quick command reference |

## ✅ Checklist

### MongoDB Atlas Setup
- [ ] MongoDB Atlas account created
- [ ] Cluster created and running
- [ ] Database user created with proper permissions
- [ ] Network access configured (IP whitelisted)
- [ ] Connection string obtained
- [ ] `.env` file updated with `MONGODB_URI`
- [ ] Connection tested successfully
- [ ] Data visible in Atlas dashboard

### IPFS Public Gateway Setup
- [ ] IPFS daemon running
- [ ] Gateway configured on port 8080
- [ ] Gateway accessible from localhost
- [ ] Firewall rules configured (port 8080 open)
- [ ] Port forwarding configured (if behind router)
- [ ] Public IP address obtained
- [ ] `.env` file updated with `IPFS_GATEWAY_URL`
- [ ] Public gateway tested and working
- [ ] Files accessible via public URL

### Testing Workflow
- [ ] All services running (blockchain, server, IPFS, MongoDB)
- [ ] Test accounts created
- [ ] Evidence uploaded successfully
- [ ] Evidence verified as authentic
- [ ] Tampering detection tested
- [ ] Public gateway tested
- [ ] MongoDB Atlas data verified

## 🔄 Migration Steps

### Migrate Data from Local MongoDB to Atlas

If you have existing data in local MongoDB Docker:

```bash
# 1. Export from local MongoDB
mongoexport --uri="mongodb://localhost:27017/trustchain" --collection=users --out=users.json
mongoexport --uri="mongodb://localhost:27017/trustchain" --collection=evidences --out=evidences.json

# 2. Import to MongoDB Atlas
mongoimport --uri="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/trustchain" --collection=users --file=users.json
mongoimport --uri="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/trustchain" --collection=evidences --file=evidences.json
```

## 🎯 Key Changes Made

### Code Changes

1. **`server/services/ipfs.js`**
   - Added `getPublicGatewayURL()` function
   - Exports gateway URL helper

2. **`server/routes/evidence.js`**
   - Includes `getPublicGatewayURL` import
   - Returns `ipfsGatewayURL` in evidence responses
   - Gateway URL included in upload and get responses

3. **Environment Configuration**
   - Created `.env.example` with all required variables
   - Supports both MongoDB Atlas and local MongoDB
   - Supports IPFS public gateway configuration

### No Code Changes Needed

The server already:
- ✅ Uses `MONGODB_URI` from environment variables
- ✅ Works with MongoDB Atlas connection strings
- ✅ Can switch between local and Atlas easily

## 🌐 Public Gateway URLs

Once configured, evidence files will be accessible via:

### Your Own Gateway
```
http://YOUR_PUBLIC_IP:8080/ipfs/<CID>
```

### Public Gateway Services
```
https://ipfs.io/ipfs/<CID>
https://gateway.ipfs.io/ipfs/<CID>
https://cloudflare-ipfs.com/ipfs/<CID>
```

## 📊 API Response Changes

Evidence responses now include public gateway URL:

```json
{
  "evidence": {
    "evidenceId": 1,
    "fileName": "evidence.pdf",
    "ipfsHash": "QmXwnW...",
    "ipfsGatewayURL": "http://YOUR_IP:8080/ipfs/QmXwnW...",
    "blockchainHash": "0x7f8a9b...",
    "status": "sealed"
  }
}
```

## 🔍 Verification Workflow

### Quick Test Flow

1. **Upload Evidence** (Officer)
   - Upload file via web interface
   - Note Evidence ID and IPFS CID

2. **Verify Evidence** (Judge)
   - Login as judge
   - Click "Verify Integrity"
   - Should show: "100% Authentic"

3. **Test Public Access**
   - Open browser: `http://YOUR_IP:8080/ipfs/<CID>`
   - File should be accessible

4. **Check MongoDB Atlas**
   - Login to Atlas dashboard
   - View collections and data

## 🆘 Troubleshooting

### MongoDB Atlas Issues

- **Connection fails**: Check IP whitelist, verify connection string
- **Authentication fails**: Verify username/password
- **Can't see data**: Check database name matches in connection string

### IPFS Gateway Issues

- **Can't access locally**: Check if daemon is running, verify port 8080
- **Can't access publicly**: Check firewall, verify port forwarding
- **CORS errors**: Verify CORS headers in IPFS config

### Testing Issues

- **Verification shows "Tampered"**: Check hash calculation, verify blockchain connection
- **Gateway returns 404**: File may not be pinned, check CID is correct

## 📞 Next Steps

1. ✅ Follow `MONGODB_ATLAS_SETUP.md` to connect Atlas
2. ✅ Follow `IPFS_PUBLIC_GATEWAY_SETUP.md` to configure gateway
3. ✅ Follow `COMPLETE_TESTING_WORKFLOW.md` to test everything
4. ✅ Use test scripts to verify each component
5. ✅ Deploy to production (with proper security)

---

**All setup guides and test scripts are ready! Follow the guides step by step.** 🚀

