# How Judge Can View/Download Evidence Files from IPFS

## ✅ Feature Added!

Now when a Judge (or Lawyer) clicks **"📄 View/Download File"** button on any evidence card, they can:

1. **View images and PDFs** - Opens in a new browser tab
2. **Download other files** - Downloads to their computer (txt, videos, audio, etc.)

## How It Works:

### For Judge:
1. Login as Judge at http://localhost:3000
2. In Judge Dashboard, find the evidence with IPFS hash: `QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA`
3. Click **"📄 View/Download File"** button
4. The file will:
   - **Open in new tab** if it's an image (png, jpeg, etc.) or PDF
   - **Download** if it's a text file, video, audio, or other format

### For Lawyer:
- Same functionality - Lawyers can also view/download evidence files

## Technical Details:

- **Backend Route**: `GET /api/evidence/:evidenceId/download`
- **Process**: 
  1. Downloads file from IPFS using the stored CID
  2. Sends file to browser with proper content-type headers
  3. Browser handles display/download based on file type

## Manual IPFS Access (Alternative):

You can still use IPFS commands directly:

```bash
# Download file
ipfs get QmXwnWCyuGbUv73knTjRyfUDh2uqqDUtVHav4G597WPoUA -o downloaded_file

# View file
cat downloaded_file  # if text
xdg-open downloaded_file  # if image/video (Linux)
```

