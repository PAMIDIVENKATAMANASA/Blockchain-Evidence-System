const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("Verifying contract on Etherscan...");

  // Load deployment info
  const deploymentPath = "./deployment.json";
  if (!fs.existsSync(deploymentPath)) {
    console.error("❌ deployment.json not found. Please deploy the contract first.");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  const contractAddress = deployment.contractAddress;

  if (!contractAddress) {
    console.error("❌ Contract address not found in deployment.json");
    process.exit(1);
  }

  console.log(`Verifying contract at: ${contractAddress}`);
  console.log(`Network: ${deployment.network || hre.network.name}`);

  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [], // ChainOfCustody has no constructor arguments
    });

    console.log("✅ Contract verified successfully!");
    console.log(`View on Etherscan: https://sepolia.etherscan.io/address/${contractAddress}`);
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ Contract is already verified!");
      console.log(`View on Etherscan: https://sepolia.etherscan.io/address/${contractAddress}`);
    } else {
      console.error("❌ Verification failed:", error.message);
      process.exit(1);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

