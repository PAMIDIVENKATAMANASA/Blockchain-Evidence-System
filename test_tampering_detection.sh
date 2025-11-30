#!/bin/bash

###############################################################################
# Test Script: Tampering Detection Test
# 
# This script demonstrates how the system detects file tampering:
# 1. Creates a test file
# 2. Uploads it to IPFS
# 3. Calculates hash
# 4. Modifies the file
# 5. Recalculates hash to show difference
#
# Usage: ./test_tampering_detection.sh
###############################################################################

echo "🧪 TAMPERING DETECTION TEST"
echo "============================"
echo ""

# Create test directory
TEST_DIR="/tmp/tampering_test"
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"

# Step 1: Create original test file
echo "📝 Step 1: Creating original test file..."
echo "This is an original evidence document.
Case Number: 12345
Officer: John Doe
Date: $(date)
Content: Important evidence data." > original_evidence.txt
echo "✅ Original file created"
echo ""

# Step 2: Calculate original hash
echo "🔐 Step 2: Calculating original SHA-256 hash..."
ORIGINAL_HASH=$(sha256sum original_evidence.txt | cut -d' ' -f1)
ORIGINAL_SIZE=$(stat -f%z original_evidence.txt 2>/dev/null || stat -c%s original_evidence.txt)
echo "   Original Hash: $ORIGINAL_HASH"
echo "   File Size: $ORIGINAL_SIZE bytes"
echo ""

# Step 3: Upload to IPFS (if IPFS is running)
echo "📤 Step 3: Uploading to IPFS..."
if command -v ipfs &> /dev/null; then
    IPFS_CID=$(ipfs add -Q original_evidence.txt 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo "   ✅ Uploaded to IPFS"
        echo "   IPFS CID: $IPFS_CID"
    else
        echo "   ⚠️  IPFS daemon not running or error occurred"
        echo "   (This is OK for demonstration purposes)"
        IPFS_CID=""
    fi
else
    echo "   ⚠️  IPFS not installed or not in PATH"
    IPFS_CID=""
fi
echo ""

# Step 4: Create tampered version
echo "⚠️  Step 4: TAMPERING THE FILE..."
echo "   Adding unauthorized modification to the file..."
echo "" >> original_evidence.txt
echo "TAMPERED: Modified evidence content added illegally" >> original_evidence.txt
echo "✅ File has been tampered with"
echo ""

# Step 5: Calculate new hash
echo "🔐 Step 5: Calculating NEW hash of tampered file..."
TAMPERED_HASH=$(sha256sum original_evidence.txt | cut -d' ' -f1)
TAMPERED_SIZE=$(stat -f%z original_evidence.txt 2>/dev/null || stat -c%s original_evidence.txt)
echo "   Tampered Hash: $TAMPERED_HASH"
echo "   New File Size: $TAMPERED_SIZE bytes"
echo ""

# Step 6: Compare hashes
echo "🔍 Step 6: COMPARING HASHES..."
echo "============================"
echo "   Original Hash:  $ORIGINAL_HASH"
echo "   Tampered Hash:  $TAMPERED_HASH"
echo ""

if [ "$ORIGINAL_HASH" != "$TAMPERED_HASH" ]; then
    echo "✅ TAMPERING DETECTED!"
    echo "   The hashes are DIFFERENT - this proves the file was modified."
    echo "   The blockchain verification system would flag this as 'TAMPERED'."
else
    echo "❌ ERROR: Hashes are the same (this should not happen)"
fi
echo ""

# Step 7: Show file differences
echo "📊 Step 7: File Content Comparison"
echo "============================"
echo ""
echo "--- Original File Content ---"
head -3 original_evidence.txt
echo "..."
echo ""
echo "--- Tampered File Content (showing added lines) ---"
tail -2 original_evidence.txt
echo ""

# Step 8: Demonstrate blockchain verification concept
echo "💡 How Blockchain Verification Works:"
echo "============================"
echo "1. When evidence is uploaded:"
echo "   - Original hash ($ORIGINAL_HASH) is stored on blockchain"
echo "   - This hash is IMMUTABLE (cannot be changed)"
echo ""
echo "2. When evidence is verified:"
echo "   - Current file is downloaded from IPFS"
echo "   - Current hash is calculated: $TAMPERED_HASH"
echo "   - Current hash is compared with blockchain hash: $ORIGINAL_HASH"
echo ""
echo "3. Result:"
echo "   - Hashes don't match → Evidence is TAMPERED ❌"
echo "   - System status: 'TAMPERED'"
echo "   - Judge is alerted to the tampering"
echo ""

# Cleanup option
echo "🧹 Cleanup"
echo "============================"
echo "Test files are in: $TEST_DIR"
echo "To remove test files, run: rm -rf $TEST_DIR"
echo ""
echo "✅ Test completed!"

