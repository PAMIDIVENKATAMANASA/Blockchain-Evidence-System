# How to Get Sepolia Testnet ETH

## ❌ Error: Insufficient Funds

Your wallet balance is **0 Sepolia ETH**, but you need **~0.00068 Sepolia ETH** for deployment.

## ✅ Solution: Get Free Sepolia ETH from Faucets

### Step 1: Find Your Wallet Address

Your deployer address (from private key):
```bash
# Check your wallet address
node -e "const { ethers } = require('ethers'); const wallet = new ethers.Wallet('0x6f1c58178a7ec68531d13b950a58a7d6c553633759fd9f53310be3982398ee67'); console.log('Address:', wallet.address);"
```

Or visit one of these sites and connect with MetaMask (if your private key is imported there).

### Step 2: Request ETH from Faucets

#### Option 1: Alchemy Sepolia Faucet (Recommended)
🌐 **URL**: https://sepoliafaucet.com/

1. Go to: https://sepoliafaucet.com/
2. Paste your wallet address
3. Click "Send Me ETH"
4. Wait 1-2 minutes
5. **You'll receive 0.5 Sepolia ETH** ✅

**Requirements**: 
- Free to use
- No sign-up required (sometimes)
- Limit: 0.5 ETH per day

#### Option 2: Infura Sepolia Faucet
🌐 **URL**: https://www.infura.io/faucet/sepolia

1. Go to: https://www.infura.io/faucet/sepolia
2. Sign up (free account)
3. Paste your wallet address
4. Click "Send Me ETH"
5. **You'll receive Sepolia ETH** ✅

#### Option 3: PoW Faucet (No Sign-up)
🌐 **URL**: https://sepolia-faucet.pk910.de/

1. Go to: https://sepolia-faucet.pk910.de/
2. Enter your wallet address
3. Complete a small proof-of-work (mining)
4. **You'll receive 0.5 Sepolia ETH** ✅

**Best for**: Quick access without sign-up

#### Option 4: QuickNode Faucet
🌐 **URL**: https://quicknode.com/faucet/ethereum/sepolia

1. Go to: https://quicknode.com/faucet/ethereum/sepolia
2. Connect Twitter/X account (free)
3. Paste your wallet address
4. **You'll receive Sepolia ETH** ✅

### Step 3: Verify You Received ETH

**Check balance on Etherscan:**
1. Get your wallet address (see Step 1)
2. Visit: `https://sepolia.etherscan.io/address/YOUR_WALLET_ADDRESS`
3. Check the "Balance" - should show Sepolia ETH

**Or check via command:**
```bash
node -e "const { ethers } = require('ethers'); const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/7131a74d24af420298d28095445bef38'); const wallet = new ethers.Wallet('0x6f1c58178a7ec68531d13b950a58a7d6c553633759fd9f53310be3982398ee67'); provider.getBalance(wallet.address).then(b => console.log('Balance:', ethers.formatEther(b), 'ETH'));"
```

### Step 4: Deploy Again

Once you have Sepolia ETH (even 0.001 ETH is enough):

```bash
npm run deploy:sepolia
```

## 💡 Quick Script to Check Balance

Create `check_balance.js`:

```javascript
const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider(
  process.env.SEPOLIA_RPC_URL || 
  "https://sepolia.infura.io/v3/7131a74d24af420298d28095445bef38"
);

const wallet = new ethers.Wallet(
  "0x6f1c58178a7ec68531d13b950a58a7d6c553633759fd9f53310be3982398ee67"
);

async function checkBalance() {
  const address = wallet.address;
  const balance = await provider.getBalance(address);
  const balanceEth = ethers.formatEther(balance);
  
  console.log("Wallet Address:", address);
  console.log("Balance:", balanceEth, "Sepolia ETH");
  
  if (balanceEth === "0.0") {
    console.log("\n❌ No funds! Get ETH from faucets:");
    console.log("   - https://sepoliafaucet.com/");
    console.log("   - https://www.infura.io/faucet/sepolia");
    console.log("   - https://sepolia-faucet.pk910.de/");
  } else {
    console.log("\n✅ You have funds! Ready to deploy.");
  }
}

checkBalance();
```

Run it:
```bash
node check_balance.js
```

## 📋 Faucet Links Summary

| Faucet | URL | Amount | Sign-up Required |
|--------|-----|--------|------------------|
| Alchemy | https://sepoliafaucet.com/ | 0.5 ETH | No |
| Infura | https://www.infura.io/faucet/sepolia | Varies | Yes (free) |
| PoW Faucet | https://sepolia-faucet.pk910.de/ | 0.5 ETH | No |
| QuickNode | https://quicknode.com/faucet/ethereum/sepolia | Varies | Twitter/X |

## 🎯 Recommended: Use Alchemy Faucet

1. **Go to**: https://sepoliafaucet.com/
2. **Enter your wallet address**
3. **Click "Send Me ETH"**
4. **Wait 1-2 minutes**
5. **Check balance on Etherscan**
6. **Deploy!**

## ⏱️ How Long to Wait?

- **Alchemy**: Usually instant to 2 minutes
- **Infura**: Instant
- **PoW Faucet**: 1-5 minutes (depending on mining)
- **QuickNode**: Instant

## ✅ After Getting ETH

1. **Verify balance** (use check_balance.js or Etherscan)
2. **Deploy contract**:
   ```bash
   npm run deploy:sepolia
   ```

You only need about **0.001 Sepolia ETH** for deployment, so 0.5 ETH is more than enough!

---

**Get ETH from a faucet and try deploying again!** 💰

