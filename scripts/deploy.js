const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("=".repeat(60));
  console.log("Starting Contract Deployment Process");
  console.log("=".repeat(60));

  // Get deployment account
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  const balance = await ethers.provider.getBalance(deployerAddress);

  console.log("\n📋 Deployment Configuration");
  console.log("-".repeat(60));
  console.log(`Network:         ${hre.network.name}`);
  console.log(`Deployer:        ${deployerAddress}`);
  console.log(`Balance:         ${ethers.formatEther(balance)} ETH`);
  console.log(`Chain ID:        ${(await ethers.provider.getNetwork()).chainId}`);

  // Check balance
  if (balance === 0n) {
    throw new Error("Insufficient balance for deployment");
  }

  console.log("\n🚀 Deploying PrivateArtInvestment Contract...");
  console.log("-".repeat(60));

  // Deploy contract
  const PrivateArtInvestment = await ethers.getContractFactory("PrivateArtInvestment");
  const startTime = Date.now();

  const contract = await PrivateArtInvestment.deploy();
  await contract.waitForDeployment();

  const deployTime = ((Date.now() - startTime) / 1000).toFixed(2);
  const contractAddress = await contract.getAddress();

  console.log(`✅ Contract deployed successfully!`);
  console.log(`📍 Address:      ${contractAddress}`);
  console.log(`⏱️  Deploy Time:  ${deployTime}s`);

  // Verify deployment
  console.log("\n🔍 Verifying Deployment...");
  console.log("-".repeat(60));

  try {
    const owner = await contract.owner();
    const totalArtworks = await contract.totalArtworks();
    const totalInvestors = await contract.totalInvestors();

    console.log(`Owner:           ${owner}`);
    console.log(`Total Artworks:  ${totalArtworks}`);
    console.log(`Total Investors: ${totalInvestors}`);
    console.log(`Status:          ✅ Verified`);
  } catch (error) {
    console.error(`Status:          ❌ Verification Failed`);
    throw error;
  }

  // Save deployment information
  const deploymentData = {
    network: hre.network.name,
    contractName: "PrivateArtInvestment",
    contractAddress: contractAddress,
    deployer: deployerAddress,
    deploymentBlock: await ethers.provider.getBlockNumber(),
    deploymentTime: new Date().toISOString(),
    deploymentTimestamp: Math.floor(Date.now() / 1000),
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    compiler: {
      version: "0.8.24",
      optimizer: true,
      runs: 200
    },
    transactionHash: contract.deploymentTransaction()?.hash
  };

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  // Save to network-specific file
  const deploymentFile = path.join(deploymentsDir, `${hre.network.name}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentData, null, 2));

  // Save to general contract-address.json for backward compatibility
  const contractAddressFile = path.join(__dirname, "..", "contract-address.json");
  fs.writeFileSync(contractAddressFile, JSON.stringify(deploymentData, null, 2));

  console.log("\n💾 Deployment Data Saved");
  console.log("-".repeat(60));
  console.log(`File:            ${path.basename(deploymentFile)}`);
  console.log(`Location:        ./deployments/`);

  // Display next steps
  console.log("\n📝 Next Steps");
  console.log("=".repeat(60));
  console.log(`1. Verify contract on Etherscan:`);
  console.log(`   npx hardhat run scripts/verify.js --network ${hre.network.name}`);
  console.log(`\n2. Interact with the contract:`);
  console.log(`   npx hardhat run scripts/interact.js --network ${hre.network.name}`);
  console.log(`\n3. View on Etherscan:`);

  if (hre.network.name === "sepolia") {
    console.log(`   https://sepolia.etherscan.io/address/${contractAddress}`);
  } else if (hre.network.name === "mainnet") {
    console.log(`   https://etherscan.io/address/${contractAddress}`);
  }

  console.log("\n" + "=".repeat(60));
  console.log("Deployment Complete! 🎉");
  console.log("=".repeat(60) + "\n");

  return {
    contract,
    address: contractAddress,
    deploymentData
  };
}

// Execute deployment
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("\n❌ Deployment Failed");
      console.error("=".repeat(60));
      console.error(error);
      process.exit(1);
    });
}

module.exports = main;
