# Private Art Investment Platform

> Privacy-Protected Art Collection Investment Using FHE Encryption Technology

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://fhe-art-investment.vercel.app/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## 🎨 Overview

The Private Art Investment Platform revolutionizes art investment by combining blockchain transparency with Fully Homomorphic Encryption (FHE) technology. This platform enables investors to purchase fractional shares of valuable artworks while maintaining complete privacy of their investment amounts and portfolio holdings.

### Live Application

🌐 **Website**: [https://fhe-art-investment.vercel.app/](https://fhe-art-investment.vercel.app/)

🔗 **GitHub Repository**: [https://github.com/GustHomenick/FHEArtInvestment](https://github.com/GustHomenick/FHEArtInvestment)

🎥 **Demo Video**: Download and watch `demo.mp4` from the repository (video cannot be viewed directly via link)

## 🔐 Core Concepts

### Fully Homomorphic Encryption (FHE)

Our platform leverages FHE technology to ensure investor privacy while maintaining blockchain transparency:

- **Encrypted Investment Amounts**: All investment values are encrypted on-chain using FHE, making them invisible to external observers
- **Private Share Holdings**: The number of shares owned by each investor is encrypted and cannot be viewed by others
- **Homomorphic Computations**: Mathematical operations can be performed on encrypted data without decryption, enabling:
  - Portfolio value calculations
  - Returns distribution based on encrypted share amounts
  - Investment statistics aggregation

### FHE Smart Contracts

The platform uses FHEVM (Fully Homomorphic Encryption Virtual Machine) to enable confidential smart contracts:

```solidity
// Investment amounts are encrypted on-chain
mapping(uint256 => mapping(address => euint64)) private investments;

// Only the investor can decrypt their own amounts
function getMyInvestment(uint256 artworkId)
    public view returns (bytes memory) {
    return TFHE.reencrypt(investments[artworkId][msg.sender], msg.sender);
}
```

**Key Features of FHE Contracts**:
- **Confidential State**: Contract state variables can be encrypted (`euint64`, `euint32`, etc.)
- **Encrypted Operations**: Perform calculations on encrypted data (addition, multiplication, comparison)
- **Selective Decryption**: Only authorized users can decrypt specific values
- **On-Chain Privacy**: Privacy guarantees are enforced at the blockchain level, not just application layer

### Anonymous Art Investment - Privacy Art Collection

Traditional art investment platforms expose investor information publicly. Our FHE-powered solution addresses this privacy concern:

#### Why Privacy Matters in Art Investment

1. **Investment Strategy Protection**: High-value investors don't want to reveal their portfolio composition
2. **Market Manipulation Prevention**: Hidden investment amounts prevent front-running and price manipulation
3. **Personal Security**: Wealthy collectors maintain anonymity for safety reasons
4. **Competitive Advantage**: Institutional investors keep their art investment strategies confidential

#### How We Achieve Privacy

1. **Investment Privacy**: Your investment amount remains confidential - only you can decrypt and view your holdings using EIP-712 signatures
2. **Portfolio Confidentiality**: Total portfolio value is computed homomorphically, keeping individual investments private
3. **Transparent Verification**: Despite encryption, all transactions are verifiable on-chain, ensuring authenticity
4. **Fair Returns Distribution**: Returns are distributed proportionally based on encrypted share amounts using FHE computation

#### Privacy Architecture

```
Investor → Encrypt Investment → Smart Contract (FHE) → Blockchain
                                        ↓
                              Homomorphic Operations
                                        ↓
                              Encrypted Results ← Decrypt (with signature) ← Investor
```

## 🎭 Key Features

### For Investors

- **Private Registration**: Register as an investor with encrypted profile initialization
- **Confidential Investments**: Invest in artworks with fully encrypted transaction amounts
- **Portfolio Privacy**: View your own portfolio while keeping it hidden from others
- **Secure Returns**: Receive proportional returns based on your encrypted shareholdings
- **EIP-712 Decryption**: Authorize decryption of your data using cryptographic signatures

### For Platform

- **Artwork Listing**: List valuable artworks with pricing and metadata
- **Transparent Operations**: All operations are verifiable on-chain
- **Automated Returns**: Distribute returns automatically based on encrypted shareholdings
- **FHE Security**: Leverage cryptographic guarantees for data privacy

### For Smart Contracts

- **FHEVM Integration**: Built on Zama's FHEVM for native encrypted computations
- **Encrypted State Variables**: Use `euint64`, `euint32`, `ebool` for confidential data
- **Access Control**: Fine-grained permission system for decryption
- **Gas Optimized**: Efficient FHE operations for cost-effective transactions

## 🏗️ Technical Architecture

### Smart Contract Structure

```
PrivateArtInvestment.sol
├── FHE Operations (TFHE library)
│   ├── Encrypted investment amounts (euint64)
│   ├── Encrypted share counts (euint64)
│   └── Homomorphic calculations
├── Investor Management
│   ├── Registration system
│   ├── Investment tracking
│   └── Portfolio management
├── Artwork Management
│   ├── Listing system
│   ├── Metadata storage
│   └── Price management
└── Returns Distribution
    ├── Automated calculations
    ├── Proportional distribution
    └── Encrypted amount handling
```

### FHE Data Types

| Type | Description | Use Case |
|------|-------------|----------|
| `euint8` | 8-bit encrypted integer | Small counters, flags |
| `euint16` | 16-bit encrypted integer | Medium values |
| `euint32` | 32-bit encrypted integer | Large values |
| `euint64` | 64-bit encrypted integer | Investment amounts, balances |
| `ebool` | Encrypted boolean | Access flags, status |
| `eaddress` | Encrypted address | Private recipient addresses |

### Technology Stack

**Blockchain Layer**:
- **FHEVM**: Zama's Fully Homomorphic Encryption Virtual Machine
- **Solidity**: Smart contract language with FHE extensions
- **TFHE Library**: Torus Fully Homomorphic Encryption operations

**Development Tools**:
- **Hardhat**: Smart contract development framework
- **Ethers.js v6**: Blockchain interaction library
- **fhevmjs**: JavaScript library for FHE client-side encryption

**Frontend**:
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first styling
- **Wagmi v2**: React hooks for Ethereum
- **Viem**: Modern Ethereum library

**Testing & Deployment**:
- **Mocha/Chai**: Testing framework
- **Hardhat Network**: Local development blockchain
- **Sepolia Testnet**: Ethereum test network
- **Vercel**: Frontend hosting

## 📦 Project Structure

```
private-art-investment/
├── contracts/
│   ├── PrivateArtInvestment.sol    # Main FHE contract
│   └── interfaces/
├── scripts/
│   ├── deploy.js                   # Deployment script
│   ├── verify.js                   # Contract verification
│   ├── interact.js                 # Contract interaction
│   └── simulate.js                 # Simulation script
├── test/
│   └── PrivateArtInvestment.test.js
├── app/                            # Next.js application
│   ├── page.tsx                    # Main page
│   ├── layout.tsx                  # Root layout
│   └── components/                 # React components
├── lib/
│   ├── fhevm.ts                    # FHEVM client setup
│   └── contract.ts                 # Contract utilities
├── hardhat.config.js               # Hardhat configuration
└── package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- MetaMask wallet
- Sepolia testnet ETH

### Installation

```bash
# Clone repository
git clone https://github.com/GustHomenick/FHEArtInvestment.git
cd FHEArtInvestment

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your configuration
```

### Smart Contract Development

```bash
# Compile contracts
npm run compile

# Run tests
npm test

# Deploy to Sepolia
npm run deploy

# Verify on Etherscan
npm run verify
```

### Frontend Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Network Configuration
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_deployer_private_key

# Frontend Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=deployed_contract_address
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY

# Optional
ETHERSCAN_API_KEY=your_etherscan_key
```

## 📖 Usage Examples

### For Investors

#### 1. Register as Investor

```javascript
import { ethers } from 'ethers';
import { createFhevmInstance } from 'fhevmjs';

// Initialize FHEVM
const instance = await createFhevmInstance({
  chainId: 11155111,
  publicKey: await contract.getPublicKey(),
});

// Register
const tx = await contract.registerInvestor("Investor Name");
await tx.wait();
```

#### 2. Make Private Investment

```javascript
// Encrypt investment amount (e.g., 0.1 ETH)
const encryptedAmount = instance.encrypt64(ethers.parseEther("0.1"));

// Invest in artwork
const tx = await contract.invest(
  artworkId,
  encryptedAmount,
  {
    value: ethers.parseEther("0.1")
  }
);
await tx.wait();
```

#### 3. View Private Portfolio

```javascript
// Get encrypted investment
const encryptedData = await contract.getMyInvestment(artworkId);

// Decrypt using EIP-712 signature
const signature = await signer.signTypedData(domain, types, message);
const decryptedAmount = await decrypt(encryptedData, signature);

console.log(`My investment: ${ethers.formatEther(decryptedAmount)} ETH`);
```

### For Platform Owner

#### List Artwork

```javascript
const tx = await contract.listArtwork(
  artworkId,
  "Starry Night",
  "Vincent van Gogh",
  ethers.parseEther("100") // Artwork value
);
await tx.wait();
```

#### Distribute Returns

```javascript
const tx = await contract.distributeReturns(
  artworkId,
  { value: ethers.parseEther("10") } // Total returns to distribute
);
await tx.wait();
```

## 🔒 Security Features

### FHE Security Guarantees

- **Cryptographic Privacy**: Investment amounts are encrypted using lattice-based cryptography
- **On-Chain Confidentiality**: Encrypted data stored directly on blockchain
- **Zero-Knowledge Proofs**: Verify computations without revealing inputs
- **No Trusted Third Party**: Privacy is guaranteed by mathematics, not trust

### Access Control

- **Role-Based Permissions**: Owner, investor, and public access levels
- **Encrypted ACL**: Access control lists stored in encrypted form
- **EIP-712 Signatures**: Secure authorization for decryption requests
- **Time-Locked Operations**: Prevent unauthorized early access

### Smart Contract Security

- **Audited FHE Operations**: Using Zama's audited TFHE library
- **Reentrancy Protection**: OpenZeppelin's ReentrancyGuard
- **Input Validation**: Comprehensive parameter checking
- **Emergency Pause**: Circuit breaker for emergency situations

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run coverage

# Run specific test file
npx hardhat test test/PrivateArtInvestment.test.js
```

### Test Coverage

- ✅ Investor registration and management
- ✅ Artwork listing and updates
- ✅ Private investment operations
- ✅ FHE encryption and decryption
- ✅ Returns distribution calculations
- ✅ Access control and permissions
- ✅ Edge cases and error handling

## 📊 Smart Contract API

### Main Functions

#### Investor Functions

```solidity
// Register as investor
function registerInvestor(string memory name) external

// Invest in artwork (encrypted amount)
function invest(
    uint256 artworkId,
    bytes calldata encryptedAmount
) external payable

// Get own investment (encrypted)
function getMyInvestment(uint256 artworkId)
    external view returns (bytes memory)

// Get total portfolio value (encrypted)
function getTotalPortfolioValue()
    external view returns (bytes memory)
```

#### Owner Functions

```solidity
// List new artwork
function listArtwork(
    uint256 artworkId,
    string memory title,
    string memory artist,
    uint256 value
) external onlyOwner

// Distribute returns
function distributeReturns(uint256 artworkId)
    external payable onlyOwner
```

#### View Functions

```solidity
// Get artwork details
function getArtwork(uint256 artworkId)
    external view returns (Artwork memory)

// Check if address is investor
function isInvestor(address account)
    external view returns (bool)

// Get investor details
function getInvestor(address account)
    external view returns (Investor memory)
```

## 🎓 Learn More

### FHE Resources

- [Zama Documentation](https://docs.zama.ai/)
- [FHEVM Whitepaper](https://github.com/zama-ai/fhevm/blob/main/fhevm-whitepaper.pdf)
- [TFHE-rs Library](https://github.com/zama-ai/tfhe-rs)

### Project Resources

- [GitHub Repository](https://github.com/GustHomenick/FHEArtInvestment)
- [Live Application](https://fhe-art-investment.vercel.app/)
- [Technical Documentation](./docs/TECHNICAL.md)

### Video Tutorial

📹 **Demo Video**: Download `demo.mp4` from the GitHub repository to watch the complete platform demonstration. The video covers:
- Platform overview and features
- Investor registration process
- Making private investments
- Viewing encrypted portfolio
- Returns distribution
- Technical architecture

*Note: The demo video must be downloaded to watch - direct links will not work.*

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Zama** - For developing FHEVM and TFHE technology
- **OpenZeppelin** - For secure smart contract libraries
- **Hardhat** - For excellent development tools
- **Ethereum Foundation** - For the blockchain infrastructure

## 📞 Contact & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/GustHomenick/FHEArtInvestment/issues)
- **Discussions**: [Join community discussions](https://github.com/GustHomenick/FHEArtInvestment/discussions)

---

**Built with ❤️ for privacy-preserving art investment**

*Powered by Zama FHEVM • Deployed on Ethereum Sepolia • Hosted on Vercel*
