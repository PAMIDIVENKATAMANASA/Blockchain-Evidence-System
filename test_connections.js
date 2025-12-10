/**
 * Test Blockchain RPC and MongoDB Connections
 * 
 * Usage: node test_connections.js
 */

require('dotenv').config({ path: './server/.env' });

async function testConnections() {
  console.log('🔍 Testing Connections...\n');
  console.log('='.repeat(60));
  
  // Test 1: Blockchain RPC
  console.log('\n📡 Test 1: Blockchain RPC Connection');
  console.log('-'.repeat(60));
  
  const rpcUrls = [
    {
      name: 'Current (from .env)',
      url: process.env.BLOCKCHAIN_RPC_URL || 'https://rpc.sepolia.org'
    },
    {
      name: 'Infura (Alternative)',
      url: 'https://sepolia.infura.io/v3/7131a74d24af420298d28095445bef38'
    },
    {
      name: 'Ankr (Alternative)',
      url: 'https://rpc.ankr.com/eth_sepolia'
    }
  ];
  
  for (const rpc of rpcUrls) {
    try {
      console.log(`\nTesting ${rpc.name}...`);
      console.log(`URL: ${rpc.url}`);
      
      const response = await fetch(rpc.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_blockNumber',
          params: [],
          id: 1
        }),
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      if (response.ok) {
        const data = await response.json();
        const blockNumber = parseInt(data.result, 16);
        console.log(`✅ ${rpc.name}: CONNECTED`);
        console.log(`   Block Number: ${blockNumber}`);
        console.log(`   ✅ This RPC works! Use this in your .env`);
        break; // Use first working RPC
      } else {
        console.log(`❌ ${rpc.name}: FAILED (${response.status})`);
      }
    } catch (error) {
      console.log(`❌ ${rpc.name}: FAILED`);
      console.log(`   Error: ${error.message}`);
    }
  }
  
  // Test 2: MongoDB
  console.log('\n\n📊 Test 2: MongoDB Connection');
  console.log('-'.repeat(60));
  
  const mongoose = require('mongoose');
  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    console.log('❌ MONGODB_URI not found in .env');
  } else {
    // Hide password in display
    const displayURI = MONGODB_URI.replace(/:[^:@]+@/, ':****@');
    console.log(`Connection: ${displayURI}`);
    
    try {
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 10000, // 10 seconds for test
        socketTimeoutMS: 10000,
      });
      
      console.log('✅ MongoDB: CONNECTED');
      
      const db = mongoose.connection.db;
      const collections = await db.listCollections().toArray();
      console.log(`   Collections: ${collections.length}`);
      
      await mongoose.disconnect();
    } catch (error) {
      console.log('❌ MongoDB: FAILED');
      console.log(`   Error: ${error.message}`);
      console.log('\n💡 Troubleshooting:');
      console.log('   1. Check internet connection');
      console.log('   2. Verify MONGODB_URI is correct');
      console.log('   3. Check MongoDB Atlas network access (IP whitelist)');
      console.log('   4. Verify MongoDB Atlas cluster is running');
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Connection tests complete!');
}

testConnections().catch(console.error);


