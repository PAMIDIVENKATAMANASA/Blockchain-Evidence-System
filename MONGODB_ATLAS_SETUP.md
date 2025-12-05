# MongoDB Atlas Setup Guide

This guide will help you migrate from local MongoDB (Docker) to MongoDB Atlas (cloud).

## 📋 Prerequisites

1. MongoDB Atlas account (free tier available at https://www.mongodb.com/cloud/atlas)
2. Your MongoDB Atlas connection string

## 🚀 Step-by-Step Setup

### Step 1: Create MongoDB Atlas Cluster

1. **Sign up/Login to MongoDB Atlas**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Create a free account (M0 Free Tier)

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "M0 FREE" (Free Tier)
   - Select your preferred cloud provider and region
   - Click "Create"

3. **Configure Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Authentication Method: "Password"
   - Username: Choose a username (e.g., `trustchain_user`)
   - Password: Generate or create a strong password
   - Database User Privileges: "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For development, click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production, add specific IP addresses
   - Click "Confirm"

### Step 2: Get Connection String

1. **Get Connection String**
   - Go to "Database" → "Connect"
   - Click "Connect your application"
   - Driver: "Node.js"
   - Version: "4.1 or later"
   - Copy the connection string

   Example connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

2. **Update Connection String**
   - Replace `<password>` with your actual password
   - Replace `<dbname>` with `trustchain` (or your database name)
   - Final connection string should look like:
   ```
   mongodb+srv://trustchain_user:your_password@cluster0.xxxxx.mongodb.net/trustchain?retryWrites=true&w=majority
   ```

### Step 3: Update Server Configuration

#### Option A: Update .env File (Recommended)

Create or update `server/.env`:

```bash
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://trustchain_user:your_password@cluster0.xxxxx.mongodb.net/trustchain?retryWrites=true&w=majority

# Other environment variables
PORT=5000
JWT_SECRET=your-super-secret-jwt-key
BLOCKCHAIN_RPC_URL=http://localhost:8545
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
IPFS_URL=http://localhost:5001
```

#### Option B: Update server.js Directly

The server.js already uses environment variables, so just update the .env file.

### Step 4: Test Connection

#### Method 1: Test with Node.js Script

Create `test_mongodb_atlas.js`:

```javascript
const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' });

const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔍 Testing MongoDB Atlas connection...');
console.log('Connection string (hidden password):', MONGODB_URI?.replace(/:[^:@]+@/, ':****@'));

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Test database operations
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('\n📊 Collections in database:');
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    
    // Test User collection
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const userCount = await User.countDocuments();
    console.log(`\n👥 Total users: ${userCount}`);
    
    await mongoose.disconnect();
    console.log('\n✅ Connection test successful!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ MongoDB Atlas connection error:');
    console.error(err.message);
    process.exit(1);
  });
```

Run it:
```bash
node test_mongodb_atlas.js
```

#### Method 2: Test with Server

Start your server:
```bash
cd server
npm start
```

Look for: `✅ Connected to MongoDB` in the console output.

### Step 5: Migrate Existing Data (Optional)

If you have existing data in local MongoDB Docker, migrate it:

#### Export from Local MongoDB

```bash
# Export users collection
mongoexport --uri="mongodb://localhost:27017/trustchain" --collection=users --out=users.json

# Export evidences collection
mongoexport --uri="mongodb://localhost:27017/trustchain" --collection=evidences --out=evidences.json
```

#### Import to MongoDB Atlas

```bash
# Import users
mongoimport --uri="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/trustchain" --collection=users --file=users.json

# Import evidences
mongoimport --uri="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/trustchain" --collection=evidences --file=evidences.json
```

Or use mongorestore (if you have backup files):
```bash
mongodump --uri="mongodb://localhost:27017/trustchain" --out=./backup
mongorestore --uri="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/trustchain" ./backup/trustchain
```

### Step 6: Update Server to Use MongoDB Atlas

The server is already configured to use `MONGODB_URI` from environment variables. Just:

1. Update `.env` file with Atlas connection string
2. Restart the server
3. That's it! The server will automatically connect to Atlas.

### Step 7: Verify Connection

Check your MongoDB Atlas dashboard:
1. Go to "Database" → "Browse Collections"
2. You should see your `users` and `evidences` collections
3. View your data in the Atlas web interface

## 🔐 Security Best Practices

### For Production:

1. **Use Environment Variables**
   - Never hardcode connection strings
   - Use `.env` file (and add it to `.gitignore`)

2. **Restrict Network Access**
   - Don't use `0.0.0.0/0` in production
   - Add only your server's IP address

3. **Use Strong Passwords**
   - Generate random, complex passwords
   - Rotate passwords regularly

4. **Enable Encryption**
   - MongoDB Atlas encrypts data at rest by default
   - Use TLS/SSL for connections (enabled by default)

## 🐛 Troubleshooting

### Connection Timeout

**Problem:** Can't connect to Atlas

**Solutions:**
- Check if your IP is whitelisted in Network Access
- Verify connection string is correct
- Check if password has special characters (may need URL encoding)
- Ensure cluster is running (not paused)

### Authentication Failed

**Problem:** Authentication error

**Solutions:**
- Verify username and password are correct
- Check if database user has proper permissions
- Ensure password doesn't contain special characters that need URL encoding

### SSL/TLS Errors

**Problem:** SSL connection errors

**Solutions:**
- MongoDB Atlas uses SSL by default
- Connection string already includes SSL settings
- If issues persist, check Node.js version (should be v16+)

## 📊 Viewing Data in MongoDB Atlas

### Method 1: MongoDB Atlas Web Interface

1. Login to MongoDB Atlas
2. Go to "Database" → "Browse Collections"
3. Select your database (`trustchain`)
4. View collections and documents

### Method 2: MongoDB Compass

1. Download MongoDB Compass: https://www.mongodb.com/products/compass
2. Connect using your Atlas connection string
3. Browse and query data visually

### Method 3: Command Line

```bash
# Connect to Atlas
mongosh "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/trustchain"

# View users
db.users.find().pretty()

# View evidence
db.evidences.find().pretty()
```

## ✅ Checklist

- [ ] MongoDB Atlas account created
- [ ] Cluster created and running
- [ ] Database user created
- [ ] Network access configured (IP whitelisted)
- [ ] Connection string obtained and updated in `.env`
- [ ] Connection tested successfully
- [ ] Server connects to Atlas
- [ ] Existing data migrated (if needed)
- [ ] Data visible in Atlas dashboard

## 🔄 Switching Back to Local MongoDB

If you need to switch back to local MongoDB:

1. Update `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/trustchain
   ```

2. Restart server

That's it! The server will automatically use local MongoDB.

---

**Your data is now stored in MongoDB Atlas cloud!** 🌟

