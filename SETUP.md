# TrustChain Setup Guide

## Quick Start

### Step 1: Install IPFS

```bash
# Download IPFS from https://dist.ipfs.io/#go-ipfs
# Or use package manager:

# Ubuntu/Debian
sudo apt-get install ipfs

# macOS
brew install ipfs

# Initialize and start IPFS
ipfs init
ipfs daemon
```

IPFS will run on `http://localhost:5001` by default.

### Step 2: Start MongoDB

```bash
# If MongoDB is installed locally:
sudo systemctl start mongod

# Or use Docker:
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Step 3: Setup Blockchain

```bash
cd blockchain
npm install

# Start Hardhat local node (in one terminal)
npx hardhat node

# In another terminal, compile and deploy:
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost
```

Copy the contract address from `blockchain/deployment.json` - you'll need it for the server.

### Step 4: Setup Server

```bash
cd server
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trustchain
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
BLOCKCHAIN_RPC_URL=http://localhost:8545
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
IPFS_URL=http://localhost:5001
EOF

# Start server
npm start
# Or for development with auto-reload:
npm run dev
```

### Step 5: Setup Client

```bash
cd client
npm install
npm run dev
```

The client will be available at `http://localhost:3000`

## Testing the System

1. **Register Test Users:**
   - Go to `http://localhost:3000/register`
   - Create an Officer account (e.g., "Officer Raju")
   - Create a Judge account (e.g., "Judge Devi")
   - Create a Lawyer account (e.g., "Lawyer Singh")

2. **Upload Evidence (Officer):**
   - Login as Officer
   - Upload a test file (image/video/audio)
   - Add description and GPS coordinates
   - Click "Upload & Seal Evidence"

3. **Verify Evidence (Judge):**
   - Login as Judge
   - View all evidence records
   - Click "Verify Integrity" on any evidence
   - See verification result

4. **Analyze Evidence (Lawyer):**
   - Login as Lawyer
   - View evidence records
   - Use AI analysis buttons to analyze files

## Troubleshooting

### IPFS Connection Error
- Ensure IPFS daemon is running: `ipfs daemon`
- Check IPFS is accessible: `curl http://localhost:5001/api/v0/version`

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`

### Blockchain Connection Error
- Ensure Hardhat node is running: `npx hardhat node`
- Check RPC URL in server `.env`
- Verify contract is deployed (check `blockchain/deployment.json`)

### Contract Not Found
- Make sure you've deployed the contract: `npx hardhat run scripts/deploy.js --network localhost`
- The contract address should be in `blockchain/deployment.json`
- The server will automatically load it

## Production Deployment Notes

For production:
1. Use a real blockchain network (Ethereum, Polygon, etc.)
2. Use a production IPFS service (Pinata, Infura, etc.)
3. Use strong JWT_SECRET
4. Use environment-specific MongoDB
5. Enable HTTPS
6. Add rate limiting
7. Implement proper error logging
8. Add comprehensive testing

