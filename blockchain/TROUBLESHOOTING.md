# Troubleshooting Deployment Issues

## Problem: Empty string for network or forking URL

### Error Message:
```
HardhatError: HH117: Empty string `` for network or forking URL - Expected a non-empty string.
```

### Solution:

1. **Check if .env file exists:**
   ```bash
   cd blockchain
   ls -la .env
   ```

2. **If .env doesn't exist, create it:**
   ```bash
   cat > .env << 'EOF'
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/7131a74d24af420298d28095445bef38
   SEPOLIA_PRIVATE_KEY=0x6f1c58178a7ec68531d13b950a58a7d6c553633759fd9f53310be3982398ee67
   ETHERSCAN_API_KEY=Z8AKGG8BWFRYSQHTT88UVW247EIZJ3FE5I
   EOF
   ```

3. **Verify environment variables are loaded:**
   ```bash
   node -e "require('dotenv').config(); console.log('RPC:', process.env.SEPOLIA_RPC_URL);"
   ```

4. **Try deployment again:**
   ```bash
   npm run deploy:sepolia
   ```

### Common Issues:

#### Issue 1: .env file in wrong location
- **Location**: Must be in `blockchain/.env` (same directory as `hardhat.config.js`)
- **Fix**: Move or create .env file in correct location

#### Issue 2: Missing dotenv package
- **Check**: `npm list dotenv`
- **Fix**: `npm install dotenv`

#### Issue 3: Environment variables not set
- **Check**: Open `.env` file and verify all variables are set
- **Fix**: Update `.env` file with correct values

#### Issue 4: Wrong variable names
- **Correct names**:
  - `SEPOLIA_RPC_URL` (not `ALCHEMY_SEPOLIA_URL` unless using Alchemy)
  - `SEPOLIA_PRIVATE_KEY`
  - `ETHERSCAN_API_KEY`

### Verification Steps:

1. **Check .env file exists:**
   ```bash
   cd blockchain
   test -f .env && echo "✅ .env exists" || echo "❌ .env missing"
   ```

2. **Check variables are loaded:**
   ```bash
   node -e "require('dotenv').config(); console.log('RPC URL:', process.env.SEPOLIA_RPC_URL ? '✅ SET' : '❌ NOT SET');"
   ```

3. **Check Hardhat config:**
   ```bash
   node -e "require('dotenv').config(); const config = require('./hardhat.config.js'); console.log('Sepolia URL:', config.networks.sepolia.url || 'EMPTY');"
   ```

### Quick Fix:

If you're still having issues, manually check:

```bash
cd blockchain

# 1. Create .env file
cat > .env << 'EOF'
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/7131a74d24af420298d28095445bef38
SEPOLIA_PRIVATE_KEY=0x6f1c58178a7ec68531d13b950a58a7d6c553633759fd9f53310be3982398ee67
ETHERSCAN_API_KEY=Z8AKGG8BWFRYSQHTT88UVW247EIZJ3FE5I
EOF

# 2. Verify it was created
cat .env

# 3. Test loading
node -e "require('dotenv').config(); console.log(process.env.SEPOLIA_RPC_URL);"

# 4. Deploy
npm run deploy:sepolia
```

