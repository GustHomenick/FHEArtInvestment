const { ethers } = require("hardhat");

async function main() {
  console.log("=".repeat(60));
  console.log("Contract Simulation Script");
  console.log("=".repeat(60));

  console.log("\n🚀 Deploying Contract for Simulation...");
  console.log("-".repeat(60));

  // Deploy contract
  const [owner, investor1, investor2, investor3] = await ethers.getSigners();
  const PrivateArtInvestment = await ethers.getContractFactory("PrivateArtInvestment");
  const contract = await PrivateArtInvestment.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log(`✅ Contract deployed at: ${contractAddress}`);
  console.log(`Owner: ${await owner.getAddress()}`);

  // Simulation Step 1: Register Investors
  console.log("\n" + "=".repeat(60));
  console.log("Step 1: Registering Investors");
  console.log("=".repeat(60));

  console.log("\nRegistering Investor 1...");
  let tx = await contract.connect(investor1).registerInvestor();
  await tx.wait();
  console.log(`✅ Investor 1 registered: ${await investor1.getAddress()}`);

  console.log("\nRegistering Investor 2...");
  tx = await contract.connect(investor2).registerInvestor();
  await tx.wait();
  console.log(`✅ Investor 2 registered: ${await investor2.getAddress()}`);

  console.log("\nRegistering Investor 3...");
  tx = await contract.connect(investor3).registerInvestor();
  await tx.wait();
  console.log(`✅ Investor 3 registered: ${await investor3.getAddress()}`);

  // Verification
  const stats1 = await contract.getTotalStats();
  console.log(`\n📊 Total Investors: ${stats1[1]}`);

  // Simulation Step 2: List Artworks
  console.log("\n" + "=".repeat(60));
  console.log("Step 2: Listing Artworks");
  console.log("=".repeat(60));

  const artworks = [
    {
      name: "The Starry Night Redux",
      artist: "Vincent Van Gogh Estate",
      ipfsHash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
      totalValue: ethers.parseEther("10.0"),
      totalShares: 100
    },
    {
      name: "Digital Dreams #42",
      artist: "Anonymous Digital Artist",
      ipfsHash: "QmPZ9gcCEpqKTo6aq61g2nXGUhM4iCL3ewB6LDXZCtWRnd",
      totalValue: ethers.parseEther("5.0"),
      totalShares: 50
    },
    {
      name: "Abstract Reality",
      artist: "Contemporary Collective",
      ipfsHash: "QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
      totalValue: ethers.parseEther("15.0"),
      totalShares: 150
    }
  ];

  for (let i = 0; i < artworks.length; i++) {
    const artwork = artworks[i];
    const sharePrice = artwork.totalValue / BigInt(artwork.totalShares);

    console.log(`\nListing Artwork ${i}: ${artwork.name}`);
    console.log(`  Artist:       ${artwork.artist}`);
    console.log(`  Total Value:  ${ethers.formatEther(artwork.totalValue)} ETH`);
    console.log(`  Share Price:  ${ethers.formatEther(sharePrice)} ETH`);
    console.log(`  Total Shares: ${artwork.totalShares}`);

    tx = await contract.listArtwork(
      artwork.name,
      artwork.artist,
      artwork.ipfsHash,
      artwork.totalValue,
      sharePrice,
      artwork.totalShares
    );
    await tx.wait();
    console.log(`  ✅ Listed`);
  }

  const stats2 = await contract.getTotalStats();
  console.log(`\n📊 Total Artworks: ${stats2[0]}`);

  // Simulation Step 3: Make Investments
  console.log("\n" + "=".repeat(60));
  console.log("Step 3: Making Private Investments");
  console.log("=".repeat(60));

  const investments = [
    { investor: investor1, artworkId: 0, shares: 10, name: "Investor 1" },
    { investor: investor2, artworkId: 0, shares: 20, name: "Investor 2" },
    { investor: investor3, artworkId: 1, shares: 5, name: "Investor 3" },
    { investor: investor1, artworkId: 2, shares: 15, name: "Investor 1" },
    { investor: investor2, artworkId: 2, shares: 25, name: "Investor 2" }
  ];

  for (const investment of investments) {
    const artworkInfo = await contract.getArtworkInfo(investment.artworkId);
    const sharePrice = artworkInfo[4];
    const payment = sharePrice * BigInt(investment.shares);

    console.log(`\n${investment.name} investing in Artwork ${investment.artworkId}`);
    console.log(`  Shares:   ${investment.shares}`);
    console.log(`  Payment:  ${ethers.formatEther(payment)} ETH`);

    tx = await contract.connect(investment.investor).makePrivateInvestment(
      investment.artworkId,
      investment.shares,
      { value: payment }
    );
    await tx.wait();
    console.log(`  ✅ Investment Complete (Private & Encrypted)`);
  }

  // Simulation Step 4: Display Final State
  console.log("\n" + "=".repeat(60));
  console.log("Step 4: Final Contract State");
  console.log("=".repeat(60));

  const finalStats = await contract.getTotalStats();
  console.log(`\n📊 Final Statistics:`);
  console.log(`  Total Artworks:  ${finalStats[0]}`);
  console.log(`  Total Investors: ${finalStats[1]}`);

  console.log(`\n🎨 Artwork Details:`);
  for (let i = 0; i < Number(finalStats[0]); i++) {
    const info = await contract.getArtworkInfo(i);
    const investorCount = await contract.getArtworkInvestors(i);

    console.log(`\nArtwork ${i}: ${info[0]}`);
    console.log(`  Artist:            ${info[1]}`);
    console.log(`  Total Value:       ${ethers.formatEther(info[3])} ETH`);
    console.log(`  Share Price:       ${ethers.formatEther(info[4])} ETH`);
    console.log(`  Available Shares:  ${info[6]} / ${info[5]}`);
    console.log(`  Investors:         ${investorCount}`);
  }

  console.log(`\n💼 Investment Status (Sample Check):`);
  const investors = [investor1, investor2, investor3];
  const investorNames = ["Investor 1", "Investor 2", "Investor 3"];

  for (let i = 0; i < investors.length; i++) {
    const address = await investors[i].getAddress();
    const isRegistered = await contract.isInvestorRegistered(address);

    console.log(`\n${investorNames[i]} (${address}):`);
    console.log(`  Registered: ${isRegistered ? "✅" : "❌"}`);

    // Check investments in each artwork
    let investmentCount = 0;
    for (let artId = 0; artId < Number(finalStats[0]); artId++) {
      const status = await contract.getInvestmentStatus(address, artId);
      if (status[0]) {
        investmentCount++;
        const date = new Date(Number(status[1]) * 1000);
        console.log(`  Artwork ${artId}: ✅ Invested at ${date.toLocaleString()}`);
      }
    }
    if (investmentCount === 0) {
      console.log(`  No investments yet`);
    }
  }

  // Display privacy features
  console.log("\n" + "=".repeat(60));
  console.log("Privacy Features Demonstration");
  console.log("=".repeat(60));
  console.log("\n🔒 All investment amounts are encrypted using FHE");
  console.log("🔒 Individual share quantities are private");
  console.log("🔒 Portfolio values are encrypted");
  console.log("✅ Only the investor can decrypt their own data");
  console.log("✅ Contract owner cannot see individual investment details");

  console.log("\n" + "=".repeat(60));
  console.log("Simulation Complete! 🎉");
  console.log("=".repeat(60));

  console.log("\n📋 Summary:");
  console.log(`  Contract Address:    ${contractAddress}`);
  console.log(`  Total Artworks:      ${finalStats[0]}`);
  console.log(`  Total Investors:     ${finalStats[1]}`);
  console.log(`  Total Investments:   ${investments.length}`);
  console.log(`  Network:             ${hre.network.name}`);

  console.log("\n");

  return {
    contract,
    contractAddress,
    owner,
    investors: [investor1, investor2, investor3],
    stats: finalStats
  };
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("\n❌ Simulation Failed");
      console.error("=".repeat(60));
      console.error(error);
      process.exit(1);
    });
}

module.exports = main;
