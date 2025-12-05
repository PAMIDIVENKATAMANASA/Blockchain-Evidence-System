# Fix: IPFS Files Not Showing in Public Network

## 🔍 Problem: "No providers found for the given CID"

This happens because your files are only stored locally on your IPFS node. They haven't been shared with the public IPFS network yet.

## 🎯 Why This Happens

1. **Files are only local**: When you upload to IPFS, files are stored on YOUR node only
2. **Not pinned**: Files need to be "pinned" to stay available
3. **Not shared**: Other nodes don't know about your files until they connect to your node
4. **Network propagation**: It takes time for files to propagate through the IPFS network

## ✅ Solutions

### Solution 1: Pin Files After Upload (Recommended)

Update your code to automatically pin files after upload.

#### Step 1: Update IPFS Service

Update `server/services/ipfs.js` to pin files:

```javascript
// Add this function to pin files
async function pinFile(cid) {
  try {
    const ipfs = getIPFSClient()
    await ipfs.pin.add(cid)
    return { success: true, cid }
  } catch (error) {
    console.error('Error pinning file:', error)
    throw error
  }
}

// Update uploadToIPFS to pin automatically
async function uploadToIPFS(fileBuffer, fileName) {
  try {
    const ipfs = getIPFSClient()

    const result = await ipfs.add({
      path: fileName,
      content: fileBuffer,
    })

    const cid = result.cid.toString()

    // Pin the file to keep it available
    try {
      await ipfs.pin.add(cid)
      console.log(`✅ File pinned: ${cid}`)
    } catch (pinError) {
      console.warn(`⚠️  Could not pin file ${cid}:`, pinError.message)
      // Continue even if pinning fails
    }

    return {
      success: true,
      cid,
      path: result.path,
      size: result.size,
    }
  } catch (error) {
    console.error('Error uploading to IPFS:', error)
    throw error
  }
}

module.exports = {
  uploadToIPFS,
  downloadFromIPFS,
  calculateFileHash,
  getPublicGatewayURL,
  pinFile,  // Export pin function
}
```

#### Step 2: Ensure IPFS Node is Connected to Network

```bash
# Check if your node is connected to peers
ipfs swarm peers

# If no peers, add bootstrap nodes
ipfs bootstrap list

# If bootstrap list is empty, add default bootstrap nodes
ipfs bootstrap add /dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN
ipfs bootstrap add /dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa
ipfs bootstrap add /dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zp6c6rS9B6N5e3P3D3Y3FkZ8v5qN8v
ipfs bootstrap add /dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi7C6tt8gY7U2Z9J7z8v5qN8v5qN8v5qN8v

# Restart IPFS daemon
ipfs daemon
```

### Solution 2: Use IPFS Pinning Service (Best for Production)

Use a pinning service like Pinata to ensure files stay available.

#### Option A: Pinata (Free Tier Available)

1. **Sign up at Pinata**: https://www.pinata.cloud/
2. **Get API Key**: Dashboard → API Keys → Create New Key
3. **Install Pinata SDK**:

```bash
cd server
npm install @pinata/sdk
```

4. **Create Pinata Service**:

Create `server/services/pinata.js`:

```javascript
const pinataSDK = require('@pinata/sdk')

const pinata = pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_SECRET_KEY
)

// Pin file to Pinata
async function pinToPinata(cid, metadata = {}) {
  try {
    const result = await pinata.pinByHash(cid, {
      pinataMetadata: {
        name: metadata.name || 'Evidence File',
        keyvalues: metadata.keyvalues || {}
      }
    })
    
    return {
      success: true,
      cid,
      pinataHash: result.IpfsHash,
    }
  } catch (error) {
    console.error('Error pinning to Pinata:', error)
    throw error
  }
}

// Upload and pin to Pinata
async function uploadAndPinToPinata(fileBuffer, fileName, metadata = {}) {
  try {
    // First upload to local IPFS
    const { create } = require('ipfs-http-client')
    const ipfs = create({ url: process.env.IPFS_URL || 'http://localhost:5001' })
    
    const result = await ipfs.add({
      path: fileName,
      content: fileBuffer,
    })
    
    const cid = result.cid.toString()
    
    // Pin to Pinata
    await pinToPinata(cid, {
      name: fileName,
      ...metadata
    })
    
    return {
      success: true,
      cid,
      pinned: true,
    }
  } catch (error) {
    console.error('Error uploading to Pinata:', error)
    throw error
  }
}

module.exports = {
  pinToPinata,
  uploadAndPinToPinata,
}
```

5. **Update Evidence Route**:

