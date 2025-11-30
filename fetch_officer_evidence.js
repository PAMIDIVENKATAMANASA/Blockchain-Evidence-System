/**
 * Fetch All Evidence Uploaded by an Officer
 * 
 * Usage: node fetch_officer_evidence.js <officer_email>
 * Example: node fetch_officer_evidence.js officer@demo.local
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Evidence = require('./server/models/Evidence');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trustchain';

async function fetchOfficerEvidence(officerEmail) {
  try {
    console.log('🔍 Fetching evidence for officer:', officerEmail);
    console.log('=' .repeat(60));
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Get User model
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    
    // Find officer
    const officer = await User.findOne({ 
      email: officerEmail.toLowerCase(), 
      role: 'officer' 
    });
    
    if (!officer) {
      console.error('❌ Officer not found:', officerEmail);
      console.log('\nAvailable officers:');
      const officers = await User.find({ role: 'officer' }, { email: 1, name: 1 });
      officers.forEach(o => {
        console.log(`  - ${o.email} (${o.name})`);
      });
      process.exit(1);
    }
    
    console.log('👤 Officer Details:');
    console.log('   Name:', officer.name);
    console.log('   Email:', officer.email);
    console.log('   Role:', officer.role);
    console.log('   Wallet Address:', officer.walletAddress || 'Not set');
    console.log('');
    
    // Find all evidence by this officer
    const evidences = await Evidence.find({ collectorId: officer._id })
      .sort({ createdAt: -1 });
    
    if (evidences.length === 0) {
      console.log('⚠️  No evidence found for this officer');
      await mongoose.disconnect();
      return;
    }
    
    console.log(`📁 Found ${evidences.length} evidence file(s):\n`);
    
    // Display evidence list
    evidences.forEach((evidence, index) => {
      console.log(`${index + 1}. Evidence ID: ${evidence.evidenceId}`);
      console.log(`   File Name: ${evidence.fileName}`);
      console.log(`   File Type: ${evidence.fileType}`);
      console.log(`   File Size: ${(evidence.fileSize / 1024).toFixed(2)} KB`);
      console.log(`   IPFS Hash: ${evidence.ipfsHash}`);
      console.log(`   Status: ${evidence.status}`);
      console.log(`   Uploaded: ${evidence.timestamp}`);
      console.log('');
    });
    
    // Create download directory
    const downloadDir = path.join(__dirname, 'downloads', officer.email.replace('@', '_at_'));
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }
    
    console.log('📥 Download Instructions:');
    console.log('=' .repeat(60));
    console.log('To download files, you can:');
    console.log('');
    console.log('1. Use the web interface:');
    console.log('   - Login as judge or the officer');
    console.log('   - Navigate to evidence list');
    console.log('   - Click download button');
    console.log('');
    console.log('2. Use API endpoint:');
    evidences.forEach(evidence => {
      console.log(`   curl -X GET "http://localhost:5000/api/evidence/${evidence.evidenceId}/download" \\`);
      console.log(`     -H "Authorization: Bearer YOUR_JWT_TOKEN" \\`);
      console.log(`     -o "${downloadDir}/${evidence.fileName}"`);
    });
    console.log('');
    console.log('3. Use IPFS directly:');
    evidences.forEach(evidence => {
      console.log(`   ipfs get ${evidence.ipfsHash} -o "${downloadDir}/${evidence.fileName}"`);
    });
    console.log('');
    console.log(`📂 Files will be downloaded to: ${downloadDir}`);
    console.log('');
    
    // Export metadata to JSON
    const metadataFile = path.join(downloadDir, 'evidence_metadata.json');
    const metadata = evidences.map(e => ({
      evidenceId: e.evidenceId,
      fileName: e.fileName,
      fileType: e.fileType,
      fileSize: e.fileSize,
      ipfsHash: e.ipfsHash,
      blockchainHash: e.blockchainHash,
      fileHash: e.fileHash,
      status: e.status,
      timestamp: e.timestamp,
      description: e.description,
      gpsCoordinates: e.gpsCoordinates
    }));
    
    fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));
    console.log(`✅ Metadata exported to: ${metadataFile}`);
    console.log('');
    
    await mongoose.disconnect();
    console.log('✅ Done!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Get officer email from command line
const officerEmail = process.argv[2];

if (!officerEmail) {
  console.error('❌ Please provide officer email');
  console.log('');
  console.log('Usage: node fetch_officer_evidence.js <officer_email>');
  console.log('Example: node fetch_officer_evidence.js officer@demo.local');
  console.log('');
  process.exit(1);
}

fetchOfficerEvidence(officerEmail);

