const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const PrivateArtInvestment = await ethers.getContractFactory("PrivateArtInvestment");
  const contract = await PrivateArtInvestment.deploy();

  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("PrivateArtInvestment deployed to:", contractAddress);

  // 验证合约部署
  console.log("\nContract deployment verification:");
  console.log("Owner:", await contract.owner());
  console.log("Total artworks:", await contract.totalArtworks());
  console.log("Total investors:", await contract.totalInvestors());

  // 保存合约地址到文件
  const fs = require("fs");
  const contractData = {
    address: contractAddress,
    network: hre.network.name,
    deploymentTime: new Date().toISOString()
  };

  fs.writeFileSync(
    "./contract-address.json",
    JSON.stringify(contractData, null, 2)
  );

  console.log("\nContract address saved to contract-address.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });