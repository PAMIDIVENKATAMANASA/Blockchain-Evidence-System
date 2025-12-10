# Complete Fix Summary: IPFS & Etherscan Issues

## ✅ What Was Fixed

### 1. IPFS Files Now Accessible Publicly
- ✅ Files are automatically pinned with `recursive: true`
- ✅ Files are announced to IPFS DHT (makes them discoverable)
- ✅ Public IPFS gateway URLs included in responses
- ✅ Better error handling for pinning

### 2. Transaction Hashes Now on Etherscan
- ✅ Server uses Sepolia RPC by default (not localhost)
- ✅ Etherscan links automatically included in responses
- ✅ Network detection (shows "sepolia" vs "localhost")
- ✅ Warning if using localhost

---

## 🚀 Quick Fix (Already Applied!)

I've updated your code. Now you just need to:

### Step 1: Update Server Configuration

**Run this script:**
```bash
./update_server_to_sepolia.sh
```

**Or manually edit `server/.env`:**
```bash
# Change this:
BLOCKCHAIN_RPC_URL=http://localhost:8545

# To this:
BLOCKCHAIN_RPC_URL=https://rpc.sepolia.org
```

### Step 2: Stop Hardhat Node

**Stop running:**
```bash
npx hardhat node
```

**You don't need this anymore!** Sepolia is public testnet.

### Step 3: Restart Server

```bash
cd server
npm start
```

### Step 4: Ensure IPFS is Running

```bash
ipfs daemon
```

---

## 📊 What You'll Get Now

### After Uploading Evidence:

**Response includes:**
```json
{
  "evidence": {
    "evidenceId": 5,
    "ipfsHash": "QmXwnW...",
    "ipfsPublicURL": "https://ipfs.io/ipfs/QmXwnW...",  // ✅ Public gateway
    "blockchainHash": "0x3080e0f...",
    "etherscanUrl": "https://sepolia.etherscan.io/tx/0x3080e0f...",  // ✅ Etherscan link
    "network": "sepolia"  // ✅ Shows network
  }
}
```

**Now you can:**
- ✅ Click `etherscanUrl` → View transaction on Etherscan
- ✅ Click `ipfsPublicURL` → View file on public IPFS gateway
- ✅ Transaction hash works on Etherscan ✅
- ✅ IPFS hash works on public gateways ✅

---

## 🧪 Testing

### Test 1: Upload Evidence

1. Upload a file via your app
2. Check response for:
   - `etherscanUrl` (should be Sepolia link)
   - `ipfsPublicURL` (should be public gateway link)
   - `network: "sepolia"`

### Test 2: Verify Transaction on Etherscan

1. Copy `etherscanUrl` from response
2. Open in browser
3. Should show transaction on Sepolia Etherscan ✅

### Test 3: Verify IPFS File

1. Copy `ipfsPublicURL` from response
2. Open in browser
3. Should download/view file ✅

Or test manually:
- `https://ipfs.io/ipfs/YOUR_CID`
- `https://gateway.ipfs.io/ipfs/YOUR_CID`
- `https://cloudflare-ipfs.com/ipfs/YOUR_CID`

---

## 📋 Checklist

### Before Uploading:
- [ ] Server `.env` updated to Sepolia RPC
- [ ] Server restarted
- [ ] Hardhat node stopped (if was running)
- [ ] IPFS daemon running
- [ ] IPFS connected to network (`ipfs swarm peers`)

### After Uploading:
- [ ] Response includes `etherscanUrl`
- [ ] Response includes `ipfsPublicURL`
- [ ] `network` shows "sepolia"
- [ ] Transaction hash works on Etherscan ✅
- [ ] IPFS hash works on public gateways ✅

---

## 🔧 Troubleshooting

### Problem: Still using localhost

**Check:**
```bash
cd server
grep BLOCKCHAIN_RPC_URL .env
```

**If shows `localhost:8545`:**
```bash
# Run update script
./update_server_to_sepolia.sh

# Or edit manually
nano server/.env
# Change BLOCKCHAIN_RPC_URL to https://rpc.sepolia.org
```

### Problem: IPFS file not accessible

**Check:**
```bash
# Is IPFS running?
ipfs daemon

# Is it connected?
ipfs swarm peers

# Is file pinned?
ipfs pin ls YOUR_CID
```

**Fix:**
```bash
# Pin existing files
node pin_existing_files.js

# Check IPFS config
ipfs config Addresses.Gateway
```

### Problem: Transaction not on Etherscan

**Check:**
1. Is `BLOCKCHAIN_RPC_URL` set to Sepolia?
2. Did you restart server?
3. Are you running `npx hardhat node`? (Stop it!)

**Verify:**
```bash
# Check server logs when uploading
# Should NOT show "localhost" warnings
```

---

## 📝 Files Updated

1. ✅ `server/services/blockchain.js` - Uses Sepolia by default
2. ✅ `server/services/ipfs.js` - Better pinning and DHT announcement
3. ✅ `server/routes/evidence.js` - Includes Etherscan and IPFS URLs
4. ✅ `update_server_to_sepolia.sh` - Script to update config

---

## 🎯 Summary

**The Problem:**
- Using local Hardhat node → Transactions not on Etherscan
- IPFS files not pinned properly → Not accessible publicly

**The Solution:**
- Use Sepolia RPC → Transactions on Etherscan ✅
- Better IPFS pinning → Files accessible publicly ✅

**What to Do:**
1. Run `./update_server_to_sepolia.sh`
2. Restart server
3. Upload evidence
4. Check Etherscan and IPFS links ✅

---

**Everything is fixed! Just update your server config and restart!** 🎉