In `server/routes/evidence.js`, after uploading to IPFS:

```javascript
// After IPFS upload
const ipfsResult = await uploadToIPFS(req.file.buffer, req.file.originalname)

// Pin to Pinata (if configured)
if (process.env.PINATA_API_KEY && process.env.PINATA_SECRET_KEY) {
  try {
    const { pinToPinata } = require('../services/pinata')
    await pinToPinata(ipfsResult.cid, {
      name: req.file.originalname,
      keyvalues: {
        evidenceId: blockchainResult.evidenceId.toString(),
        collector: officer.name,
      }
    })
    console.log(`✅ File pinned to Pinata: ${ipfsResult.cid}`)
  } catch (error) {
    console.warn('⚠️  Could not pin to Pinata:', error.message)
  }
}
```

6. **Add to Environment Variables**:

```bash
# In server/.env
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
```

#### Option B: Web3.Storage (Free Tier Available)

1. **Sign up**: https://web3.storage/
2. **Get API Token**: Dashboard → Create API Token
3. **Install SDK**:

```bash
cd server
npm install web3.storage
```

4. **Create Service**:

```javascript
const { Web3Storage } = require('web3.storage')

const client = new Web3Storage({ token: process.env.WEB3_STORAGE_TOKEN })

async function uploadToWeb3Storage(fileBuffer, fileName) {
  const file = new File([fileBuffer], fileName)
  const cid = await client.put([file])
  return { success: true, cid }
}
```

### Solution 3: Manual Pinning (Quick Fix)

Pin existing files manually:

```bash
# Pin a specific file by CID
ipfs pin add QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA

# Pin all files in your IPFS node
ipfs pin ls | awk '{print $1}' | xargs -I {} ipfs pin add {}

# Check pinned files
ipfs pin ls

# Verify file is pinned
ipfs pin ls QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA
```

### Solution 4: Keep IPFS Node Running 24/7

For files to be accessible on the public network:

1. **Keep your IPFS daemon running continuously**
2. **Ensure your node stays connected to the network**
3. **Pin important files**

```bash
# Run IPFS daemon in background (Linux)
nohup ipfs daemon > ipfs.log 2>&1 &

# Or use systemd service (Linux)
sudo systemctl enable ipfs
sudo systemctl start ipfs
```

### Solution 5: Use Public Gateway Services

While your files propagate, use public gateway services that cache files:

- **IPFS.io**: https://ipfs.io/ipfs/<CID>
- **Cloudflare**: https://cloudflare-ipfs.com/ipfs/<CID>
- **Pinata Gateway**: https://gateway.pinata.cloud/ipfs/<CID>

These services will fetch and cache your files once they're available.

## 🔧 Complete Fix Implementation

### Step 1: Update IPFS Service with Auto-Pinning

I'll update the service file to automatically pin files.

### Step 2: Create Pinning Script

Create a script to pin all existing evidence files.

### Step 3: Verify Files are Pinned

Check that files are properly pinned and accessible.

## 🧪 Testing

### Test 1: Check if File is Pinned

```bash
# Check local pin
ipfs pin ls QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA

# Should show: QmXwnW... recursive
```

### Test 2: Check Providers

```bash
# Find providers for your CID
ipfs dht findprovs QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA

# Should show your node ID and other providers
```

### Test 3: Test Public Access

```bash
# Test via public gateway
curl -I https://ipfs.io/ipfs/QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA

# Should return 200 OK (may take a few minutes to propagate)
```

### Test 4: Use IPFS Checker

Visit: https://ipfs-checker.com/

Enter your CID and check:
- ✅ Pinned: Should show your node
- ✅ Providers: Should show multiple providers
- ✅ Gateway: Should be accessible

## 📝 Checklist

- [ ] IPFS node is running and connected to network
- [ ] Files are pinned after upload
- [ ] Bootstrap nodes are configured
- [ ] IPFS daemon is running 24/7 (or using pinning service)
- [ ] Files are accessible via public gateways
- [ ] CID shows providers in IPFS checker

## 🚀 Quick Fix Commands

```bash
# 1. Pin all existing evidence files
ipfs pin add $(mongosh trustchain --quiet --eval "db.evidences.find({}, {ipfsHash: 1}).forEach(e => print(e.ipfsHash))")

# 2. Check if node is connected
ipfs swarm peers | wc -l  # Should show > 0

# 3. Add bootstrap nodes if needed
ipfs bootstrap add /dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN

# 4. Restart IPFS daemon
ipfs daemon
```

---

**After implementing these fixes, your files will be available on the public IPFS network!** 🌐

