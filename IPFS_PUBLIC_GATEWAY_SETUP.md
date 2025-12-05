# IPFS Public Gateway Setup Guide

This guide will help you configure IPFS to be accessible via public gateway so files can be viewed from any node on the internet.

## 📋 Overview

By default, IPFS runs on localhost and files are only accessible locally. To make files publicly accessible:

1. **Configure IPFS for public access**
2. **Enable public gateway**
3. **Configure CORS (for web access)**
4. **Set up proper port forwarding/firewall rules**
5. **Pin important files for availability**

## 🚀 Step-by-Step Setup

### Step 1: Configure IPFS for Public Gateway

#### Update IPFS Configuration

Run these commands to configure IPFS:

```bash
# Set API address to be accessible from outside (if needed)
ipfs config Addresses.API /ip4/0.0.0.0/tcp/5001

# Set Gateway address to be accessible from outside
ipfs config Addresses.Gateway /ip4/0.0.0.0/tcp/8080

# Enable Gateway
ipfs config --bool Gateway.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
ipfs config --bool Gateway.HTTPHeaders.Access-Control-Allow-Methods '["GET", "POST"]'
ipfs config --bool Gateway.HTTPHeaders.Access-Control-Allow-Headers '["*"]'

# Set Gateway root (allow access to all content)
ipfs config --bool Gateway.RootRedirect ""

# Disable Gateway writable (security)
ipfs config --bool Gateway.Writable false

# Show current configuration
ipfs config show
```

#### Alternative: Manual Configuration File Edit

Edit `~/.ipfs/config` (or `%USERPROFILE%\.ipfs\config` on Windows):

```json
{
  "Addresses": {
    "API": "/ip4/0.0.0.0/tcp/5001",
    "Gateway": "/ip4/0.0.0.0/tcp/8080",
    "Swarm": [
      "/ip4/0.0.0.0/tcp/4001",
      "/ip6/::/tcp/4001"
    ]
  },
  "Gateway": {
    "HTTPHeaders": {
      "Access-Control-Allow-Origin": ["*"],
      "Access-Control-Allow-Methods": ["GET", "POST"],
      "Access-Control-Allow-Headers": ["*"]
    },
    "RootRedirect": "",
    "Writable": false
  }
}
```

### Step 2: Restart IPFS Daemon

After configuration changes, restart IPFS:

```bash
# Stop IPFS daemon (Ctrl+C if running in terminal)
# Or kill the process:
pkill ipfs

# Start IPFS daemon
ipfs daemon
```

The daemon should start and show:
```
API server listening on /ip4/0.0.0.0/tcp/5001
WebUI: http://127.0.0.1:5001/webui
Gateway (readonly) server listening on /ip4/0.0.0.0/tcp/8080
```

### Step 3: Configure Firewall/Port Forwarding

#### For Local Development (Behind Router)

If your IPFS node is behind a router, you need port forwarding:

1. **Forward Ports on Router:**
   - Port `4001` (Swarm/TCP)
   - Port `8080` (Gateway/HTTP)
   - Port `5001` (API - optional, only if you want external API access)

2. **Configure Firewall:**
   ```bash
   # Ubuntu/Debian (UFW)
   sudo ufw allow 4001/tcp
   sudo ufw allow 8080/tcp
   sudo ufw allow 5001/tcp
   
   # Or iptables
   sudo iptables -A INPUT -p tcp --dport 4001 -j ACCEPT
   sudo iptables -A INPUT -p tcp --dport 8080 -j ACCEPT
   sudo iptables -A INPUT -p tcp --dport 5001 -j ACCEPT
   ```

#### For Cloud/Server Deployment

If running on a cloud server:

1. **Open ports in cloud firewall:**
   - AWS: Security Groups
   - Google Cloud: Firewall Rules
   - Azure: Network Security Groups
   - DigitalOcean: Cloud Firewalls

2. **Ensure ports are open:**
   ```bash
   # Check if ports are listening
   sudo netstat -tulpn | grep -E ':(4001|5001|8080)'
   ```

### Step 4: Get Your Public IP Address

Find your public IP address:

