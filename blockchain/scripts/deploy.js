const hre = require("hardhat");

async function main() {
  console.log("Deploying ChainOfCustody contract...");

  const ChainOfCustody = await hre.ethers.getContractFactory("ChainOfCustody");
  const chainOfCustody = await ChainOfCustody.deploy();

  await chainOfCustody.waitForDeployment();

  const contractAddress = await chainOfCustody.getAddress();
  console.log("ChainOfCustody deployed to:", contractAddress);
  console.log("Contract owner:", await chainOfCustody.owner());

  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    contractAddress: contractAddress,
    network: hre.network.name,
    deployer: (await hre.ethers.getSigners())[0].address,
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(
    "./deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("Deployment info saved to deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

