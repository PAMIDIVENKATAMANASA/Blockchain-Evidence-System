#!/bin/bash
echo "Updating RPC URL to public endpoint (no API key required)..."
cat > .env << 'ENVEOF'
# Sepolia Network Configuration
# Public RPC (no API key required)
SEPOLIA_RPC_URL=https://rpc.sepolia.org

# Deployer private key
SEPOLIA_PRIVATE_KEY=0x6f1c58178a7ec68531d13b950a58a7d6c553633759fd9f53310be3982398ee67

# Etherscan API key (for verification)
ETHERSCAN_API_KEY=Z8AKGG8BWFRYSQHTT88UVW247EIZJ3FE5I
ENVEOF
echo "✅ Updated to public RPC endpoint"
echo ""
echo "Your .env now uses: https://rpc.sepolia.org (public, no API key)"
echo ""
echo "Try deploying: npm run deploy:sepolia"
