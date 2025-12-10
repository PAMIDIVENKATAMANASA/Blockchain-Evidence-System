# Sepolia Setup - Complete Configuration

## ✅ Configuration Summary

Your TrustChain project is now configured for Sepolia testnet with the following settings:

### Environment Variables (blockchain/.env)

```bash
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/7131a74d24af420298d28095445bef38
SEPOLIA_PRIVATE_KEY=0x6f1c58178a7ec68531d13b950a58a7d6c553633759fd9f53310be3982398ee67
ETHERSCAN_API_KEY=Z8AKGG8BWFRYSQHTT88UVW247EIZJ3FE5I
```

### Server Configuration (server/.env)

Make sure your server `.env` has:

```bash
BLOCKCHAIN_RPC_URL=https://sepolia.infura.io/v3/7131a74d24af420298d28095445bef38
PRIVATE_KEY=0x6f1c58178a7ec68531d13b950a58a7d6c553633759fd9f53310be3982398ee67
```

---

## 🚀 Deployment Steps

### Step 1: Deploy Contract to Sepolia

```bash
cd blockchain
npm install  # If needed
npx hardhat compile
npm run deploy:sepolia
```

**Expected Output:**
```
ChainOfCustody deployed to: 0x...
View on Etherscan: https://sepolia.etherscan.io/address/0x...
Contract on Etherscan: https://sepolia.etherscan.io/address/0x...
```

### Step 2: Verify Contract on Etherscan

```bash
npm run verify
```

**Expected Output:**
```
✅ Contract verified successfully!
View on Etherscan: https://sepolia.etherscan.io/address/0x...#code
```

### Step 3: Update Server Configuration

Update `server/.env` with:
- Sepolia RPC URL
- Private key
- Restart server

---

## 🔍 Checking on Etherscan

### Quick Check

1. **Contract Address Page**:
   ```
   https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS
   ```

2. **What to Check**:
   - ✅ Code tab shows source code (after verification)
   - ✅ Read Contract tab works
   - ✅ Events tab shows EvidenceAdded events
   - ✅ Transactions tab shows all interactions

### After Uploading Evidence

1. **View Transaction**:
   ```
   https://sepolia.etherscan.io/tx/YOUR_TRANSACTION_HASH
   ```

2. **View Events**:
   - Go to contract address page
   - Click "Events" tab
   - Filter by "EvidenceAdded"
   - Click event to see evidence details

### Query Evidence Data

1. Go to contract address page
2. Click "Read Contract" tab
3. Use `getOriginalHash(uint256)`:
   - Enter evidence ID
   - Click "Query"
   - View hash, collector, timestamp

---

## 📚 Documentation

- **Full Guide**: See `ETHERSCAN_GUIDE.md`
- **Quick Reference**: See `QUICK_ETHERSCAN_CHECK.md`
- **Migration Guide**: See `MIGRATE_TO_SEPOLIA.md`

---

## ✅ Checklist

- [ ] Contract deployed to Sepolia
- [ ] Contract verified on Etherscan
- [ ] Server configured with Sepolia RPC URL
- [ ] Can view contract on Etherscan
- [ ] Can view transactions
- [ ] Can view events
- [ ] Can query contract functions

---

**Everything is configured! Deploy and verify your contract!** 🎉

