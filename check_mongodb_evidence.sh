#!/bin/bash
CID="QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA"

echo "🔍 Checking MongoDB for evidence with IPFS hash: $CID"
echo ""
echo "Run this in mongosh:"
echo ""
echo "mongosh"
echo "use trustchain"
echo "db.evidences.find({ ipfsHash: \"$CID\" }).pretty()"
echo ""
echo "Or run this one-liner:"
echo "mongosh trustchain --eval 'db.evidences.find({ ipfsHash: \"$CID\" }).pretty()'"
