/**
 * Pin All Existing Evidence Files to IPFS
 * 
 * This script pins all existing evidence files to IPFS so they're available
 * on the public network and show up in IPFS checkers.
 * 
 * Usage: node pin_existing_files.js
 */

const mongoose = require('mongoose');
const Evidence = require('./server/models/Evidence');
const { pinFile } = require('./server/services/ipfs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trustchain';

async function pinAllEvidenceFiles() {
  try {
    console.log('📌 Pinning All Evidence Files to IPFS');
    console.log('=' .repeat(60));
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Get all evidence
    const evidences = await Evidence.find({});
    
    if (evidences.length === 0) {
      console.log('⚠️  No evidence files found in database');
      await mongoose.disconnect();
      return;
    }
    
    console.log(`📁 Found ${evidences.length} evidence file(s) to pin\n`);
    
    let successCount = 0;
    let failCount = 0;
    
    for (const evidence of evidences) {
      try {
        console.log(`📌 Pinning Evidence ID ${evidence.evidenceId}:`);
        console.log(`   File: ${evidence.fileName}`);
        console.log(`   IPFS CID: ${evidence.ipfsHash}`);
        
        const result = await pinFile(evidence.ipfsHash);
        
        if (result.success) {
          console.log(`   ✅ Successfully pinned\n`);
          successCount++;
        } else {
          console.log(`   ⚠️  Warning: ${result.error || 'Unknown error'}\n`);
          failCount++;
        }
      } catch (error) {
        console.error(`   ❌ Error pinning ${evidence.ipfsHash}:`, error.message);
        failCount++;
      }
    }
    
    console.log('=' .repeat(60));
    console.log('📊 Summary:');
    console.log(`   ✅ Successfully pinned: ${successCount}`);
    console.log(`   ❌ Failed: ${failCount}`);
    console.log(`   📁 Total: ${evidences.length}`);
    console.log('');
    
    if (successCount > 0) {
      console.log('✅ Files are now pinned and will be available on IPFS network!');
      console.log('💡 Note: It may take a few minutes for files to appear in public IPFS checkers');
      console.log('💡 Make sure your IPFS daemon is running and connected to the network');
    }
    
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

// Run the script
pinAllEvidenceFiles();

