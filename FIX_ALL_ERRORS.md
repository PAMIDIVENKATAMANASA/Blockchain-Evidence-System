# Fix: Blockchain RPC Timeout & MongoDB Connection Errors

## 🔍 Problems Identified

1. **Blockchain RPC Timeout**: `JsonRpcProvider failed to detect network`
2. **MongoDB Connection Error**: `getaddrinfo EAI_AGAIN` (DNS resolution issue)

---

## ✅ Solution 1: Fix Blockchain RPC

### Problem:
- RPC URL might be slow or timing out
- Network detection is failing

### Fix Applied:
- ✅ Increased timeout to 60 seconds
- ✅ Disabled network auto-detection (faster)
- ✅ Added connection test before transactions
- ✅ Better error messages

### Test RPC Connection:

```bash
# Test if RPC is accessible
curl -X POST https://rpc.sepolia.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

**Should return JSON** (not timeout).

### Alternative RPC URLs:

If `https://rpc.sepolia.org` is slow, try these in `server/.env`:

**Option 1: Infura (Your existing)**
```bash
BLOCKCHAIN_RPC_URL=https://sepolia.infura.io/v3/7131a74d24af420298d28095445bef38
```

**Option 2: Alchemy**
```bash
BLOCKCHAIN_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
```

**Option 3: Ankr**
```bash
BLOCKCHAIN_RPC_URL=https://rpc.ankr.com/eth_sepolia
```

---

## ✅ Solution 2: Fix MongoDB Connection

### Problem:
- DNS resolution failing for MongoDB Atlas
- Network connectivity issue

### Fix:

**Option 1: Check Internet Connection**

```bash
# Test internet
ping 8.8.8.8

# Test DNS
nslookup ac-euvuklg-shard-00-01.jyvapkj.mongodb.net
```

**Option 2: Update MongoDB Connection String**

Make sure your `server/.env` has correct MongoDB URI:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/trustchain?retryWrites=true&w=majority
```

**Option 3: Add Connection Options**

Update `server/server.js` to add connection options:

```javascript
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // 30 seconds
  socketTimeoutMS: 45000, // 45 seconds
  connectTimeoutMS: 30000, // 30 seconds
})
```

---

## 🚀 Quick Fix Steps

### Step 1: Update Server Configuration

**Edit `server/.env`:**

```bash
# Try alternative RPC if current one is slow
BLOCKCHAIN_RPC_URL=https://sepolia.infura.io/v3/7131a74d24af420298d28095445bef38

# Or use Ankr (usually faster)
# BLOCKCHAIN_RPC_URL=https://rpc.ankr.com/eth_sepolia

# MongoDB - verify connection string is correct
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/trustchain?retryWrites=true&w=majority
```

### Step 2: Update Server Code

I've already updated the code with:
- Better timeout handling
- Connection testing
- Better error messages

### Step 3: Restart Server

```bash
cd server
npm start
```

---

## 🧪 Test Connections

### Test 1: Blockchain RPC

```bash
curl -X POST https://rpc.sepolia.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

**Should return:** `{"jsonrpc":"2.0","id":1,"result":"0x..."}`

### Test 2: MongoDB

```bash
cd server
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => { console.log('✅ MongoDB connected'); process.exit(0); }).catch(e => { console.error('❌ Error:', e.message); process.exit(1); });"
```

---

## 📋 Recommended RPC URLs (Fastest)

**Try these in order:**

1. **Infura (Your existing - should work):**
   ```
   BLOCKCHAIN_RPC_URL=https://sepolia.infura.io/v3/7131a74d24af420298d28095445bef38
   ```

2. **Ankr (Usually fast):**
   ```
   BLOCKCHAIN_RPC_URL=https://rpc.ankr.com/eth_sepolia
   ```

3. **Public Sepolia:**
   ```
   BLOCKCHAIN_RPC_URL=https://rpc.sepolia.org
   ```

---

## 🔧 Update Server Code for MongoDB

I'll update the server to handle MongoDB connection better.

---

## ✅ Checklist

- [ ] Test RPC connection (curl command above)
- [ ] Update `server/.env` with working RPC URL
- [ ] Verify MongoDB connection string
- [ ] Restart server
- [ ] Test upload ✅

---

**Try using Infura RPC URL - it's usually more reliable!** 🚀


