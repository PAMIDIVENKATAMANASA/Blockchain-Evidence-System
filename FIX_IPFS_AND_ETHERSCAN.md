# Fix: IPFS Files Not Accessible & Transaction Hash Not on Etherscan

## 🔍 Problems Identified

1. **IPFS files not accessible on internet** - Files need proper pinning and DHT announcement
2. **Transaction hash not showing on Etherscan** - Using local Hardhat node instead of Sepolia

## ✅ Solutions Applied

### Fix 1: IPFS Files Now Properly Pinned

**What was fixed:**
- Files are now pinned with `recursive: true`
- Files are announced to IPFS DHT (makes them discoverable)
- Better error handling for pinning

**What you need to do:**
1. **Ensure IPFS daemon is running:**
   ```bash
   ipfs daemon
   ```

2. **Check IPFS is connected to network:**
   ```bash
   ipfs swarm peers
   ```
   Should show connected peers (if 0, add bootstrap nodes)

3. **After uploading, files will be:**
   - ✅ Pinned locally
   - ✅ Announced to DHT
   - ✅ Accessible via public gateways

### Fix 2: Use Sepolia Network Instead of Localhost

**What was fixed:**
- Server now uses Sepolia RPC by default
- Transaction hashes will be from Sepolia (visible on Etherscan)
- Etherscan links automatically included in responses

**What you need to do:**

#### Step 1: Update Server Environment Variables

Edit `server/.env`:

```bash
# Use Sepolia RPC (NOT localhost)
BLOCKCHAIN_RPC_URL=https://rpc.sepolia.org

# Or use your Infura URL:
# BLOCKCHAIN_RPC_URL=https://sepolia.infura.io/v3/7131a74d24af420298d28095445bef38

# Your private key
PRIVATE_KEY=0x6f1c58178a7ec68531d13b950a58a7d6c553633759fd9f53310be3982398ee67

# Other variables...
MONGODB_URI=...
IPFS_URL=http://localhost:5001
IPFS_GATEWAY_URL=http://YOUR_PUBLIC_IP:8080
```

#### Step 2: Restart Server

```bash
cd server
npm start
```

#### Step 3: Verify Configuration

Check server logs - should show:
```
🚀 TrustChain Server running on port 5000
```

**Important:** Make sure you're NOT running `npx hardhat node` - that's only for local testing!

---

## 🧪 Testing

### Test 1: Upload Evidence

1. Upload a file via your app
2. Check the response - should include:
   - `etherscanUrl`: Link to transaction on Etherscan
   - `network`: "sepolia"
   - `ipfsPublicURL`: Public IPFS gateway link

### Test 2: Check Transaction on Etherscan

1. Copy the `etherscanUrl` from upload response
2. Open in browser
3. Should show transaction details ✅

### Test 3: Check IPFS File

1. Copy the `ipfsPublicURL` from upload response
2. Open in browser
3. Should download/view the file ✅

Or use public gateways:
- `https://ipfs.io/ipfs/YOUR_CID`
- `https://gateway.ipfs.io/ipfs/YOUR_CID`
- `https://cloudflare-ipfs.com/ipfs/YOUR_CID`

---

## 📋 Complete Setup Checklist

### IPFS Setup

- [ ] IPFS daemon is running (`ipfs daemon`)
- [ ] IPFS connected to network (`ipfs swarm peers` shows peers)
- [ ] IPFS gateway configured (`IPFS_GATEWAY_URL` in `.env`)
- [ ] Files are pinned after upload ✅ (automatic)

### Blockchain Setup

- [ ] Contract deployed to Sepolia (`npm run deploy:sepolia`)
- [ ] Server `.env` has Sepolia RPC URL (NOT localhost)
- [ ] Server `.env` has correct private key
- [ ] Server restarted after config changes
- [ ] NOT running `npx hardhat node` (only for local testing)

### Verification

- [ ] Upload evidence → Get transaction hash
- [ ] Transaction hash works on Etherscan ✅
- [ ] IPFS hash works on public gateways ✅
- [ ] Etherscan link included in response ✅

---

## 🔧 Troubleshooting

### Problem: Transaction hash still not on Etherscan

**Check:**
1. Is `BLOCKCHAIN_RPC_URL` set to Sepolia? (NOT localhost)
2. Did you restart the server after changing `.env`?
3. Are you running `npx hardhat node`? (Stop it - not needed for Sepolia)

**Fix:**
```bash
# Stop hardhat node (if running)
# Update server/.env with Sepolia RPC
# Restart server
cd server
npm start
```

### Problem: IPFS file not accessible

**Check:**
1. Is IPFS daemon running? (`ipfs daemon`)
2. Is IPFS connected to network? (`ipfs swarm peers`)
3. Is file pinned? (`ipfs pin ls YOUR_CID`)

**Fix:**
```bash
# Start IPFS daemon
ipfs daemon

# Check peers
ipfs swarm peers

# If no peers, add bootstrap nodes
ipfs bootstrap add /dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN

# Pin existing files
node pin_existing_files.js
```

### Problem: "Network error" when uploading

**Check:**
1. Is Sepolia RPC URL correct?
2. Do you have Sepolia ETH? (`node check_balance.js`)
3. Is internet connection working?

**Fix:**
- Get Sepolia ETH from faucets
- Verify RPC URL is correct
- Check internet connection

---

## 📝 Expected Response After Upload

```json
{
  "message": "Evidence uploaded and sealed successfully",
  "evidence": {
    "evidenceId": 5,
    "fileName": "example.pdf",
    "ipfsHash": "QmXwnW...",
    "ipfsGatewayURL": "http://YOUR_IP:8080/ipfs/QmXwnW...",
    "ipfsPublicURL": "https://ipfs.io/ipfs/QmXwnW...",
    "blockchainHash": "0x3080e0f285eae82b33edaa41f7ad14c7819def33058cb7e1bd1d1edf98318f55",
    "etherscanUrl": "https://sepolia.etherscan.io/tx/0x3080e0f285eae82b33edaa41f7ad14c7819def33058cb7e1bd1d1edf98318f55",
    "network": "sepolia",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "status": "sealed"
  }
}
```

**Now you can:**
- ✅ Click `etherscanUrl` to view transaction on Etherscan
- ✅ Click `ipfsPublicURL` to view file on public IPFS gateway
- ✅ Verify transaction hash on Etherscan

---

## 🎯 Quick Fix Summary

1. **Update `server/.env`:**
   ```bash
   BLOCKCHAIN_RPC_URL=https://rpc.sepolia.org
   ```

2. **Restart server:**
   ```bash
   cd server
   npm start
   ```

3. **Ensure IPFS is running:**
   ```bash
   ipfs daemon
   ```

4. **Upload evidence** - Now transaction hash will be on Etherscan! ✅

---

**After these fixes, your transaction hashes will show on Etherscan and IPFS files will be accessible!** 🎉

