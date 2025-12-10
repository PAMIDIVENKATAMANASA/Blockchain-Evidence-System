const { ethers } = require("ethers");
require("dotenv").config();

const provider = new ethers.JsonRpcProvider(
  process.env.SEPOLIA_RPC_URL || 
  "https://sepolia.infura.io/v3/7131a74d24af420298d28095445bef38"
);

const wallet = new ethers.Wallet(
  process.env.SEPOLIA_PRIVATE_KEY || 
  "0x6f1c58178a7ec68531d13b950a58a7d6c553633759fd9f53310be3982398ee67"
);

async function checkBalance() {
  try {
    const address = wallet.address;
    const balance = await provider.getBalance(address);
    const balanceEth = ethers.formatEther(balance);
    
    console.log("=".repeat(60));
    console.log("💰 Sepolia ETH Balance Check");
    console.log("=".repeat(60));
    console.log("Wallet Address:", address);
    console.log("Balance:", balanceEth, "Sepolia ETH");
    console.log("=".repeat(60));
    
    const balanceNum = parseFloat(balanceEth);
    
    if (balanceNum === 0) {
      console.log("\n❌ No funds! Get ETH from faucets:");
      console.log("\n📋 Faucet Links:");
      console.log("   1. Alchemy: https://sepoliafaucet.com/");
      console.log("   2. Infura: https://www.infura.io/faucet/sepolia");
      console.log("   3. PoW Faucet: https://sepolia-faucet.pk910.de/");
      console.log("   4. QuickNode: https://quicknode.com/faucet/ethereum/sepolia");
      console.log("\n💡 Recommended: Use Alchemy Faucet (https://sepoliafaucet.com/)");
      console.log("\n📝 Steps:");
      console.log("   1. Go to https://sepoliafaucet.com/");
      console.log("   2. Paste your wallet address:", address);
      console.log("   3. Click 'Send Me ETH'");
      console.log("   4. Wait 1-2 minutes");
      console.log("   5. Run this script again to check balance");
    } else if (balanceNum < 0.001) {
      console.log("\n⚠️  Low balance! You have some ETH but might need more for deployment.");
      console.log("   Recommended: Get more ETH from faucets");
    } else {
      console.log("\n✅ You have enough funds! Ready to deploy.");
      console.log("\n🚀 Deploy command:");
      console.log("   npm run deploy:sepolia");
    }
    
    console.log("\n🔍 View on Etherscan:");
    console.log("   https://sepolia.etherscan.io/address/" + address);
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.log("\n💡 Make sure you're connected to the internet");
  }
}

checkBalance();

