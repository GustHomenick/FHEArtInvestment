const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log("=".repeat(60));
  console.log("Contract Interaction Script");
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

  console.log("\n📋 Contract Information");
  console.log("-".repeat(60));
  console.log(`Network:         ${hre.network.name}`);
  console.log(`Contract:        ${deploymentData.contractName}`);
  console.log(`Address:         ${contractAddress}`);

  // Get signer
  const [signer] = await ethers.getSigners();
  const signerAddress = await signer.getAddress();
  console.log(`Your Address:    ${signerAddress}`);

  // Connect to contract
  const contract = await ethers.getContractAt("PrivateArtInvestment", contractAddress);

  // Display menu
  console.log("\n📝 Available Actions");
  console.log("=".repeat(60));
  console.log("1. Get Contract Stats");
  console.log("2. Register as Investor");
  console.log("3. List New Artwork");
  console.log("4. Get Artwork Information");
  console.log("5. Make Private Investment");
  console.log("6. Check Investment Status");
  console.log("7. Check if Registered");
  console.log("8. Get Owner Address");
  console.log("0. Exit");
  console.log("=".repeat(60));

  const choice = await askQuestion("\nSelect an option (0-8): ");

  try {
    switch(choice.trim()) {
      case "1":
        await getContractStats(contract);
        break;

      case "2":
        await registerInvestor(contract, signer);
        break;

      case "3":
        await listArtwork(contract, signer);
        break;

      case "4":
        await getArtworkInfo(contract);
        break;

      case "5":
        await makeInvestment(contract, signer);
        break;

      case "6":
        await checkInvestmentStatus(contract, signerAddress);
        break;

      case "7":
        await checkIfRegistered(contract, signerAddress);
        break;

      case "8":
        await getOwner(contract);
        break;

      case "0":
        console.log("\nExiting...");
        break;

      default:
        console.log("\n❌ Invalid option selected");
    }
  } catch (error) {
    console.error("\n❌ Operation Failed");
    console.error("-".repeat(60));
    console.error(error.message);
  }

  rl.close();
  console.log("\n" + "=".repeat(60));
  console.log("Interaction Complete!");
  console.log("=".repeat(60) + "\n");
}

async function getContractStats(contract) {
  console.log("\n📊 Contract Statistics");
  console.log("-".repeat(60));

  const stats = await contract.getTotalStats();
  console.log(`Total Artworks:  ${stats[0]}`);
  console.log(`Total Investors: ${stats[1]}`);
}

async function registerInvestor(contract, signer) {
  console.log("\n📝 Registering as Investor");
  console.log("-".repeat(60));

  const isRegistered = await contract.isInvestorRegistered(await signer.getAddress());
  if (isRegistered) {
    console.log("✅ You are already registered as an investor");
    return;
  }

  console.log("Sending registration transaction...");
  const tx = await contract.registerInvestor();
  console.log(`Transaction Hash: ${tx.hash}`);

  console.log("Waiting for confirmation...");
  await tx.wait();

  console.log("✅ Successfully registered as investor!");
}

async function listArtwork(contract, signer) {
  console.log("\n🎨 List New Artwork");
  console.log("-".repeat(60));

  const name = await askQuestion("Artwork Name: ");
  const artist = await askQuestion("Artist Name: ");
  const ipfsHash = await askQuestion("IPFS Hash: ");
  const totalValue = await askQuestion("Total Value (ETH): ");
  const totalShares = await askQuestion("Total Shares: ");

  const totalValueWei = ethers.parseEther(totalValue);
  const sharePrice = totalValueWei / BigInt(totalShares);

  console.log("\n📋 Artwork Details");
  console.log(`Name:           ${name}`);
  console.log(`Artist:         ${artist}`);
  console.log(`IPFS Hash:      ${ipfsHash}`);
  console.log(`Total Value:    ${totalValue} ETH`);
  console.log(`Total Shares:   ${totalShares}`);
  console.log(`Share Price:    ${ethers.formatEther(sharePrice)} ETH`);

  const confirm = await askQuestion("\nProceed with listing? (yes/no): ");

  if (confirm.toLowerCase() === "yes" || confirm.toLowerCase() === "y") {
    console.log("\nSending transaction...");
    const tx = await contract.listArtwork(
      name,
      artist,
      ipfsHash,
      totalValueWei,
      sharePrice,
      totalShares
    );
    console.log(`Transaction Hash: ${tx.hash}`);

    console.log("Waiting for confirmation...");
    await tx.wait();

    console.log("✅ Artwork listed successfully!");
  } else {
    console.log("❌ Listing cancelled");
  }
}

