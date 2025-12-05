/**
 * Test MongoDB Atlas Connection
 * 
 * Usage: node test_mongodb_atlas.js
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  console.log('Please set MONGODB_URI in server/.env file');
  process.exit(1);
}

// Hide password in connection string for display
const displayURI = MONGODB_URI.replace(/:[^:@]+@/, ':****@');

console.log('🔍 Testing MongoDB Atlas Connection');
console.log('=' .repeat(60));
console.log('Connection string:', displayURI);
console.log('');

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log('');
    
    try {
      const db = mongoose.connection.db;
      
      // List all collections
      console.log('📊 Checking Collections...');
      const collections = await db.listCollections().toArray();
      
      if (collections.length === 0) {
        console.log('   ⚠️  No collections found (database is empty)');
      } else {
        console.log('   Collections found:');
        collections.forEach(col => {
          console.log(`   - ${col.name}`);
        });
      }
      console.log('');
      
      // Check User collection
      const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }), 'users');
      const userCount = await User.countDocuments();
      console.log(`👥 Users Collection:`);
      console.log(`   Total users: ${userCount}`);
      
      if (userCount > 0) {
        const users = await User.find({}).limit(5).select('name email role');
        console.log('   Sample users:');
        users.forEach(user => {
          console.log(`   - ${user.name} (${user.email}) - ${user.role}`);
        });
      }
      console.log('');
      
      // Check Evidence collection
      const Evidence = mongoose.model('Evidence', new mongoose.Schema({}, { strict: false }), 'evidences');
      const evidenceCount = await Evidence.countDocuments();
      console.log(`📁 Evidence Collection:`);
      console.log(`   Total evidence: ${evidenceCount}`);
      
      if (evidenceCount > 0) {
        const evidences = await Evidence.find({}).limit(3).select('evidenceId fileName ipfsHash status');
        console.log('   Sample evidence:');
        evidences.forEach(evidence => {
          console.log(`   - ID: ${evidence.evidenceId}, File: ${evidence.fileName}, Status: ${evidence.status}`);
        });
      }
      console.log('');
      
      // Database statistics
      const stats = await db.stats();
      console.log('📈 Database Statistics:');
      console.log(`   Database name: ${stats.db}`);
      console.log(`   Collections: ${stats.collections}`);
      console.log(`   Data size: ${(stats.dataSize / 1024).toFixed(2)} KB`);
      console.log(`   Storage size: ${(stats.storageSize / 1024).toFixed(2)} KB`);
      console.log('');
      
      console.log('✅ Connection test successful!');
      console.log('✅ MongoDB Atlas is working correctly!');
      
    } catch (error) {
      console.error('⚠️  Error checking collections:', error.message);
      console.log('(Connection successful, but could not read collections)');
    }
    
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ MongoDB Atlas connection error:');
    console.error('');
    console.error('Error details:');
    console.error(`   ${err.message}`);
    console.error('');
    console.error('🔧 Troubleshooting:');
    console.error('   1. Check if MONGODB_URI is correct in server/.env');
    console.error('   2. Verify your IP is whitelisted in MongoDB Atlas');
    console.error('   3. Check if username and password are correct');
    console.error('   4. Ensure the cluster is running (not paused)');
    console.error('   5. Check network connectivity');
    console.error('');
    process.exit(1);
  });

