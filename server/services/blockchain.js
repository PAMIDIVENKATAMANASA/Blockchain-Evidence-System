const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// Load contract ABI and address
let contractABI = null;
let contractAddress = null;

// Initialize contract info from deployment
function loadContractInfo() {
  try {
    const deploymentPath = path.join(__dirname, "../../blockchain/deployment.json");
    if (fs.existsSync(deploymentPath)) {
      const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
      contractAddress = deployment.contractAddress;
    }

    // Load ABI from compiled contract
    const artifactPath = path.join(
      __dirname,
      "../../blockchain/artifacts/contracts/ChainOfCustody.sol/ChainOfCustody.json"
    );
    if (fs.existsSync(artifactPath)) {
      const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
      contractABI = artifact.abi;
    }
  } catch (error) {
    console.error("Error loading contract info:", error);
  }
}

// Initialize on module load
loadContractInfo();

// Get provider (local Hardhat node)
function getProvider() {
  const providerUrl = process.env.BLOCKCHAIN_RPC_URL || "http://localhost:8545";
  return new ethers.JsonRpcProvider(providerUrl);
}

// Get signer from private key
function getSigner() {
  const privateKey = process.env.PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Hardhat default
  const provider = getProvider();
  return new ethers.Wallet(privateKey, provider);
}

// Get signer address (helper for routes)
async function getSignerAddress() {
  const signer = getSigner();
  return signer.address;
}

// Get contract instance
function getContract() {
  if (!contractABI || !contractAddress) {
    loadContractInfo();
  }

  if (!contractABI || !contractAddress) {
    throw new Error("Contract not deployed. Please deploy the contract first.");
  }

  const signer = getSigner();
  return new ethers.Contract(contractAddress, contractABI, signer);
}

// Add evidence to blockchain
// hashBytes32 should be the file hash (SHA256 converted to bytes32 via keccak256)
async function addEvidence(hashBytes32, collectorAddress) {
  try {
    const contract = getContract();

    const tx = await contract.addEvidence(hashBytes32, collectorAddress);
    // tx.wait() returns the transaction receipt in ethers v6
    const receipt = await tx.wait();

    // Get the evidence ID from events in the receipt
    const event = receipt.logs
      .map((log) => {
        try {
          return contract.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find((e) => e && e.name === "EvidenceAdded");

    if (event) {
      return {
        success: true,
        evidenceId: event.args.evidenceId.toString(),
        transactionHash: tx.hash,
      };
    }

    // Fallback: get the latest evidence count
    const count = await contract.getEvidenceCount();
    return {
      success: true,
      evidenceId: count.toString(),
      transactionHash: tx.hash,
    };
  } catch (error) {
    console.error("Error adding evidence to blockchain:", error);
    throw error;
  }
}

// Get original hash from blockchain
async function getOriginalHash(evidenceId) {
  try {
    const contract = getContract();
    const result = await contract.getOriginalHash(evidenceId);

    return {
      hash: result.hash,
      collector: result.collector,
      timestamp: result.timestamp.toString(),
      exists: result.exists,
    };
  } catch (error) {
    console.error("Error getting original hash from blockchain:", error);
    throw error;
  }
}

// Check if address is judge
async function isJudge(address) {
  try {
    const contract = getContract();
    return await contract.isJudge(address);
  } catch (error) {
    console.error("Error checking judge status:", error);
    return false;
  }
}

// Check if address is lawyer
async function isLawyer(address) {
  try {
    const contract = getContract();
    return await contract.isLawyer(address);
  } catch (error) {
    console.error("Error checking lawyer status:", error);
    return false;
  }
}

module.exports = {
  addEvidence,
  getOriginalHash,
  isJudge,
  isLawyer,
  getProvider,
  getContract,
  loadContractInfo,
  getSignerAddress,
};

