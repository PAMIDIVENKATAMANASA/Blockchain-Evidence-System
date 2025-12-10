#!/bin/bash

echo "🔧 Updating Server Configuration to Use Sepolia"
echo "================================================"
echo ""

SERVER_ENV="server/.env"

# Check if .env exists
if [ ! -f "$SERVER_ENV" ]; then
    echo "❌ server/.env file not found!"
    echo "Creating new .env file..."
    touch "$SERVER_ENV"
fi

# Backup existing .env
if [ -f "$SERVER_ENV" ]; then
    cp "$SERVER_ENV" "${SERVER_ENV}.backup"
    echo "✅ Backed up existing .env to .env.backup"
fi

# Update BLOCKCHAIN_RPC_URL
if grep -q "BLOCKCHAIN_RPC_URL" "$SERVER_ENV"; then
    # Replace existing line
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' 's|BLOCKCHAIN_RPC_URL=.*|BLOCKCHAIN_RPC_URL=https://rpc.sepolia.org|' "$SERVER_ENV"
    else
        # Linux
        sed -i 's|BLOCKCHAIN_RPC_URL=.*|BLOCKCHAIN_RPC_URL=https://rpc.sepolia.org|' "$SERVER_ENV"
    fi
    echo "✅ Updated BLOCKCHAIN_RPC_URL to Sepolia"
else
    # Add new line
    echo "" >> "$SERVER_ENV"
    echo "# Blockchain Configuration" >> "$SERVER_ENV"
    echo "BLOCKCHAIN_RPC_URL=https://rpc.sepolia.org" >> "$SERVER_ENV"
    echo "✅ Added BLOCKCHAIN_RPC_URL (Sepolia)"
fi

# Ensure PRIVATE_KEY exists
if ! grep -q "PRIVATE_KEY" "$SERVER_ENV"; then
    echo "" >> "$SERVER_ENV"
    echo "PRIVATE_KEY=0x6f1c58178a7ec68531d13b950a58a7d6c553633759fd9f53310be3982398ee67" >> "$SERVER_ENV"
    echo "✅ Added PRIVATE_KEY"
fi

echo ""
echo "📋 Updated Configuration:"
echo "=========================="
grep "BLOCKCHAIN_RPC_URL" "$SERVER_ENV"
echo ""

echo "✅ Configuration updated!"
echo ""
echo "📝 Next Steps:"
echo "   1. Restart your server:"
echo "      cd server && npm start"
echo ""
echo "   2. Stop 'npx hardhat node' if running (not needed for Sepolia)"
echo ""
echo "   3. Upload evidence - transaction hash will now appear on Etherscan! ✅"
echo ""

