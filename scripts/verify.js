const { run } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("=".repeat(60));
  console.log("Contract Verification on Etherscan");
  console.log("=".repeat(60));

  // Load deployment data
  const deploymentFile = path.join(__dirname, "..", "deployments", `${hre.network.name}.json`);

  if (!fs.existsSync(deploymentFile)) {
    console.error("\n❌ Deployment file not found!");
    console.error(`Please deploy the contract first using:`);
    console.error(`npx hardhat run scripts/deploy.js --network ${hre.network.name}`);
    process.exit(1);
  }

  const deploymentData = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  const contractAddress = deploymentData.contractAddress;

  console.log("\n📋 Verification Details");
  console.log("-".repeat(60));
  console.log(`Network:         ${hre.network.name}`);
  console.log(`Contract:        ${deploymentData.contractName}`);
  console.log(`Address:         ${contractAddress}`);
  console.log(`Deployer:        ${deploymentData.deployer}`);
  console.log(`Deployed:        ${deploymentData.deploymentTime}`);

  // Check if Etherscan API key is set
  if (!process.env.ETHERSCAN_API_KEY) {
    console.warn("\n⚠️  Warning: ETHERSCAN_API_KEY not set in .env file");
    console.warn("Verification may fail without a valid API key");
  }

  console.log("\n🔍 Starting Verification Process...");
  console.log("-".repeat(60));

  try {
    // Wait a bit for Etherscan to index the contract
    console.log("Waiting for Etherscan to index the contract...");
    await new Promise(resolve => setTimeout(resolve, 10000));

    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
      contract: "contracts/PrivateArtInvestment.sol:PrivateArtInvestment"
    });

    console.log("\n✅ Contract Verified Successfully!");
    console.log("-".repeat(60));

    if (hre.network.name === "sepolia") {
      console.log(`View on Etherscan:`);
      console.log(`https://sepolia.etherscan.io/address/${contractAddress}#code`);
    } else if (hre.network.name === "mainnet") {
      console.log(`View on Etherscan:`);
      console.log(`https://etherscan.io/address/${contractAddress}#code`);
    }

    // Update deployment data with verification status
    deploymentData.verified = true;
    deploymentData.verifiedAt = new Date().toISOString();
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentData, null, 2));

    console.log("\n✅ Verification status saved to deployment file");

  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("\n✅ Contract Already Verified!");
      console.log("-".repeat(60));

      if (hre.network.name === "sepolia") {
        console.log(`View on Etherscan:`);
        console.log(`https://sepolia.etherscan.io/address/${contractAddress}#code`);
      } else if (hre.network.name === "mainnet") {
        console.log(`View on Etherscan:`);
        console.log(`https://etherscan.io/address/${contractAddress}#code`);
      }
    } else {
      console.error("\n❌ Verification Failed!");
      console.error("-".repeat(60));
      console.error(error.message);

      console.log("\n📝 Troubleshooting:");
      console.log("1. Check your ETHERSCAN_API_KEY in .env file");
      console.log("2. Ensure the contract is deployed and confirmed");
      console.log("3. Wait a few minutes and try again");
      console.log("4. Verify manually on Etherscan if needed");

      throw error;
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("Verification Process Complete!");
  console.log("=".repeat(60) + "\n");
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("\n❌ Script Failed");
      console.error(error);
      process.exit(1);
    });
}

module.exports = main;
