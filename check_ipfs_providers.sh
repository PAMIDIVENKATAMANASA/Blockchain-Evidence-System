#!/bin/bash

###############################################################################
# Check IPFS Providers for Evidence Files
# 
# This script checks if your evidence files are available on the IPFS network
# and shows which nodes are providing them.
#
# Usage: ./check_ipfs_providers.sh [CID]
# Example: ./check_ipfs_providers.sh QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA
###############################################################################

if [ -z "$1" ]; then
    echo "❌ Please provide IPFS CID"
    echo ""
    echo "Usage: ./check_ipfs_providers.sh <CID>"
    echo "Example: ./check_ipfs_providers.sh QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA"
    echo ""
    echo "Or to check all evidence files from MongoDB:"
    echo "  ./check_ipfs_providers.sh all"
    exit 1
fi

CID="$1"

if [ "$CID" = "all" ]; then
    echo "🔍 Checking all evidence files from MongoDB..."
    echo ""
    
    # Get all CIDs from MongoDB
    CIDS=$(mongosh trustchain --quiet --eval "db.evidences.find({}, {ipfsHash: 1, evidenceId: 1, fileName: 1}).forEach(e => print(e.evidenceId + '|' + e.fileName + '|' + e.ipfsHash))")
    
    if [ -z "$CIDS" ]; then
        echo "⚠️  No evidence files found in MongoDB"
        exit 1
    fi
    
    echo "$CIDS" | while IFS='|' read -r evidenceId fileName ipfsHash; do
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "Evidence ID: $evidenceId"
        echo "File Name: $fileName"
        echo "IPFS CID: $ipfsHash"
        echo ""
        
        # Check providers
        echo "📡 Checking providers..."
        PROVIDERS=$(ipfs dht findprovs "$ipfsHash" 2>/dev/null | head -10)
        
        if [ -z "$PROVIDERS" ]; then
            echo "   ⚠️  No providers found"
            echo "   💡 File may not be pinned or node not connected to network"
        else
            PROVIDER_COUNT=$(echo "$PROVIDERS" | wc -l)
            echo "   ✅ Found $PROVIDER_COUNT provider(s):"
            echo "$PROVIDERS" | while read provider; do
                echo "      - $provider"
            done
        fi
        
        # Check if pinned locally
        PIN_STATUS=$(ipfs pin ls "$ipfsHash" 2>/dev/null)
        if [ -n "$PIN_STATUS" ]; then
            echo "   📌 Pinned locally: YES"
        else
            echo "   📌 Pinned locally: NO"
        fi
        
        echo ""
    done
    
else
    echo "🔍 Checking IPFS Providers for CID: $CID"
    echo "=" .repeat(60)
    echo ""
    
    # Check if CID is valid
    if ! ipfs resolve "$CID" > /dev/null 2>&1; then
        echo "⚠️  Warning: Could not resolve CID (may still be valid)"
    fi
    
    # Check providers
    echo "📡 Finding providers..."
    PROVIDERS=$(ipfs dht findprovs "$CID" 2>/dev/null)
    
    if [ -z "$PROVIDERS" ]; then
        echo "   ❌ No providers found for this CID"
        echo ""
        echo "💡 Possible reasons:"
        echo "   1. File is not pinned"
        echo "   2. IPFS node is not connected to network"
        echo "   3. File was just uploaded (needs time to propagate)"
        echo ""
        echo "🔧 Solutions:"
        echo "   1. Pin the file: ipfs pin add $CID"
        echo "   2. Check network connection: ipfs swarm peers"
        echo "   3. Wait a few minutes and try again"
        echo "   4. Run: node pin_existing_files.js"
    else
        PROVIDER_COUNT=$(echo "$PROVIDERS" | wc -l)
        echo "   ✅ Found $PROVIDER_COUNT provider(s):"
        echo ""
        echo "$PROVIDERS" | head -20 | while read provider; do
            echo "   - $provider"
        done
        
        if [ "$PROVIDER_COUNT" -gt 20 ]; then
            echo "   ... and more"
        fi
    fi
    
    echo ""
    
    # Check if pinned locally
    echo "📌 Local Pin Status:"
    PIN_STATUS=$(ipfs pin ls "$CID" 2>/dev/null)
    if [ -n "$PIN_STATUS" ]; then
        echo "   ✅ File is pinned locally"
        echo "   $PIN_STATUS"
    else
        echo "   ❌ File is NOT pinned locally"
        echo "   💡 Pin it with: ipfs pin add $CID"
    fi
    
    echo ""
    
    # Check swarm peers
    echo "🌐 Network Connection:"
    PEER_COUNT=$(ipfs swarm peers 2>/dev/null | wc -l)
    if [ "$PEER_COUNT" -gt 0 ]; then
        echo "   ✅ Connected to $PEER_COUNT peer(s)"
    else
        echo "   ⚠️  Not connected to any peers"
        echo "   💡 Check if IPFS daemon is running: ipfs daemon"
    fi
    
    echo ""
    echo "🌐 Public Gateway URLs:"
    echo "   https://ipfs.io/ipfs/$CID"
    echo "   https://gateway.ipfs.io/ipfs/$CID"
    echo "   https://cloudflare-ipfs.com/ipfs/$CID"
fi

