# Contract Deployment Guide

Complete guide for deploying and managing the PrivateArtInvestment smart contract.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Verification](#verification)
- [Interaction](#interaction)
- [Deployment Information](#deployment-information)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying the contract, ensure you have:

- Node.js (v16 or higher)
- npm or yarn package manager
- A wallet with sufficient ETH for deployment
- Infura or Alchemy API key for network access
- Etherscan API key for contract verification

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Network RPC URL
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_API_KEY

# Deployer private key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Etherscan API key for verification
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

**Security Warning**: Never commit your `.env` file to version control!

## Configuration

### Network Settings

The project is configured for multiple networks in `hardhat.config.js`:

- **Hardhat Network**: Local development (default)
- **Sepolia Testnet**: Ethereum testnet
- **Localhost**: Local node at `http://127.0.0.1:8545`

### Compiler Settings

- Solidity Version: `0.8.24`
- Optimizer: Enabled (200 runs)
- EVM Version: Cancun
- Via IR: Enabled

## Deployment

### Deploy to Sepolia Testnet

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### Deploy to Local Network

First, start a local Hardhat node:

```bash
npx hardhat node
```

Then deploy in a new terminal:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

### Deployment Output

The deployment script will:

1. Display deployer account and balance
2. Deploy the PrivateArtInvestment contract
3. Verify initial contract state
4. Save deployment data to:
   - `./deployments/{network}.json`
   - `./contract-address.json`

Example output:

```
============================================================
Starting Contract Deployment Process
============================================================

📋 Deployment Configuration
------------------------------------------------------------
Network:         sepolia
Deployer:        0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Balance:         1.5 ETH
Chain ID:        11155111

🚀 Deploying PrivateArtInvestment Contract...
------------------------------------------------------------
✅ Contract deployed successfully!
📍 Address:      0x1234567890abcdef1234567890abcdef12345678
⏱️  Deploy Time:  15.23s

🔍 Verifying Deployment...
------------------------------------------------------------
Owner:           0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Total Artworks:  0
Total Investors: 0
Status:          ✅ Verified
```

## Verification

### Verify Contract on Etherscan

After deployment, verify the contract source code:

```bash
npx hardhat run scripts/verify.js --network sepolia
```

The verification script will:

1. Load deployment data from `./deployments/sepolia.json`
2. Wait for Etherscan to index the contract
3. Submit source code for verification
4. Update deployment file with verification status

### Manual Verification

If automatic verification fails, you can verify manually on Etherscan:

1. Visit: `https://sepolia.etherscan.io/address/{CONTRACT_ADDRESS}#code`
2. Click "Verify and Publish"
3. Use these settings:
   - Compiler Type: Solidity (Single file)
   - Compiler Version: v0.8.24+commit.e11b9ed9
   - Open Source License Type: MIT
   - Optimization: Yes (200 runs)

## Interaction

### Interactive CLI

Use the interaction script for manual operations:

```bash
npx hardhat run scripts/interact.js --network sepolia
```

Available actions:

1. Get Contract Stats
2. Register as Investor
3. List New Artwork
4. Get Artwork Information
5. Make Private Investment
6. Check Investment Status
7. Check if Registered
8. Get Owner Address

### Simulation

Run a complete simulation with test data:

```bash
npx hardhat run scripts/simulate.js --network localhost
```

This will:

- Deploy a fresh contract
- Register multiple test investors
- List sample artworks
- Execute test investments
- Display final contract state

## Deployment Information

### Sepolia Testnet

After deployment, you will receive:

- **Contract Address**: The deployed contract address
- **Transaction Hash**: The deployment transaction
- **Block Number**: The block containing the deployment
- **Etherscan Link**: Direct link to view on Etherscan

Example:

```
Network:           sepolia
Contract Address:  0x1234567890abcdef1234567890abcdef12345678
Deployer:          0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Deployment Block:  5123456
Chain ID:          11155111
Etherscan:         https://sepolia.etherscan.io/address/0x1234567890abcdef1234567890abcdef12345678
```

### Deployment Files

Deployment data is saved in JSON format:

**`./deployments/sepolia.json`**:

```json
{
  "network": "sepolia",
  "contractName": "PrivateArtInvestment",
  "contractAddress": "0x1234567890abcdef1234567890abcdef12345678",
  "deployer": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "deploymentBlock": 5123456,
  "deploymentTime": "2025-10-28T03:15:30.000Z",
  "deploymentTimestamp": 1730087730,
  "chainId": 11155111,
  "compiler": {
    "version": "0.8.24",
    "optimizer": true,
    "runs": 200
  },
  "transactionHash": "0xabcdef...",
  "verified": true,
  "verifiedAt": "2025-10-28T03:20:45.000Z"
}
```

## Troubleshooting

### Common Issues

#### 1. Insufficient Balance

**Error**: "Insufficient balance for deployment"

**Solution**: Ensure your deployer account has enough ETH for gas fees. For Sepolia, get test ETH from:

- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)

#### 2. Invalid Private Key

**Error**: "Invalid private key"

**Solution**: Check your `.env` file:

- Remove the `0x` prefix from the private key
- Ensure no extra spaces or line breaks
- Verify the key is valid

#### 3. Network Connection Error

**Error**: "Cannot connect to network"

**Solution**:

- Verify your RPC URL in `.env`
- Check your internet connection
- Try a different RPC provider (Infura, Alchemy, etc.)

#### 4. Verification Failed

**Error**: "Verification failed on Etherscan"

**Solution**:

- Wait a few minutes after deployment
- Verify your ETHERSCAN_API_KEY is correct
- Check if the contract is already verified
- Try manual verification on Etherscan

#### 5. Contract Already Deployed

**Error**: "Contract already deployed"

**Solution**: This is informational. If you want to redeploy:

- Delete the deployment file: `./deployments/{network}.json`
- Deploy again

### Gas Optimization

For production deployments:

1. Monitor gas prices: https://etherscan.io/gastracker
2. Deploy during low-traffic periods
3. Consider using gas price estimation tools
4. Adjust gas settings in `hardhat.config.js` if needed

### Security Best Practices

1. **Never share your private key**
2. **Always use a .env file** for sensitive data
3. **Add .env to .gitignore**
4. **Use a dedicated deployment wallet**
5. **Verify contracts on Etherscan** for transparency
6. **Test on testnet first** before mainnet deployment
7. **Audit smart contracts** before production use

## Scripts Reference

| Script | Command | Description |
|--------|---------|-------------|
| Deploy | `npx hardhat run scripts/deploy.js --network sepolia` | Deploy the contract |
| Verify | `npx hardhat run scripts/verify.js --network sepolia` | Verify on Etherscan |
| Interact | `npx hardhat run scripts/interact.js --network sepolia` | Interactive CLI |
| Simulate | `npx hardhat run scripts/simulate.js --network localhost` | Run simulation |
| Compile | `npx hardhat compile` | Compile contracts |
| Test | `npx hardhat test` | Run tests |
| Clean | `npx hardhat clean` | Clean artifacts |

## Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Sepolia Testnet Explorer](https://sepolia.etherscan.io/)
- [OpenZeppelin Security](https://docs.openzeppelin.com/contracts/)

## Support

For issues or questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review Hardhat documentation
3. Check Etherscan for transaction details
4. Review deployment logs

---

**Last Updated**: October 2025
