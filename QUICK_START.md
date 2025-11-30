# TrustChain - Quick Start Guide

## 🎯 What is TrustChain?

TrustChain is a blockchain-based digital evidence chain of custody system that ensures the integrity and verifiability of digital evidence from collection to courtroom verification.

## ⚡ Quick Setup (5 minutes)

### Prerequisites Check
- ✅ Node.js (v16+) installed
- ✅ MongoDB running (local or remote)
- ✅ IPFS node running
- ✅ Hardhat local blockchain node

### Step-by-Step

1. **Install Dependencies**
   ```bash
   # Blockchain
   cd blockchain && npm install && cd ..
   
   # Server
   cd server && npm install && cd ..
   
   # Client
   cd client && npm install && cd ..
   ```

2. **Start IPFS** (Terminal 1)
   ```bash
   ipfs daemon
   ```

3. **Start MongoDB** (if not running)
   ```bash
   # Linux
   sudo systemctl start mongod
   
   # Or Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

4. **Deploy Smart Contract** (Terminal 2)
   ```bash
   cd blockchain
   npx hardhat node  # Keep this running
   ```
   
   In Terminal 3:
   ```bash
   cd blockchain
   npx hardhat compile
   npx hardhat run scripts/deploy.js --network localhost
   ```

5. **Configure Server**
   ```bash
   cd server
   # Create .env file (see SETUP.md for details)
   # Or use defaults if running locally
   ```

6. **Start Server** (Terminal 4)
   ```bash
   cd server
   npm start
   ```

7. **Start Client** (Terminal 5)
   ```bash
   cd client
   npm run dev
   ```

8. **Access Application**
   - Open browser: http://localhost:3000
   - Register accounts for Officer, Judge, and Lawyer
   - Start using the system!

## 🧪 Test Workflow

1. **Register as Officer** → Upload evidence file
2. **Login as Judge** → Verify evidence integrity
3. **Login as Lawyer** → View evidence and run AI analysis

## 📝 Default Configuration

- **Server**: http://localhost:5000
- **Client**: http://localhost:3000
- **Blockchain**: http://localhost:8545
- **IPFS**: http://localhost:5001
- **MongoDB**: mongodb://localhost:27017/trustchain

## 🆘 Troubleshooting

**"IPFS connection error"**
- Ensure IPFS daemon is running: `ipfs daemon`

**"MongoDB connection error"**
- Check MongoDB is running: `sudo systemctl status mongod`
- Verify connection string in server/.env

**"Contract not found"**
- Deploy contract: `cd blockchain && npx hardhat run scripts/deploy.js --network localhost`
- Check deployment.json exists

**"Cannot connect to blockchain"**
- Start Hardhat node: `cd blockchain && npx hardhat node`

## 📚 More Information

- See `README.md` for full documentation
- See `SETUP.md` for detailed setup instructions
- See `PROJECT_STRUCTURE.md` for code organization

## 🎉 You're Ready!

The system is now running. Create your first account and start managing digital evidence with blockchain-backed integrity!

