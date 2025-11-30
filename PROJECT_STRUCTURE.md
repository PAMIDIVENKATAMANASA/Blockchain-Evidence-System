# TrustChain Project Structure

## Directory Tree

```
Blockchain/
├── blockchain/              # Smart Contracts & Hardhat Setup
│   ├── contracts/
│   │   └── ChainOfCustody.sol    # Main smart contract
│   ├── scripts/
│   │   └── deploy.js             # Deployment script
│   ├── test/                     # Test files (to be added)
│   ├── hardhat.config.js         # Hardhat configuration
│   └── package.json
│
├── server/                  # Express.js Backend
│   ├── models/
│   │   ├── User.js              # User model (Mongoose)
│   │   └── Evidence.js          # Evidence model (Mongoose)
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── evidence.js          # Evidence upload/retrieval
│   │   ├── verification.js      # Verification routes (Judge)
│   │   └── ai.js                # AI analysis routes
│   ├── services/
│   │   ├── blockchain.js        # Ethers.js integration
│   │   └── ipfs.js              # IPFS client integration
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── server.js                # Main server file
│   └── package.json
│
├── client/                  # React.js Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx        # Login component
│   │   │   ├── Register.jsx    # Registration component
│   │   │   ├── OfficerDashboard.jsx  # Officer interface
│   │   │   ├── JudgeDashboard.jsx    # Judge interface
│   │   │   ├── LawyerDashboard.jsx   # Lawyer interface
│   │   │   ├── Auth.css        # Auth styling
│   │   │   └── Dashboard.css   # Dashboard styling
│   │   ├── utils/
│   │   │   └── auth.js          # Auth utility functions
│   │   ├── App.jsx             # Main app component
│   │   ├── main.jsx            # React entry point
│   │   └── index.css           # Global styles
│   ├── index.html
│   ├── vite.config.js          # Vite configuration
│   └── package.json
│
├── README.md                 # Main documentation
├── SETUP.md                  # Setup instructions
└── .gitignore               # Git ignore rules
```

## Key Files Description

### Blockchain Layer
- **ChainOfCustody.sol**: Smart contract storing evidence hashes immutably
- **deploy.js**: Script to deploy contract to local/test network

### Server Layer
- **server.js**: Express server setup with MongoDB connection
- **User.js**: Mongoose model for user accounts (officer/judge/lawyer)
- **Evidence.js**: Mongoose model for evidence metadata
- **blockchain.js**: Service to interact with smart contract via Ethers.js
- **ipfs.js**: Service to upload/download files from IPFS
- **auth.js**: JWT-based authentication middleware

### Client Layer
- **App.jsx**: Main router and authentication state management
- **OfficerDashboard.jsx**: Upload evidence interface
- **JudgeDashboard.jsx**: Verification tool interface
- **LawyerDashboard.jsx**: Read-only evidence view with AI analysis

## Data Flow

1. **Evidence Upload (Officer)**:
   - File → Calculate SHA256 hash → Upload to IPFS → Store hash on blockchain → Save metadata to MongoDB

2. **Verification (Judge)**:
   - Download from IPFS → Recalculate hash → Query blockchain → Compare hashes → Display result

3. **AI Analysis (Lawyer)**:
   - Download from IPFS → Analyze (simulated) → Return results (original unchanged)

## Security Features

- JWT authentication
- Role-based access control (RBAC)
- Blockchain-immutable records
- IPFS decentralized storage
- Hash-based integrity verification