```bash
# Linux/Mac
curl ifconfig.me
# or
curl ipinfo.io/ip

# Or visit: https://whatismyipaddress.com/
```

Your public gateway URL will be:
```
http://YOUR_PUBLIC_IP:8080/ipfs/<CID>
```

Example:
```
http://123.45.67.89:8080/ipfs/QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA
```

### Step 5: Test Public Gateway

#### Test Locally First

```bash
# Upload a test file
echo "Hello from IPFS!" > test.txt
CID=$(ipfs add -Q test.txt)
echo "CID: $CID"

# Test gateway locally
curl http://localhost:8080/ipfs/$CID
# Should output: Hello from IPFS!
```

#### Test from Public Gateway

```bash
# Replace YOUR_PUBLIC_IP with your actual IP
curl http://YOUR_PUBLIC_IP:8080/ipfs/$CID
```

Or open in browser:
```
http://YOUR_PUBLIC_IP:8080/ipfs/QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA
```

### Step 6: Update Server Configuration

Update your server to use public gateway URLs:

#### Option A: Add Gateway URL to Environment

Update `server/.env`:

```bash
# IPFS Configuration
IPFS_URL=http://localhost:5001
IPFS_GATEWAY_URL=http://YOUR_PUBLIC_IP:8080
# Or use public gateway service:
# IPFS_GATEWAY_URL=https://ipfs.io
# IPFS_GATEWAY_URL=https://gateway.pinata.cloud
```

#### Option B: Update IPFS Service

Update `server/services/ipfs.js` to include gateway URL helper:

```javascript
// Add this function to get public gateway URL
function getPublicGatewayURL(cid) {
  const gatewayURL = process.env.IPFS_GATEWAY_URL || 'http://localhost:8080';
  return `${gatewayURL}/ipfs/${cid}`;
}

// Export it
module.exports = {
  uploadToIPFS,
  downloadFromIPFS,
  calculateFileHash,
  getPublicGatewayURL,  // Add this
}
```

### Step 7: Pin Important Files

Pin your evidence files to ensure they stay available:

```bash
# Pin a file by CID
ipfs pin add QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA

# List pinned files
ipfs pin ls

# Check if file is pinned
ipfs pin ls QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA
```

### Step 8: Use Public IPFS Gateway Services (Alternative)

If you don't want to host your own public gateway, use public services:

#### Option 1: IPFS.io Public Gateway
```
https://ipfs.io/ipfs/<CID>
https://gateway.ipfs.io/ipfs/<CID>
```

#### Option 2: Pinata Gateway
1. Sign up at https://www.pinata.cloud/ (free tier available)
2. Upload/pin your files
3. Use their gateway:
   ```
   https://gateway.pinata.cloud/ipfs/<CID>
   ```

#### Option 3: Cloudflare IPFS Gateway
```
https://cloudflare-ipfs.com/ipfs/<CID>
```

## 🔧 Advanced Configuration

### Enable WebUI for Monitoring

```bash
# Enable WebUI
ipfs config --bool Addresses.API "/ip4/0.0.0.0/tcp/5001"

# Access WebUI at:
# http://localhost:5001/webui
# or http://YOUR_PUBLIC_IP:5001/webui
```

### Configure Bootstrap Nodes

Ensure you're connected to IPFS network:

```bash
# List bootstrap nodes
ipfs config show | grep Bootstrap

# Add more bootstrap nodes if needed
ipfs bootstrap add /ip4/104.131.131.82/tcp/4001/ipfs/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ
```

### Monitor IPFS Status

```bash
# Check if IPFS is running
ipfs id

# Check peers (should show connected peers)
ipfs swarm peers

# Check repository stats
ipfs repo stat
```

## 📝 Update Server Code to Provide Gateway URLs

Update evidence routes to include public gateway URL:

### Update Evidence Model Response

In `server/routes/evidence.js`, update the response to include gateway URL:

