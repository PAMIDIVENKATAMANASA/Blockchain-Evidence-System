# Fix: IPFS Connection Timeout Error

## 🔍 Error Analysis

**Error:** `ConnectTimeoutError: Connect Timeout Error (attempted address: 157.48.191.44:8080)`

**Problem:** IPFS daemon is not running or not accessible at the configured URL.

---

## ✅ Solution

### Step 1: Check IPFS Daemon Status

```bash
# Check if IPFS is running
ipfs id
```

**If error:** IPFS daemon is not running.

### Step 2: Start IPFS Daemon

```bash
ipfs daemon
```

**Keep this terminal open!** IPFS daemon must be running.

### Step 3: Verify IPFS is Accessible

**In a new terminal:**
```bash
# Test IPFS API
curl http://localhost:5001/api/v0/version
```

**Should return:**
```json
{"Version":"0.x.x",...}
```

### Step 4: Check Server Configuration

**Verify `server/.env` has correct IPFS URL:**
```bash
cd server
cat .env | grep IPFS_URL
```

**Should show:**
```
IPFS_URL=http://localhost:5001
```

**If it shows something else (like port 8080), fix it:**
```bash
# Edit .env
nano server/.env
# Change IPFS_URL to: http://localhost:5001
```

### Step 5: Restart Server

```bash
cd server
npm start
```

---

## 🔧 Alternative: Run IPFS in Background

**If you want IPFS to run in background:**

```bash
# Run IPFS daemon in background
nohup ipfs daemon > ipfs.log 2>&1 &

# Check if running
ipfs id
```

---

## 🧪 Test IPFS Connection

**Create test script `test_ipfs_connection.js`:**

```javascript
const { create } = require('ipfs-http-client');

async function testIPFS() {
  try {
    const ipfs = create({ url: 'http://localhost:5001' });
    const version = await ipfs.version();
    console.log('✅ IPFS connected!');
    console.log('Version:', version.version);
  } catch (error) {
    console.error('❌ IPFS not accessible:', error.message);
    console.log('💡 Start IPFS daemon: ipfs daemon');
  }
}

testIPFS();
```

**Run it:**
```bash
node test_ipfs_connection.js
```

---

## 📋 Checklist

- [ ] IPFS daemon is running (`ipfs daemon`)
- [ ] IPFS API accessible (`curl http://localhost:5001/api/v0/version`)
- [ ] Server `.env` has `IPFS_URL=http://localhost:5001`
- [ ] Server restarted after changes
- [ ] Test upload works ✅

---

## 🆘 Troubleshooting

### Problem: "IPFS daemon not running"

**Solution:**
```bash
# Start IPFS daemon
ipfs daemon
```

### Problem: "Connection refused"

**Check:**
1. Is IPFS daemon running? (`ipfs id`)
2. Is port 5001 correct? (`ipfs config Addresses.API`)
3. Is firewall blocking port 5001?

**Fix:**
```bash
# Check IPFS config
ipfs config Addresses.API
# Should show: /ip4/127.0.0.1/tcp/5001

# If wrong, fix it:
ipfs config Addresses.API /ip4/127.0.0.1/tcp/5001

# Restart IPFS daemon
ipfs daemon
```

### Problem: "Wrong port (8080 instead of 5001)"

**The error shows port 8080, but IPFS API is on 5001!**

**Fix:**
```bash
# Check server/.env
cd server
cat .env | grep IPFS

# Should be:
# IPFS_URL=http://localhost:5001  (API port)
# IPFS_GATEWAY_URL=http://localhost:8080  (Gateway port - different!)

# If IPFS_URL is wrong, fix it:
# IPFS_URL=http://localhost:5001
```

**Note:** 
- **IPFS API** = Port 5001 (for uploading/downloading)
- **IPFS Gateway** = Port 8080 (for viewing files via HTTP)

---

## ✅ Quick Fix Summary

1. **Start IPFS daemon:**
   ```bash
   ipfs daemon
   ```

2. **Verify it's running:**
   ```bash
   ipfs id
   ```

3. **Check server config:**
   ```bash
   cd server
   cat .env | grep IPFS_URL
   # Should be: IPFS_URL=http://localhost:5001
   ```

4. **Restart server:**
   ```bash
   npm start
   ```

5. **Test upload** ✅

---

**Start IPFS daemon and your uploads will work!** 🚀

