# TrustChain - Blockchain-based Digital Evidence Chain of Custody System

A full-stack, secure, decentralized application that ensures the integrity and verifiability of digital evidence from collection to courtroom verification.

## 🏗️ Project Structure

```
Blockchain/
├── client/          # React.js Frontend
├── server/          # Express.js & Node.js Backend
└── blockchain/      # Hardhat & Solidity Smart Contracts
```

## 🛠️ Technology Stack

- **Frontend**: React.js with Vite
- **Backend**: Express.js & Node.js
- **Database**: MongoDB (Mongoose)
- **Blockchain**: Hardhat & Solidity
- **Blockchain Interface**: Ethers.js
- **File Storage**: IPFS (InterPlanetary File System)

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or connection string)
- IPFS node (running locally on port 5001)
- MetaMask or Hardhat local node for blockchain

## 🚀 Setup Instructions

### 1. Blockchain Setup

```bash
cd blockchain
npm install
npx hardhat compile
npx hardhat node  # Start local blockchain in one terminal
# In another terminal:
npx hardhat run scripts/deploy.js --network localhost
```

### 2. Server Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your configuration
npm start
# Or for development:
npm run dev
```

### 3. Client Setup

```bash
cd client
npm install
npm run dev
```

## 🔐 Default Test Accounts

You can create accounts through the registration interface with the following roles:
- **Officer**: Can upload and view their own evidence
- **Judge**: Full access to all evidence and verification tools
- **Lawyer**: Read-only access to evidence with AI analysis capabilities

## 📝 Environment Variables

### Server (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trustchain
JWT_SECRET=your-super-secret-jwt-key
BLOCKCHAIN_RPC_URL=http://localhost:8545
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
IPFS_URL=http://localhost:5001
```

## 🎯 Core Features

1. **Evidence Upload & Sealing**
   - Officers upload files (photo/video/audio)
   - Automatic metadata capture (time, GPS, Officer ID)
   - File stored on IPFS (generates CID)
   - Hash committed to blockchain (Genesis Entry)

2. **Role-Based Access Control**
   - Officers: Upload and view own evidence
   - Judges: Full access and verification
   - Lawyers: Read-only with AI analysis

3. **AI Analysis** (Simulated)
   - Audio transcription
   - Video analysis (blur sensitive areas)
   - Image object detection
   - Does not modify original files

4. **Courtroom Verification**
   - Judge selects evidence for verification
   - System downloads from IPFS
   - Recalculates hash
   - Compares with blockchain hash
   - Displays: "100% Authentic" or "Tampered"

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Evidence
- `POST /api/evidence/upload` - Upload evidence (Officer only)
- `GET /api/evidence` - Get all evidence
- `GET /api/evidence/:evidenceId` - Get specific evidence

### Verification
- `POST /api/verification/:evidenceId` - Verify evidence (Judge only)
- `GET /api/verification/:evidenceId/history` - Get verification history

### AI Analysis
- `POST /api/ai/analyze/:evidenceId` - Analyze evidence
- `GET /api/ai/types` - Get available analysis types

## 🔒 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Blockchain-immutable evidence records
- IPFS decentralized file storage
- Hash verification for integrity checks

## 📚 Smart Contract Functions

- `addEvidence(bytes32 hash, address collector)` - Add evidence to blockchain
- `getOriginalHash(uint256 evidenceId)` - Get original hash for verification
- `grantJudge(address judge)` - Grant judge privileges
- `grantLawyer(address lawyer)` - Grant lawyer privileges

## 🧪 Testing

```bash
# Blockchain tests
cd blockchain
npx hardhat test

# Server tests (when implemented)
cd server
npm test
```

## 📄 License

MIT

## 👥 Contributors

TrustChain Development Team

---

**Note**: This is a demonstration system. For production use, implement additional security measures, error handling, and testing.