```javascript
// After uploading evidence, add gateway URL
res.status(201).json({
  message: "Evidence uploaded and sealed successfully",
  evidence: {
    evidenceId: evidence.evidenceId,
    fileName: evidence.fileName,
    ipfsHash: evidence.ipfsHash,
    ipfsGatewayURL: `${process.env.IPFS_GATEWAY_URL || 'http://localhost:8080'}/ipfs/${evidence.ipfsHash}`,  // Add this
    blockchainHash: evidence.blockchainHash,
    timestamp: evidence.timestamp,
    status: evidence.status,
  },
});
```

## 🧪 Testing Public Gateway Access

### Test Script

Create `test_ipfs_public_gateway.js`:

```javascript
const { downloadFromIPFS, getPublicGatewayURL } = require('./server/services/ipfs');

async function testPublicGateway(cid) {
  console.log('🔍 Testing IPFS Public Gateway Access');
  console.log('=' .repeat(60));
  
  const gatewayURL = process.env.IPFS_GATEWAY_URL || 'http://localhost:8080';
  const publicURL = `${gatewayURL}/ipfs/${cid}`;
  
  console.log('📄 CID:', cid);
  console.log('🌐 Public Gateway URL:', publicURL);
  console.log('');
  
  // Test direct IPFS API
  try {
    console.log('📥 Testing IPFS API access...');
    const result = await downloadFromIPFS(cid);
    console.log('✅ IPFS API: Success');
    console.log('   File Size:', result.buffer.length, 'bytes');
  } catch (error) {
    console.log('❌ IPFS API: Failed -', error.message);
  }
  
  // Test public gateway
  try {
    console.log('\n🌐 Testing Public Gateway access...');
    const response = await fetch(publicURL);
    if (response.ok) {
      const buffer = await response.arrayBuffer();
      console.log('✅ Public Gateway: Success');
      console.log('   File Size:', buffer.byteLength, 'bytes');
      console.log('   Accessible from any node: YES');
    } else {
      console.log('❌ Public Gateway: Failed -', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Public Gateway: Failed -', error.message);
    console.log('   Make sure:');
    console.log('   1. IPFS daemon is running');
    console.log('   2. Gateway is configured on port 8080');
    console.log('   3. Firewall allows port 8080');
    console.log('   4. Port forwarding is configured (if behind router)');
  }
}

// Usage: node test_ipfs_public_gateway.js <CID>
const cid = process.argv[2];
if (!cid) {
  console.error('Please provide IPFS CID');
  process.exit(1);
}

testPublicGateway(cid);
```

Run it:
```bash
node test_ipfs_public_gateway.js QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA
```

## 🔐 Security Considerations

1. **Don't expose API port (5001) publicly** - Only gateway (8080) should be public
2. **Use read-only gateway** - Set `Gateway.Writable: false`
3. **Consider rate limiting** - For production, add rate limiting to gateway
4. **Use HTTPS** - For production, use reverse proxy (nginx) with SSL
5. **Monitor bandwidth** - Public gateway can consume significant bandwidth

## 🌐 Production Setup with Domain Name

For production, set up a domain name:

1. **Point domain to your server IP**
2. **Set up reverse proxy (nginx)**
3. **Enable SSL/HTTPS**

Example nginx config:

```nginx
server {
    listen 80;
    server_name ipfs.yourdomain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Then access via:
```
http://ipfs.yourdomain.com/ipfs/<CID>
```

## ✅ Checklist

- [ ] IPFS daemon configured for public gateway
- [ ] Gateway port (8080) is open and accessible
- [ ] Swarm port (4001) is open for peer connections
- [ ] Firewall rules configured
- [ ] Port forwarding configured (if behind router)
- [ ] Public gateway tested and working
- [ ] Server code updated to include gateway URLs
- [ ] Important files are pinned
- [ ] Public gateway URL added to environment variables

## 🔗 Quick Reference

### Public Gateway URLs

Once configured, files can be accessed via:
```
http://YOUR_PUBLIC_IP:8080/ipfs/<CID>
```

### Check Gateway Status

```bash
# Check if gateway is accessible
curl -I http://localhost:8080/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG

# Should return 200 OK
```

### View Files in Browser

Simply open in browser:
```
http://YOUR_PUBLIC_IP:8080/ipfs/<CID>
```

---

**Your IPFS files are now accessible from anywhere on the internet!** 🌟

