/**
 * Test Script: Compare IPFS Hash and Blockchain Hash
 * 
 * Usage: node test_hash_comparison.js <evidenceId>
 * Example: node test_hash_comparison.js 1
 */

const mongoose = require('mongoose');
const Evidence = require('./server/models/Evidence');
const { downloadFromIPFS, calculateFileHash } = require('./server/services/ipfs');
const { getOriginalHash } = require('./server/services/blockchain');
const { ethers } = require('ethers');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trustchain';

async function testHashComparison(evidenceId) {
  try {
    console.log('🔍 Testing Hash Comparison for Evidence ID:', evidenceId);
    console.log('=' .repeat(60));
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Get evidence from MongoDB
    const evidence = await Evidence.findOne({ evidenceId: parseInt(evidenceId) });
    
    if (!evidence) {
      console.error('❌ Evidence not found in MongoDB');
      process.exit(1);
    }
    
    console.log('📄 Evidence Details:');
    console.log('   File Name:', evidence.fileName);
    console.log('   IPFS Hash (CID):', evidence.ipfsHash);
    console.log('   File Hash (SHA-256):', evidence.fileHash);
    console.log('   Blockchain Transaction:', evidence.blockchainHash);
    console.log('   Collector:', evidence.collectorName);
    console.log('   Status:', evidence.status);
    console.log('');
    
    // Download file from IPFS
    console.log('📥 Downloading file from IPFS...');
    const ipfsResult = await downloadFromIPFS(evidence.ipfsHash);
    console.log('✅ File downloaded successfully');
    console.log('   File Size:', ipfsResult.buffer.length, 'bytes');
    console.log('');
    
    // Calculate current file hash
    console.log('🔐 Calculating current file hash...');
    const currentFileHash = calculateFileHash(ipfsResult.buffer);
    const currentHashBytes32 = ethers.keccak256(ethers.toUtf8Bytes(currentFileHash));
    console.log('   SHA-256 Hash:', currentFileHash);
    console.log('   Bytes32 Hash:', currentHashBytes32);
    console.log('');
    
    // Get original hash from blockchain
    console.log('⛓️  Retrieving original hash from blockchain...');
    const blockchainData = await getOriginalHash(parseInt(evidenceId));
    
    if (!blockchainData.exists) {
      console.error('❌ Evidence not found on blockchain');
      process.exit(1);
    }
    
    console.log('✅ Blockchain data retrieved');
    console.log('   Original Bytes32 Hash:', blockchainData.hash);
    console.log('   Collector Address:', blockchainData.collector);
    console.log('   Blockchain Timestamp:', new Date(parseInt(blockchainData.timestamp) * 1000));
    console.log('');
    
    // Compare hashes
    console.log('🔍 Comparing Hashes...');
    console.log('=' .repeat(60));
    const isAuthentic = currentHashBytes32.toLowerCase() === blockchainData.hash.toLowerCase();
    
    if (isAuthentic) {
      console.log('✅ RESULT: 100% AUTHENTIC');
      console.log('   The file has NOT been tampered with.');
      console.log('   Current hash matches blockchain hash.');
    } else {
      console.log('❌ RESULT: TAMPERED');
      console.log('   The file HAS been modified!');
      console.log('   Current hash does NOT match blockchain hash.');
    }
    console.log('');
    
    console.log('📊 Hash Comparison:');
    console.log('   Current Hash:   ', currentHashBytes32);
    console.log('   Blockchain Hash:', blockchainData.hash);
    console.log('   Match:          ', isAuthentic ? '✅ YES' : '❌ NO');
    console.log('');
    
    // Additional information
    console.log('📋 Summary:');
    console.log('   Evidence ID:', evidenceId);
    console.log('   IPFS CID:', evidence.ipfsHash);
    console.log('   File Authentic:', isAuthentic);
    console.log('   Verification Status:', isAuthentic ? 'VERIFIED' : 'TAMPERED');
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Get evidence ID from command line
const evidenceId = process.argv[2];

if (!evidenceId) {
  console.error('❌ Please provide evidence ID');
  console.log('Usage: node test_hash_comparison.js <evidenceId>');
  console.log('Example: node test_hash_comparison.js 1');
  process.exit(1);
}

testHashComparison(evidenceId);

