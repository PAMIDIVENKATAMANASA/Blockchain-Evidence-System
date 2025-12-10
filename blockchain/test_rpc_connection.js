const { ethers } = require("ethers");
require("dotenv").config();

async function testRPCConnection() {
  const rpcUrls = [
    {
      name: "Infura (Your Current)",
      url: process.env.SEPOLIA_RPC_URL || "https://sepolia.infura.io/v3/7131a74d24af420298d28095445bef38"
    },
    {
      name: "Public Sepolia RPC",
      url: "https://rpc.sepolia.org"
    },
    {
      name: "Alchemy (Alternative)",
      url: "https://eth-sepolia.g.alchemy.com/v2/demo"
    },
    {
      name: "Ankr (Alternative)",
      url: "https://rpc.ankr.com/eth_sepolia"
    }
  ];

  console.log("🔍 Testing RPC Connections...\n");

  for (const rpc of rpcUrls) {
    try {
      console.log(`Testing ${rpc.name}...`);
      const provider = new ethers.JsonRpcProvider(rpc.url, {
        name: "sepolia",
        chainId: 11155111,
      });
      
      // Test with timeout
      const blockNumber = await Promise.race([
        provider.getBlockNumber(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Timeout after 10 seconds")), 10000)
        )
      ]);
      
      console.log(`✅ ${rpc.name}: CONNECTED (Block: ${blockNumber})`);
      console.log(`   URL: ${rpc.url}`);
      console.log(`   ✅ This RPC endpoint works!\n`);
      
      return { success: true, url: rpc.url, name: rpc.name };
      
    } catch (error) {
      console.log(`❌ ${rpc.name}: FAILED - ${error.message}`);
      console.log(`   URL: ${rpc.url}\n`);
    }
  }

  console.log("❌ All RPC endpoints failed. Check your internet connection.");
  return { success: false };
}

testRPCConnection()
  .then(result => {
    if (result.success) {
      console.log("\n💡 Update your .env file with the working RPC URL:");
      console.log(`   SEPOLIA_RPC_URL=${result.url}`);
      process.exit(0);
    } else {
      process.exit(1);
    }
  })
  .catch(error => {
    console.error("Error:", error);
    process.exit(1);
  });

