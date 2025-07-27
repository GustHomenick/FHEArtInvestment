# Private Art Investment Platform

A decentralized platform for anonymous art investment using Fully Homomorphic Encryption (FHE) for privacy-preserving investments.

## Features

- **Privacy-Preserving**: Investment amounts encrypted using FHE technology
- **Anonymous Investing**: Individual portfolios remain confidential
- **Art Tokenization**: Fractional ownership through blockchain shares
- **Transparent Operations**: Public artwork listings with private investments
- **Secure Returns**: Automated distribution based on encrypted shares

## Technology Stack

- **Smart Contracts**: Solidity 0.8.24
- **Development Framework**: Hardhat
- **Encryption**: Fully Homomorphic Encryption (FHE)
- **Network**: Ethereum Sepolia Testnet
- **Frontend**: Web3.js / Ethers.js

## Project Structure

```
.
├── contracts/               # Smart contract sources
│   ├── PrivateArtInvestment.sol
│   └── LocalFHE.sol
├── scripts/                # Deployment and utility scripts
│   ├── deploy.js          # Main deployment script
│   ├── verify.js          # Etherscan verification
│   ├── interact.js        # Interactive CLI
│   └── simulate.js        # Full simulation
├── deployments/           # Network-specific deployment data
├── test/                  # Contract tests
├── docs/                  # Additional documentation
├── hardhat.config.js      # Hardhat configuration
├── package.json           # Dependencies and scripts
├── .env.example           # Environment template
├── DEPLOYMENT.md          # Detailed deployment guide
└── README.md              # This file
```

## Quick Start

### Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd private-art-investment

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration
```

### Configuration

Edit `.env` file:

```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_wallet_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## Development

### Compile Contracts

```bash
npm run compile
```

### Run Tests

```bash
npm test
```

### Run Local Node

```bash
npm run node
```

### Simulate Complete Workflow

```bash
npm run simulate
```

## Deployment

### Deploy to Sepolia Testnet

```bash
npm run deploy:sepolia
```

### Verify Contract on Etherscan

```bash
npm run verify:sepolia
```

### Interact with Deployed Contract

```bash
npm run interact:sepolia
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run compile` | Compile smart contracts |
| `npm run clean` | Clean artifacts and cache |
| `npm test` | Run contract tests |
| `npm run coverage` | Generate test coverage report |
| `npm run deploy:localhost` | Deploy to local network |
| `npm run deploy:sepolia` | Deploy to Sepolia testnet |
| `npm run verify:sepolia` | Verify contract on Etherscan |
| `npm run interact:localhost` | Interact with local deployment |
| `npm run interact:sepolia` | Interact with Sepolia deployment |
| `npm run simulate` | Run full simulation |
| `npm run node` | Start local Hardhat node |
| `npm run build` | Build project |

## Contract Features

### For Investors

1. **Register as Investor**: Create encrypted investor profile
2. **Private Investment**: Invest with encrypted amounts
3. **Portfolio Privacy**: Only you can decrypt your holdings
4. **Receive Returns**: Automatic distribution of profits

### For Platform Owner

1. **List Artworks**: Publish new art investment opportunities
2. **Manage Shares**: Track public share availability
3. **Distribute Returns**: Process profit distributions
4. **Artwork Sales**: Manage artwork lifecycle

## Smart Contract Functions

### Public Functions

- `registerInvestor()` - Register as investor
- `listArtwork()` - List new artwork (owner only)
- `makePrivateInvestment()` - Make encrypted investment
- `getArtworkInfo()` - Get public artwork details
- `getTotalStats()` - Get platform statistics

### View Functions

- `isInvestorRegistered()` - Check registration status
- `getInvestmentStatus()` - Get investment timestamp
- `getArtworkInvestors()` - Get investor count
- `getEncryptedShares()` - Get encrypted share data

## Privacy Features

### What is Private

- Individual investment amounts
- Number of shares owned
- Total portfolio value
- Portfolio diversification

### What is Public

- Artwork listings and details
- Total shares available
- Number of investors (count only)
- Platform statistics

## Security Considerations

1. **Private Keys**: Never share or commit private keys
2. **Environment Variables**: Use .env for sensitive data
3. **Testing**: Always test on testnet first
4. **Auditing**: Consider third-party audits for production
5. **Gas Limits**: Monitor transaction costs
6. **Access Control**: Only owner can list artworks

## Network Information

### Sepolia Testnet

- **Chain ID**: 11155111
- **RPC URL**: https://sepolia.infura.io/v3/
- **Explorer**: https://sepolia.etherscan.io/
- **Faucet**: https://sepoliafaucet.com/

### Get Test ETH

1. Visit [Sepolia Faucet](https://sepoliafaucet.com/)
2. Enter your wallet address
3. Receive test ETH for deployment

## Deployment Information

After deployment, find details in:

- `./deployments/sepolia.json` - Full deployment data
- `./contract-address.json` - Quick reference

Example deployment:

```json
{
  "network": "sepolia",
  "contractAddress": "0x...",
  "deployer": "0x...",
  "deploymentTime": "2025-10-28T...",
  "verified": true,
  "etherscanUrl": "https://sepolia.etherscan.io/address/0x..."
}
```

## Testing

### Run All Tests

```bash
npm test
```

### Run with Gas Reporter

```bash
REPORT_GAS=true npm test
```

### Check Coverage

```bash
npm run coverage
```

## Troubleshooting

### Common Issues

**Contract won't compile**
- Check Solidity version compatibility
- Clear cache: `npm run clean`
- Reinstall: `rm -rf node_modules && npm install`

**Deployment fails**
- Verify sufficient balance
- Check network connectivity
- Validate RPC URL in .env

**Verification fails**
- Wait 1-2 minutes after deployment
- Check ETHERSCAN_API_KEY
- Verify constructor arguments match

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed troubleshooting.

## Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Complete deployment instructions
- [Contract Documentation](./docs/) - Detailed contract specs
- [Hardhat Docs](https://hardhat.org/docs) - Framework documentation

## Gas Optimization

Contract optimization settings:

- Optimizer: Enabled (200 runs)
- Via IR: Enabled
- EVM Version: Cancun

Estimated gas costs (Sepolia):

- Deploy: ~3,000,000 gas
- Register Investor: ~150,000 gas
- List Artwork: ~200,000 gas
- Make Investment: ~250,000 gas

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:

- Check documentation in `./docs/`
- Review [DEPLOYMENT.md](./DEPLOYMENT.md)
- Check existing issues
- Create new issue with details

## Acknowledgments

- Zama for FHE technology
- OpenZeppelin for security patterns
- Hardhat team for development tools
- Ethereum community

---

**Version**: 1.0.0
**Last Updated**: October 2025
**Status**: Production Ready
