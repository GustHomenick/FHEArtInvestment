# Quick Start Guide

Get up and running with the Private Art Investment Platform in 5 minutes.

## Step 1: Install Dependencies

```bash
npm install
```

This will install:
- Hardhat (development framework)
- Ethers.js (blockchain interaction)
- Hardhat toolbox (utilities)
- Verification tools
- dotenv (environment management)

## Step 2: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your details
# Use any text editor
```

Required variables:

```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_API_KEY
PRIVATE_KEY=your_private_key_without_0x_prefix
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### Get Your Keys

1. **Infura API Key**:
   - Visit https://infura.io/
   - Sign up for free account
   - Create new project
   - Copy the API key

2. **Private Key**:
   - Use MetaMask or any Ethereum wallet
   - Export private key (Settings > Security & Privacy)
   - **Remove the 0x prefix**

3. **Etherscan API Key**:
   - Visit https://etherscan.io/
   - Sign up for free account
   - Go to API-KEYs section
   - Create new API key

4. **Test ETH**:
   - Visit https://sepoliafaucet.com/
   - Enter your wallet address
   - Get free test ETH

## Step 3: Compile Contracts

```bash
npm run compile
```

Expected output:
```
Compiled 2 Solidity files successfully
```

## Step 4: Run Simulation (Local Test)

```bash
npm run simulate
```

This will:
- Deploy contract locally
- Register test investors
- List sample artworks
- Execute test investments
- Display results

## Step 5: Deploy to Sepolia

```bash
npm run deploy:sepolia
```

Expected output:
```
============================================================
Starting Contract Deployment Process
============================================================

📋 Deployment Configuration
------------------------------------------------------------
Network:         sepolia
Deployer:        0x...
Balance:         1.5 ETH
Chain ID:        11155111

✅ Contract deployed successfully!
📍 Address:      0x...
```

Save the contract address!

## Step 6: Verify on Etherscan

```bash
npm run verify:sepolia
```

This makes your contract source code public and verifiable.

## Step 7: Interact with Contract

```bash
npm run interact:sepolia
```

Interactive menu:
```
1. Get Contract Stats
2. Register as Investor
3. List New Artwork
4. Get Artwork Information
5. Make Private Investment
6. Check Investment Status
7. Check if Registered
8. Get Owner Address
```

## Common Commands

### Development

```bash
# Compile contracts
npm run compile

# Run tests
npm test

# Clean build artifacts
npm run clean

# Start local node
npm run node
```

### Deployment

```bash
# Deploy to local network
npm run deploy:localhost

# Deploy to Sepolia testnet
npm run deploy:sepolia

# Verify contract
npm run verify:sepolia
```

### Interaction

```bash
# Interact with local deployment
npm run interact:localhost

# Interact with Sepolia deployment
npm run interact:sepolia

# Run full simulation
npm run simulate
```

## Workflow Example

### Complete Deployment Flow

```bash
# 1. Install and setup
npm install
cp .env.example .env
# Edit .env with your keys

# 2. Compile
npm run compile

# 3. Test locally
npm run simulate

# 4. Deploy to Sepolia
npm run deploy:sepolia

# 5. Verify on Etherscan
npm run verify:sepolia

# 6. Interact
npm run interact:sepolia
```

### Owner Actions (Platform Manager)

```bash
# Deploy contract
npm run deploy:sepolia

# Use interact script
npm run interact:sepolia

# Select option 3: List New Artwork
# Enter artwork details:
Artwork Name: Starry Night Redux
Artist Name: Vincent Van Gogh Estate
IPFS Hash: QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG
Total Value (ETH): 10
Total Shares: 100

# Confirm and wait for transaction
```

### Investor Actions

```bash
# Use interact script
npm run interact:sepolia

# Step 1: Register (option 2)
# Step 2: View artworks (option 4)
# Step 3: Make investment (option 5)
# Step 4: Check status (option 6)
```

## Troubleshooting

### "Cannot compile contracts"

```bash
npm run clean
npm install
npm run compile
```

### "Insufficient balance"

Get test ETH from:
- https://sepoliafaucet.com/
- https://sepolia-faucet.pk910.de/

### "Invalid private key"

Check `.env` file:
- Remove `0x` prefix from PRIVATE_KEY
- No spaces or quotes around the value
- Correct format: `PRIVATE_KEY=abc123def456...`

### "Network error"

- Check your SEPOLIA_RPC_URL
- Verify internet connection
- Try alternative RPC:
  - Alchemy: https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
  - Infura: https://sepolia.infura.io/v3/YOUR_KEY

### "Verification failed"

- Wait 1-2 minutes after deployment
- Check ETHERSCAN_API_KEY is correct
- Run verify script again
- Try manual verification on Etherscan

## File Locations

### Important Files

```
D:/
├── .env                    # Your configuration (create this)
├── .env.example            # Template
├── hardhat.config.js       # Hardhat configuration
├── package.json            # Scripts and dependencies
├── DEPLOYMENT.md           # Detailed deployment guide
├── QUICKSTART.md           # This file
└── README-DEPLOYMENT.md    # Full documentation
```

### After Deployment

```
D:/
├── deployments/
│   └── sepolia.json       # Sepolia deployment data
├── contract-address.json  # Quick reference
└── artifacts/             # Compiled contracts
```

## Next Steps

1. **Read Full Documentation**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
2. **Explore Contract**: Check [README-DEPLOYMENT.md](./README-DEPLOYMENT.md)
3. **View on Etherscan**: Use the URL from deployment output
4. **Test Features**: Use the interact script
5. **Build Frontend**: Integrate with your UI

## Security Reminders

- ✅ Never commit `.env` file
- ✅ Never share private keys
- ✅ Test on Sepolia before mainnet
- ✅ Verify contracts on Etherscan
- ✅ Use separate wallet for deployment
- ✅ Keep backup of private keys
- ✅ Monitor gas costs

## Support

Need help?

1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guide
2. Review error messages carefully
3. Verify all environment variables
4. Check network connectivity
5. Ensure sufficient balance

## Resources

- **Hardhat Docs**: https://hardhat.org/docs
- **Ethers.js Docs**: https://docs.ethers.org/
- **Sepolia Explorer**: https://sepolia.etherscan.io/
- **Sepolia Faucet**: https://sepoliafaucet.com/

---

**Ready to deploy?** Start with Step 1 above!

**Questions?** Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed troubleshooting.
