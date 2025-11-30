const { create } = require('ipfs-http-client')
const crypto = require('crypto')

// Initialize IPFS client (compatible with ipfs-http-client v57.x)
let client = null

function getIPFSClient() {
  if (!client) {
    const url = process.env.IPFS_URL || 'http://localhost:5001'

    // For v57, we can pass a URL string
    client = create({ url })
  }
  return client
}

// Upload file to IPFS (any type)
async function uploadToIPFS(fileBuffer, fileName) {
  try {
    const ipfs = getIPFSClient()

    const result = await ipfs.add({
      path: fileName,
      content: fileBuffer,
    })

    const cid = result.cid.toString()

    return {
      success: true,
      cid,
      path: result.path,
      size: result.size,
    }
  } catch (error) {
    console.error('Error uploading to IPFS:', error)
    throw error
  }
}

// Download file from IPFS
async function downloadFromIPFS(cid) {
  try {
    const ipfs = getIPFSClient()

    const chunks = []
    for await (const chunk of ipfs.cat(cid)) {
      chunks.push(chunk)
    }

    const fileBuffer = Buffer.concat(chunks)

    return {
      success: true,
      buffer: fileBuffer,
    }
  } catch (error) {
    console.error('Error downloading from IPFS:', error)
    throw error
  }
}

// Calculate SHA-256 hash of file buffer (used for blockchain integrity)
function calculateFileHash(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex')
}

module.exports = {
  uploadToIPFS,
  downloadFromIPFS,
  calculateFileHash,
}
