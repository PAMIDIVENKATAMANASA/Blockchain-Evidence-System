#!/bin/bash
CID="QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA"

echo "📥 Downloading evidence file from IPFS..."
ipfs get "$CID" -o /tmp/evidence_file 2>&1

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ File downloaded successfully!"
    echo ""
    echo "📊 File Information:"
    ls -lh /tmp/evidence_file
    echo ""
    echo "📄 File Type:"
    file /tmp/evidence_file
    echo ""
    echo "🔐 SHA-256 Hash (for blockchain comparison):"
    sha256sum /tmp/evidence_file
    echo ""
    echo "📍 File location: /tmp/evidence_file"
    echo ""
    echo "💡 To view the file:"
    echo "   cat /tmp/evidence_file  # if text file"
    echo "   xdg-open /tmp/evidence_file  # if image/video (Linux)"
else
    echo "❌ Error downloading file. Is IPFS daemon running?"
    echo "   Start it with: ipfs daemon"
fi
