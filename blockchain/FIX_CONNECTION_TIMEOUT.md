# Fix: Connection Timeout Error

## ✅ Solution Applied

I've updated `hardhat.config.js` to include:
- `timeout: 60000` (60 seconds instead of default)
- Better connection handling

## 🚀 Try Deploying Again

```bash
npm run deploy:sepolia
```

## 🔧 If Still Timing Out

### Option 1: Use Alternative RPC Endpoints

Update your `.env` file with alternative RPC URLs:

**Option A: Public Sepolia RPC (No API Key Required)**
```bash
SEPOLIA_RPC_URL=https://rpc.sepolia.org
```

**Option B: Ankr Public RPC**
```bash
SEPOLIA_RPC_URL=https://rpc.ankr.com/eth_sepolia
```

**Option C: Get Alchemy Key (More Reliable)**
1. Go to: https://www.alchemy.com/
2. Sign up (free)
3. Create app → Choose "Ethereum" → "Sepolia"
4. Copy API key
5. Update `.env`:
```bash
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
```

### Option 2: Increase Timeout Further

Edit `hardhat.config.js` and increase timeout:
```javascript
sepolia: {
  url: process.env.SEPOLIA_RPC_URL || "",
  accounts: process.env.SEPOLIA_PRIVATE_KEY ? [process.env.SEPOLIA_PRIVATE_KEY] : [],
  chainId: 11155111,
  timeout: 120000, // 120 seconds (2 minutes)
  httpHeaders: {},
},
```

### Option 3: Check Network/Firewall

If you're behind a firewall/proxy:

1. **Check internet connection:**
   ```bash
   ping 8.8.8.8
   ```

2. **Test RPC directly:**
   ```bash
   curl -X POST https://sepolia.infura.io/v3/7131a74d24af420298d28095445bef38 \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
   ```

3. **Use test script:**
   ```bash
   node test_rpc_connection.js
   ```

### Option 4: Use Public RPC (No API Key)

The easiest solution - use public RPC that doesn't require API key:

**Update `.env`:**
```bash
# Use public Sepolia RPC (no API key needed)
SEPOLIA_RPC_URL=https://rpc.sepolia.org

# Keep your private key and etherscan key
SEPOLIA_PRIVATE_KEY=0x6f1c58178a7ec68531d13b950a58a7d6c553633759fd9f53310be3982398ee67
ETHERSCAN_API_KEY=Z8AKGG8BWFRYSQHTT88UVW247EIZJ3FE5I
```

Then deploy:
```bash
npm run deploy:sepolia
```

## 📋 Quick Fix Summary

**Try these in order:**

1. **Deploy again** (timeout increased):
   ```bash
   npm run deploy:sepolia
   ```

2. **If still fails, use public RPC**:
   ```bash
   # Edit .env
   SEPOLIA_RPC_URL=https://rpc.sepolia.org
   
   # Deploy
   npm run deploy:sepolia
   ```

3. **If still fails, test connection:**
   ```bash
   node test_rpc_connection.js
   ```

## 🔍 Verify Your RPC is Working

Run the test script:
```bash
node test_rpc_connection.js
```

This will test multiple RPC endpoints and show which ones work.

---

**The timeout has been increased. Try deploying again!** 🚀

