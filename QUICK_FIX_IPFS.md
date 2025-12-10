# Quick Fix: IPFS Connection Error

## ❌ Problem Found

Your `server/.env` has:
```
IPFS_URL=http://157.48.191.44:8080
```

**This is WRONG!** IPFS API should be on port **5001**, not 8080.

**Port 8080** = IPFS Gateway (for viewing files)  
**Port 5001** = IPFS API (for uploading/downloading)

---

## ✅ Fixed!

I've updated your `server/.env` to:
```
IPFS_URL=http://localhost:5001
```

---

## 🚀 Next Steps

### Step 1: Start IPFS Daemon

**Open a terminal and run:**
```bash
ipfs daemon
```

**Keep this terminal open!** IPFS must be running.

### Step 2: Verify IPFS is Running

**In another terminal:**
```bash
ipfs id
```

**Should show your IPFS node info** (not an error).

### Step 3: Restart Server

```bash
cd server
npm start
```

### Step 4: Test Upload

Upload a file - should work now! ✅

---

## 📋 Configuration Summary

**Correct setup:**

```bash
# server/.env
IPFS_URL=http://localhost:5001          # API port (for upload/download)
IPFS_GATEWAY_URL=http://YOUR_IP:8080    # Gateway port (for viewing)
BLOCKCHAIN_RPC_URL=https://rpc.sepolia.org  # Sepolia network
```

**Important:**
- ✅ **IPFS_URL** = `http://localhost:5001` (API)
- ✅ **IPFS_GATEWAY_URL** = `http://YOUR_IP:8080` (Gateway - different!)

---

## 🧪 Test IPFS Connection

```bash
# Test if IPFS API is accessible
curl http://localhost:5001/api/v0/version
```

**Should return JSON** (not error).

---

## ✅ Checklist

- [ ] IPFS daemon running (`ipfs daemon`)
- [ ] IPFS_URL = `http://localhost:5001` ✅ (fixed)
- [ ] Server restarted
- [ ] Test upload works ✅

---

**Start IPFS daemon and restart server - that's it!** 🚀

