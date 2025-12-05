/**
 * Test IPFS Public Gateway Access
 * 
 * Usage: node test_ipfs_public_gateway.js <CID>
 * Example: node test_ipfs_public_gateway.js QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA
 */

const { downloadFromIPFS, getPublicGatewayURL } = require('./server/services/ipfs');

async function testPublicGateway(cid) {
  if (!cid) {
    console.error('❌ Please provide IPFS CID');
    console.log('');
    console.log('Usage: node test_ipfs_public_gateway.js <CID>');
    console.log('Example: node test_ipfs_public_gateway.js QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA');
    process.exit(1);
  }

  console.log('🌐 Testing IPFS Public Gateway Access');
  console.log('=' .repeat(60));
  console.log('CID:', cid);
  console.log('');
  
  const gatewayURL = process.env.IPFS_GATEWAY_URL || 'http://localhost:8080';
  const publicURL = getPublicGatewayURL(cid);
  
  console.log('📋 Gateway Configuration:');
  console.log('   Gateway URL:', gatewayURL);
  console.log('   Public Gateway URL:', publicURL);
  console.log('');
  
  // Test 1: Direct IPFS API access
  console.log('📥 Test 1: IPFS API Access (localhost)');
  console.log('─' .repeat(60));
  try {
    const result = await downloadFromIPFS(cid);
    console.log('   ✅ IPFS API: SUCCESS');
    console.log('   File Size:', result.buffer.length, 'bytes');
    console.log('   Status: File accessible via IPFS API');
  } catch (error) {
    console.log('   ❌ IPFS API: FAILED');
    console.log('   Error:', error.message);
    console.log('   Make sure IPFS daemon is running on port 5001');
  }
  console.log('');
  
  // Test 2: Public Gateway access
  console.log('🌐 Test 2: Public Gateway Access');
  console.log('─' .repeat(60));
  
  // Check if fetch is available (Node.js 18+)
  let fetch;
  try {
    fetch = require('node-fetch');
  } catch {
    // Try global fetch (Node.js 18+)
    if (typeof global.fetch === 'function') {
      fetch = global.fetch;
    } else {
      console.log('   ⚠️  Cannot test HTTP gateway (fetch not available)');
      console.log('   Install node-fetch: npm install node-fetch');
      console.log('   Or use curl to test manually:');
      console.log(`   curl -I ${publicURL}`);
      return;
    }
  }
  
  try {
    const response = await fetch(publicURL, { method: 'HEAD' });
    
    if (response.ok) {
      console.log('   ✅ Public Gateway: SUCCESS');
      console.log('   Status:', response.status, response.statusText);
      console.log('   Content-Type:', response.headers.get('content-type') || 'N/A');
      console.log('   Content-Length:', response.headers.get('content-length') || 'N/A', 'bytes');
      console.log('');
      console.log('   ✅ File is accessible via public gateway!');
      console.log('   ✅ Can be viewed from any node on the internet!');
      console.log('');
      console.log('   📝 Access URL:');
      console.log(`   ${publicURL}`);
    } else {
      console.log('   ❌ Public Gateway: FAILED');
      console.log('   Status:', response.status, response.statusText);
      console.log('');
      console.log('   🔧 Troubleshooting:');
      console.log('   1. Check if IPFS gateway is running (port 8080)');
      console.log('   2. Verify gateway is configured for public access');
      console.log('   3. Check firewall rules (port 8080 should be open)');
      console.log('   4. Verify CID exists and file is pinned');
    }
  } catch (error) {
    console.log('   ❌ Public Gateway: FAILED');
    console.log('   Error:', error.message);
    console.log('');
    console.log('   🔧 Troubleshooting:');
    console.log('   1. Check if IPFS gateway is running');
    console.log('   2. Verify gateway URL in environment variables');
    console.log('   3. Check network connectivity');
    console.log('   4. If using public IP, verify firewall/port forwarding');
  }
  console.log('');
  
  // Test 3: Alternative public gateways
  console.log('🌐 Test 3: Alternative Public Gateways');
  console.log('─' .repeat(60));
  
  const publicGateways = [
    { name: 'IPFS.io', url: `https://ipfs.io/ipfs/${cid}` },
    { name: 'Gateway IPFS', url: `https://gateway.ipfs.io/ipfs/${cid}` },
    { name: 'Cloudflare IPFS', url: `https://cloudflare-ipfs.com/ipfs/${cid}` },
  ];
  
  for (const gateway of publicGateways) {
    try {
      const response = await fetch(gateway.url, { method: 'HEAD' });
      if (response.ok) {
        console.log(`   ✅ ${gateway.name}: Accessible`);
      } else {
        console.log(`   ⚠️  ${gateway.name}: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.log(`   ❌ ${gateway.name}: Not accessible (file may not be on public network yet)`);
    }
  }
  
  console.log('');
  console.log('💡 Tips:');
  console.log('   - Your file will be accessible via public gateways once');
  console.log('     it propagates through the IPFS network');
  console.log('   - Pin your files to ensure they stay available');
  console.log('   - Use your own gateway for faster access');
  console.log('');
}

// Get CID from command line
const cid = process.argv[2];
testPublicGateway(cid).catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});

