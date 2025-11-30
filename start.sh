#!/bin/bash

# TrustChain Startup Script
# This script helps start all services

echo "🚀 Starting TrustChain System..."
echo ""

# Check if IPFS is running
echo "📦 Checking IPFS..."
if curl -s http://localhost:5001/api/v0/version > /dev/null 2>&1; then
    echo "✅ IPFS is running"
else
    echo "❌ IPFS is not running. Please start IPFS daemon: ipfs daemon"
    exit 1
fi

# Check if MongoDB is running
echo "🗄️  Checking MongoDB..."
if pgrep -x "mongod" > /dev/null || docker ps | grep -q mongodb; then
    echo "✅ MongoDB is running"
else
    echo "⚠️  MongoDB might not be running. Please ensure MongoDB is started."
fi

# Check if Hardhat node is running
echo "⛓️  Checking Blockchain..."
if curl -s http://localhost:8545 > /dev/null 2>&1; then
    echo "✅ Blockchain node is running"
else
    echo "⚠️  Blockchain node might not be running."
    echo "   Start it with: cd blockchain && npx hardhat node"
fi

echo ""
echo "📋 Starting services..."
echo ""

# Start server in background
echo "🔧 Starting server..."
cd server
npm start &
SERVER_PID=$!
cd ..

# Wait a bit for server to start
sleep 3

# Start client
echo "🎨 Starting client..."
cd client
npm run dev &
CLIENT_PID=$!
cd ..

echo ""
echo "✅ Services started!"
echo "📡 Server: http://localhost:5000"
echo "🌐 Client: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
trap "kill $SERVER_PID $CLIENT_PID 2>/dev/null; exit" INT TERM
wait

