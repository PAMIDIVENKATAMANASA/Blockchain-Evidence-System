# Blockchain-Evidence-System: TrustChain Quick Start Guide


## 🎯 What is TrustChain?

TrustChain is a decentralized digital evidence chain of custody system. It leverages blockchain technology to ensure the integrity, immutability, and verifiable origin of digital evidence from collection to final courtroom review. It uses the MERN stack for the application layer, IPFS for storage, and the Ethereum Sepolia testnet for verification.

## ⚡ Quick Setup (10 minutes)

### Prerequisites Checklist
Ensure you have access to the following accounts and local tools:
- ✅ **Node.js** (v16+) installed
- ✅ **npm** (Node Package Manager) installed
- ✅ **MongoDB Atlas** account (already configured)
- ✅ **Alchemy** or **Infura** account for Sepolia RPC (configured for production/testing)
- ✅ **IPFS** desktop client or daemon installed (for local pinning)

### 🔑 Essential Configuration (`server/.env`)

Your server is configured to use remote services. Before starting, ensure you create a `.env` file in the `server` directory.

1. Install Dependencies

    # Blockchain 
    cd blockchain && npm install && cd ..
       
    # Server 
    cd server && npm install && cd ..
       
    # Client (
    cd client && npm install && cd ..

2. Deploy Contract

   cd blockchain
   npx hardhat run scripts/deploy.js --network sepolia
   
3. Start Services (3 Terminals)

   Terminal:1	IPFS Daemon
       	ipfs daemon
   
   Terminal:2	Server API
       cd server && npm start

   Terminal:3	Client UI
       cd client && npm run dev

4. Access Application

Open your browser to: http://localhost:3000

You must register accounts for Officer, Judge, and Lawyer roles before testing.

Test Workflow


The core test workflow validates the entire chain of custody:

Register/Login as Officer: Upload an evidence file (pins to IPFS and records hash on Sepolia).

Login as Judge: Access the evidence and verify its integrity against the blockchain record.

Login as Lawyer: View the evidence details and run auxiliary analysis.


🎉 You're Ready!
Your robust, blockchain-backed digital evidence system is now fully operational.
