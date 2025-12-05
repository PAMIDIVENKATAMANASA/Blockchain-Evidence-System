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

// Pin file to IPFS (keeps it available on network)
async function pinFile(cid) {
  try {
    const ipfs = getIPFSClient()
    await ipfs.pin.add(cid)
    console.log(`✅ File pinned to IPFS: ${cid}`)
    return { success: true, cid }
  } catch (error) {
    console.error('Error pinning file:', error)
    // Don't throw - pinning failure shouldn't break upload
    return { success: false, error: error.message }
  }
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

    // Automatically pin the file to keep it available on the network
    try {
      await pinFile(cid)
    } catch (pinError) {
      console.warn(`⚠️  Could not pin file ${cid}:`, pinError.message)
      // Continue even if pinning fails - file is still uploaded
    }

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

// Get public gateway URL for a CID
function getPublicGatewayURL(cid) {
  const gatewayURL = process.env.IPFS_GATEWAY_URL || process.env.IPFS_GATEWAY_URL || 'http://localhost:8080'
  // Support both with and without trailing slash
  const baseURL = gatewayURL.endsWith('/') ? gatewayURL.slice(0, -1) : gatewayURL
  return `${baseURL}/ipfs/${cid}`
}

module.exports = {
  uploadToIPFS,
  downloadFromIPFS,
  calculateFileHash,
  getPublicGatewayURL,
  pinFile,
}