async function getArtworkInfo(contract) {
  console.log("\n🎨 Artwork Information");
  console.log("-".repeat(60));

  const artworkId = await askQuestion("Artwork ID: ");

  try {
    const info = await contract.getArtworkInfo(artworkId);

    console.log("\n📋 Artwork Details");
    console.log("-".repeat(60));
    console.log(`Name:              ${info[0]}`);
    console.log(`Artist:            ${info[1]}`);
    console.log(`IPFS Hash:         ${info[2]}`);
    console.log(`Total Value:       ${ethers.formatEther(info[3])} ETH`);
    console.log(`Share Price:       ${ethers.formatEther(info[4])} ETH`);
    console.log(`Total Shares:      ${info[5]}`);
    console.log(`Available Shares:  ${info[6]}`);
    console.log(`Investor Count:    ${info[7]}`);
  } catch (error) {
    console.error("❌ Failed to get artwork info");
    console.error(error.message);
  }
}

async function makeInvestment(contract, signer) {
  console.log("\n💰 Make Private Investment");
  console.log("-".repeat(60));

  const artworkId = await askQuestion("Artwork ID: ");
  const shares = await askQuestion("Number of Shares: ");

  // Get artwork info to calculate payment
  const info = await contract.getArtworkInfo(artworkId);
  const sharePrice = info[4];
  const requiredPayment = sharePrice * BigInt(shares);

  console.log("\n📋 Investment Summary");
  console.log("-".repeat(60));
  console.log(`Artwork:         ${info[0]}`);
  console.log(`Shares:          ${shares}`);
  console.log(`Share Price:     ${ethers.formatEther(sharePrice)} ETH`);
  console.log(`Total Payment:   ${ethers.formatEther(requiredPayment)} ETH`);

  const confirm = await askQuestion("\nProceed with investment? (yes/no): ");

  if (confirm.toLowerCase() === "yes" || confirm.toLowerCase() === "y") {
    console.log("\nSending transaction...");
    const tx = await contract.makePrivateInvestment(artworkId, shares, {
      value: requiredPayment
    });
    console.log(`Transaction Hash: ${tx.hash}`);

    console.log("Waiting for confirmation...");
    await tx.wait();

    console.log("✅ Investment successful! Your investment is now private and encrypted.");
  } else {
    console.log("❌ Investment cancelled");
  }
}

async function checkInvestmentStatus(contract, address) {
  console.log("\n📊 Investment Status");
  console.log("-".repeat(60));

  const artworkId = await askQuestion("Artwork ID: ");

  const status = await contract.getInvestmentStatus(address, artworkId);

  console.log("\n📋 Status");
  console.log("-".repeat(60));
  console.log(`Has Invested:    ${status[0] ? "Yes" : "No"}`);

  if (status[0]) {
    const date = new Date(Number(status[1]) * 1000);
    console.log(`Investment Time: ${date.toLocaleString()}`);
  }
}

async function checkIfRegistered(contract, address) {
  console.log("\n👤 Registration Status");
  console.log("-".repeat(60));

  const isRegistered = await contract.isInvestorRegistered(address);
  console.log(`Status: ${isRegistered ? "✅ Registered" : "❌ Not Registered"}`);
}

async function getOwner(contract) {
  console.log("\n👤 Contract Owner");
  console.log("-".repeat(60));

  const owner = await contract.owner();
  console.log(`Owner Address: ${owner}`);
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
