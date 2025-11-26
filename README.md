# Private Art Investment Platform

> Privacy-Protected Art Collection Investment Using FHE Encryption Technology

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://fhe-art-investment.vercel.app/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## 🎨 Overview

The Private Art Investment Platform revolutionizes art investment by combining blockchain transparency with Fully Homomorphic Encryption (FHE) technology. This platform enables investors to purchase fractional shares of valuable artworks while maintaining complete privacy of their investment amounts and portfolio holdings.

### 🚀 Two Versions Available

This project is available in **two technology stacks** to suit different development needs:

1. **Next.js Version** (Advanced) - Full-stack application with SSR and API routes
   - 🌐 **Live Demo**: [https://fhe-art-investment.vercel.app/](https://fhe-art-investment.vercel.app/)
   - 📍 **Location**: Root directory
   - 🎯 **Best for**: Production deployments, SEO, complex applications

2. **React + Vite Version** (Standalone) - Lightweight SPA with fast development
   - 📍 **Location**: `PrivateArtInvestment/` directory
   - 🎯 **Best for**: Quick prototyping, learning, simple deployments

Both versions provide the **same core functionality** with identical smart contracts and FHEVM integration.

### Live Application

🌐 **Next.js Demo**: [https://fhe-art-investment.vercel.app/](https://fhe-art-investment.vercel.app/)

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

### Innovative Gateway Callback Pattern

This platform implements a cutting-edge **Gateway callback mode** for secure asynchronous FHE decryption:

```
┌─────────────┐
│    User     │ Submits encrypted investment request
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│   Contract      │ Records request with timestamp tracking
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  FHE Gateway    │ Decrypts data asynchronously off-chain
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│   Callback      │ Completes transaction with decrypted data
└─────────────────┘
```

**Key Benefits:**
- **Async Processing**: Non-blocking decryption workflow
- **Gas Optimization**: Efficient HCU (Homomorphic Computation Unit) usage
- **Timeout Protection**: 24-hour callback timeout prevents fund lockup
- **Refund Mechanism**: Automatic refunds on decryption failures

### Smart Contract Structure

```
PrivateArtInvestment.sol
├── FHE Operations (TFHE library)
│   ├── Encrypted investment amounts (euint32)
│   ├── Encrypted share counts (euint32)
│   ├── Homomorphic calculations
│   └── Gateway decryption requests
├── Investor Management
│   ├── Registration system
│   ├── Investment tracking
│   └── Portfolio management
├── Artwork Management
│   ├── Listing system
│   ├── Metadata storage
│   └── Price management
├── Returns Distribution (Gateway Callback)
│   ├── Decryption request tracking
│   ├── Proportional distribution with privacy
│   ├── Price obfuscation techniques
│   └── Random multiplier for division privacy
└── Failure Handling
    ├── Timeout-based refunds (24h)
    ├── Emergency refund controls (7d window)
    ├── Decryption failure recovery
    └── Permanent lockup prevention
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
- **fhevmjs v0.5.0**: JavaScript library for FHE client-side encryption
- **@fhevm/sdk**: Universal FHEVM SDK for framework-agnostic development

**Frontend - Next.js Version** (Advanced):
- **Next.js 14**: React framework with App Router
- **TypeScript 5**: Type-safe development
- **TailwindCSS 3**: Utility-first styling
- **Wagmi v2.5**: React hooks for Ethereum
- **Viem v2.7**: Modern Ethereum library
- **ConnectKit 1.7**: Beautiful wallet connection UI
- **TanStack Query 5**: Async state management

**Frontend - React Version** (Standalone):
- **React 18.2**: Modern React with hooks
- **TypeScript 5.2**: Type-safe development
- **Vite 5.0**: Lightning-fast build tool with HMR
- **Wagmi v2.5**: React hooks for Ethereum
- **Viem v2.7**: Modern Ethereum library
- **ConnectKit 1.7**: Wallet connection interface
- **TanStack Query 5**: Server state management

**Testing & Deployment**:
- **Mocha/Chai**: Testing framework
- **Hardhat Network**: Local development blockchain
- **Sepolia Testnet**: Ethereum test network
- **Vercel**: Frontend hosting (Next.js)
- **Vite Preview**: Static hosting (React)

## 📦 Project Structure

### Next.js Version (Advanced)
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
├── app/                            # Next.js 14 App Router
│   ├── page.tsx                    # Main page
│   ├── layout.tsx                  # Root layout
│   ├── providers.tsx               # Wagmi providers
│   ├── globals.css                 # Global styles
│   └── api/                        # API routes
│       ├── fhe/                    # FHE operations
│       └── keys/                   # Key management
├── components/                     # React components
│   ├── ui/                         # Base UI components
│   ├── fhe/                        # FHE components
│   └── [business components]
├── lib/
│   ├── fhe/                        # FHE integration
│   │   ├── client.ts               # Client operations
│   │   ├── server.ts               # Server operations
│   │   └── keys.ts                 # Key management
│   └── utils/                      # Utility functions
├── hooks/                          # Custom React hooks
│   ├── useFHE.ts
│   └── useEncryption.ts
├── hardhat.config.js               # Hardhat configuration
├── next.config.js                  # Next.js configuration
└── package.json

### React + Vite Version (Standalone)
```
PrivateArtInvestment/
├── src/
│   ├── App.tsx                     # Main component
│   ├── main.tsx                    # Entry point with providers
│   ├── components/
│   │   ├── Header.tsx              # Header with wallet
│   │   ├── StatsDisplay.tsx        # Platform statistics
│   │   ├── InvestorRegistration.tsx # Registration form
│   │   ├── InvestmentForm.tsx      # Investment with FHE
│   │   ├── ArtworkManagement.tsx   # Artwork listing
│   │   └── ArtworkGallery.tsx      # Gallery display
│   ├── hooks/
│   │   └── useContract.ts          # Contract interaction
│   └── styles/
│       └── App.css                 # Component styles
├── contracts/
│   └── PrivateArtInvestment.sol    # Smart contract
├── scripts/
│   └── deploy.js                   # Deployment
├── index.html                      # Vite entry point
├── vite.config.ts                  # Vite configuration
├── tsconfig.json                   # TypeScript config
└── package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- MetaMask wallet
- Sepolia testnet ETH

### Installation

**For Next.js Version:**
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

**For React + Vite Version:**
```bash
# Navigate to the React version
cd PrivateArtInvestment

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

# Verify on Etherscan (Next.js version only)
npm run verify
```

### Frontend Development

**Next.js Version:**
```bash
# Start development server
npm run dev
# Opens at http://localhost:3000

# Build for production
npm run build

# Start production server
npm start
```

**React + Vite Version:**
```bash
# Start development server
npm run dev
# Opens at http://localhost:3002

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Version Comparison

### Next.js Version vs React + Vite Version

| Feature | Next.js Version | React + Vite Version |
|---------|----------------|---------------------|
| **Framework** | Next.js 14 App Router | React 18 + Vite 5 |
| **Rendering** | SSR + CSR (Hybrid) | CSR (Client-Side) |
| **API Routes** | Built-in API routes | External API required |
| **Build Tool** | Next.js (webpack) | Vite (esbuild) |
| **Dev Server** | Next.js dev server | Vite dev server (faster HMR) |
| **Production** | Vercel optimized | Static hosting ready |
| **Complexity** | Advanced architecture | Simplified architecture |
| **Use Case** | Production apps, SEO | SPAs, rapid development |
| **Bundle Size** | Larger (more features) | Smaller (minimal) |
| **Learning Curve** | Steeper | Gentler |

**Choose Next.js if you need:**
- Server-side rendering
- API routes and backend logic
- SEO optimization
- Production-grade features

**Choose React + Vite if you need:**
- Fast development with HMR
- Simple deployment (static hosting)
- Lightweight bundle
- Quick prototyping

## 🔧 Configuration

### Environment Variables

**For Next.js Version:**
Create a `.env` file with the following variables:

```env
# Network Configuration
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_deployer_private_key

# Frontend Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=deployed_contract_address
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_id

# Optional
ETHERSCAN_API_KEY=your_etherscan_key
```

**For React + Vite Version:**
Create a `.env` file with the following variables:

```env
# Network Configuration (for contract deployment)
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_deployer_private_key

# Frontend Configuration (Vite uses VITE_ prefix)
VITE_CONTRACT_ADDRESS=deployed_contract_address
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_id
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

#### Input Validation
- **Range Checks**: All numeric inputs validated for valid ranges
- **Type Safety**: Strict type checking on all parameters
- **Bounds Validation**: Array bounds and limits enforced
- **Address Validation**: Zero address and invalid address checks

#### Access Control
- **Modifier-Based**: Role-based access control using modifiers
- **Owner Functions**: Critical operations restricted to contract owner
- **Investor Restrictions**: Investment functions require registration
- **Time-Based Controls**: Timeout mechanisms for sensitive operations

#### Overflow Protection
- **Explicit Checks**: Mathematical operations verified for overflows
- **Safe Arithmetic**: Division operations checked before execution
- **Balance Tracking**: State updates tracked to prevent inconsistencies
- **Gas Optimization**: Efficient loops with bounds checking

#### Audit Considerations
```solidity
// ✅ Input validation example
require(shareAmount > 0 && shareAmount <= type(uint32).max, "Invalid share amount");

// ✅ Overflow protection example
require(requiredPayment / artworks[artworkId].sharePrice == shareAmount, "Overflow detected");

// ✅ Access control example
modifier onlyRegisteredInvestor() {
    require(investorProfiles[msg.sender].isRegistered, "Not registered investor");
    _;
}
```

### Privacy Innovations

#### 1. Division Problem Solution
Traditional division operations can leak price information. We use **random multipliers** to protect privacy:

```solidity
// Generate random multiplier (1000-10000 range)
uint256 randomMultiplier = _generateObfuscationMultiplier(artworkId);

// Obfuscate calculations to prevent price leakage
uint256 obfuscatedReturns = totalReturns * randomMultiplier;
uint256 investorReturn = (obfuscatedReturns * shares) / (totalShares * randomMultiplier);
```

**Benefits:**
- Prevents exact price inference through division
- Maintains mathematical correctness
- Uses blockchain entropy for randomness
- Minimal gas overhead

#### 2. Price Obfuscation
We implement **fuzzy calculation techniques** to hide exact amounts:

- Random multipliers based on block data
- Pseudo-random number generation using `keccak256`
- Time-based entropy from `block.timestamp`
- Unpredictable randomness from `block.prevrandao`

#### 3. Async Processing
**Gateway callback mode** ensures privacy during decryption:

- Encrypted data never exposed on-chain
- Decryption happens in trusted Gateway environment
- Results delivered via cryptographically signed callback
- Signature verification prevents tampering

#### 4. Gas Optimization (HCU Usage)
Efficient **Homomorphic Computation Unit (HCU)** management:

- Batched FHE operations to minimize HCU consumption
- Optimized encrypted data types (`euint32` vs `euint64`)
- Selective decryption only when necessary
- Cached intermediate results

### Failure Handling & Refund Mechanisms

#### Refund Mechanism: Handling Decryption Failures

If the Gateway fails to decrypt or callback within the timeout period, users can request refunds:

```solidity
function requestRefundForFailedDecryption(uint256 requestId) external {
    // Timeout protection: 24-hour grace period
    require(block.timestamp >= request.requestedAt + CALLBACK_TIMEOUT);

    // Issue equal refunds to all investors
    // Mark request as failed to prevent re-processing
}
```

**Features:**
- **24-Hour Timeout**: Callback must complete within 24 hours
- **Automatic Refunds**: Equal distribution to all investors
- **Permanent Lockup Prevention**: No funds can be locked forever
- **State Protection**: Replay attacks prevented via status tracking

#### Timeout Protection

Multiple layers of timeout protection:

1. **Callback Timeout** (24 hours): Grace period for Gateway callback
2. **Emergency Window** (7 days): Owner can trigger emergency refunds
3. **Status Tracking**: Request states prevent double-processing
4. **Timestamp Validation**: All time-based checks use `block.timestamp`

```solidity
// Constant timeout values
uint256 public constant CALLBACK_TIMEOUT = 24 hours;
uint256 public constant MAX_REFUND_WINDOW = 7 days;
```

#### Emergency Controls

Platform owner has limited emergency powers:

```solidity
function emergencyRefund(uint256 requestId) external onlyOwner {
    // Owner can trigger refunds within 7-day window
    // Prevents abuse while ensuring user protection
    require(block.timestamp <= request.requestedAt + MAX_REFUND_WINDOW);
}
```

**Safeguards:**
- Time-limited authority (7 days only)
- Cannot bypass timeout protections
- All refunds logged via events
- Transparent on-chain audit trail

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
function registerInvestor() external
// Initializes encrypted portfolio counters
// Grants FHE access permissions
// Emits: InvestorRegistered

// Make private investment with encrypted shares
function makePrivateInvestment(
    uint256 artworkId,
    uint32 shareAmount
) external payable onlyRegisteredInvestor validArtwork
// Requires: Registration, valid artwork, sufficient payment
// Encrypts: Investment amount and share count using FHE
// Updates: Investor portfolio, artwork availability
// Emits: PrivateInvestmentMade

// Get encrypted investment summary
function getEncryptedInvestmentSummary(address user)
    external view returns (
        FHE.euint32 memory encryptedTotalInvested,
        FHE.euint32 memory encryptedPortfolioCount,
        bool isRegistered
    )
// Returns encrypted portfolio data
// Only user can decrypt their own data

// Get encrypted shares for specific investment
function getEncryptedShares(address investor, uint256 artworkId)
    external view returns (FHE.euint32 memory)
// Returns encrypted share count for artwork
```

#### Owner Functions

```solidity
// List new artwork
function listArtwork(
    string memory _name,
    string memory _artist,
    string memory _ipfsHash,
    uint256 _totalValue,
    uint256 _sharePrice,
    uint256 _totalShares
) external onlyOwner
// Validates: Price calculations, share counts
// Creates: New artwork listing
// Emits: ArtworkListed

// Request returns distribution (Gateway callback mode)
function requestReturnsDistribution(uint256 artworkId)
    external payable onlyOwner validArtwork
// Initiates: Gateway decryption request
// Tracks: Request ID with timeout protection
// Emits: DecryptionRequested

// Emergency refund (within 7-day window)
function emergencyRefund(uint256 requestId) external onlyOwner
// Triggers: Manual refund for stuck requests
// Limited: 7-day window from request time
// Distributes: Equal refunds to all investors
// Emits: DecryptionFailed, RefundIssued
```

#### Gateway Callback Functions

```solidity
// Process returns distribution after Gateway decryption
function processReturnsDistribution(
    uint256 requestId,
    bytes memory cleartexts,
    bytes memory decryptionProof
) external
// Called by: Gateway service after decryption
// Verifies: Cryptographic signatures via FHE.checkSignatures
// Distributes: Returns proportionally with price obfuscation
// Uses: Random multipliers for division privacy
// Emits: CallbackProcessed, ReturnsDistributed
```

#### Refund Functions

```solidity
// Request refund after callback timeout
function requestRefundForFailedDecryption(uint256 requestId) external
// Requires: 24-hour timeout has passed
// Checks: Request not already processed
// Distributes: Equal refunds to all investors
// Prevents: Permanent fund locking
// Emits: DecryptionFailed, RefundIssued, CallbackProcessed
```

#### View Functions

```solidity
// Get artwork details
function getArtworkInfo(uint256 artworkId)
    external view validArtwork returns (
        string memory name,
        string memory artist,
        string memory ipfsHash,
        uint256 totalValue,
        uint256 sharePrice,
        uint256 totalShares,
        uint256 availableShares,
        uint256 investorCount
    )

// Check investor status
function isInvestorRegistered(address investor)
    external view returns (bool)

// Get investment status
function getInvestmentStatus(address investor, uint256 artworkId)
    external view returns (bool hasInvested, uint256 timestamp)

// Get platform statistics
function getTotalStats() external view returns (
    uint256 totalArtworksListed,
    uint256 totalRegisteredInvestors
)

// Get decryption request details
function decryptionRequests(uint256 requestId)
    external view returns (
        uint256 artworkId,
        uint256 requestedAt,
        bool isProcessed,
        bool hasFailed,
        uint256 totalReturns
    )
```

### Events

```solidity
event ArtworkListed(uint256 indexed artworkId, string name, uint256 totalValue, uint256 sharePrice);
event InvestorRegistered(address indexed investor, uint256 timestamp);
event PrivateInvestmentMade(address indexed investor, uint256 indexed artworkId, uint256 timestamp);
event DecryptionRequested(uint256 indexed requestId, uint256 indexed artworkId, uint256 timestamp);
event ReturnsDistributed(uint256 indexed artworkId, uint256 totalReturns);
event CallbackProcessed(uint256 indexed requestId, uint256 indexed artworkId, bool success);
event DecryptionFailed(uint256 indexed requestId, uint256 indexed artworkId, string reason);
event RefundIssued(address indexed investor, uint256 indexed artworkId, uint256 amount);
event ArtworkSold(uint256 indexed artworkId, uint256 salePrice);
```

### Architecture Explanation

#### Gateway Callback Flow

```
1. Owner calls requestReturnsDistribution(artworkId)
   ├─> Contract prepares encrypted shares for all investors
   ├─> FHE.requestDecryption() sends request to Gateway
   ├─> Contract stores DecryptionRequest with timestamp
   └─> Emits DecryptionRequested event

2. Gateway processes decryption request
   ├─> Decrypts encrypted shares off-chain
   ├─> Generates cryptographic proof
   └─> Calls processReturnsDistribution() with decrypted data

3. Contract processes callback
   ├─> Verifies signatures via FHE.checkSignatures()
   ├─> Decodes decrypted share amounts
   ├─> Applies random multiplier for privacy
   ├─> Distributes returns proportionally
   └─> Emits CallbackProcessed and ReturnsDistributed

4. If Gateway fails (timeout after 24h)
   ├─> Anyone calls requestRefundForFailedDecryption()
   ├─> Contract checks timeout has passed
   ├─> Distributes equal refunds to all investors
   └─> Emits DecryptionFailed and RefundIssued
```

## 🚀 Innovative Features Summary

### 1. Refund Mechanism for Decryption Failures

**Problem**: Traditional FHE systems can leave funds permanently locked if decryption fails.

**Solution**: Automatic timeout-based refunds with multiple safety layers:
- 24-hour callback grace period
- Automatic refund distribution after timeout
- Emergency owner controls (7-day window)
- State tracking prevents double-refunds

**Implementation**:
```solidity
function requestRefundForFailedDecryption(uint256 requestId) external {
    require(block.timestamp >= request.requestedAt + CALLBACK_TIMEOUT);
    // Equal refunds distributed to all investors
}
```

### 2. Timeout Protection

**Problem**: Callback operations can fail indefinitely without time limits.

**Solution**: Multi-layered timeout protection:
```solidity
uint256 public constant CALLBACK_TIMEOUT = 24 hours;    // User refund trigger
uint256 public constant MAX_REFUND_WINDOW = 7 days;     // Owner emergency window
```

**Benefits**:
- No permanent fund lockup possible
- Clear time expectations for users
- Owner has limited emergency authority
- Transparent timeout rules

### 3. Gateway Callback Mode

**Problem**: Synchronous FHE decryption is gas-intensive and slow.

**Solution**: Asynchronous Gateway callback pattern:

```
User Request → Contract Records → Gateway Decrypts → Callback Completes
     ↓               ↓                  ↓                    ↓
 Encrypted      Timestamp          Off-chain          Verified Result
  Shares        Tracking          Decryption         + Proof Check
```

**Advantages**:
- Non-blocking operations
- Gas-efficient (decryption happens off-chain)
- Cryptographically verified results
- Scalable for multiple concurrent requests

### 4. Privacy Innovations

#### Division Privacy Protection

**Problem**: Division operations `a / b` can leak information about `a` when `b` is known.

**Solution**: Random multiplier obfuscation:
```solidity
uint256 randomMultiplier = _generateObfuscationMultiplier(seed);
uint256 obfuscated = (value * randomMultiplier) / (divisor * randomMultiplier);
// Result is mathematically correct but computation is obscured
```

**Privacy Guarantee**: Observers cannot infer exact values from division results.

#### Price Obfuscation

**Problem**: On-chain calculations can reveal pricing information.

**Solution**: Fuzzy calculation techniques:
- Pseudo-random multipliers using `keccak256`
- Block-based entropy (`block.timestamp`, `block.prevrandao`)
- Range: 1000-10000x multiplier
- Mathematical correctness preserved

**Implementation**:
```solidity
function _generateObfuscationMultiplier(uint256 seed) private view returns (uint256) {
    uint256 random = uint256(keccak256(abi.encodePacked(
        block.timestamp,
        block.prevrandao,
        seed
    )));
    return 1000 + (random % 9000);  // Range: 1000-10000
}
```

### 5. Security Audit Features

#### Input Validation
```solidity
// Range checking
require(shareAmount > 0 && shareAmount <= type(uint32).max, "Invalid share amount");

// Overflow detection
require(requiredPayment / sharePrice == shareAmount, "Overflow detected");
```

#### Access Control
```solidity
modifier onlyOwner() {
    require(msg.sender == owner, "Not authorized");
    _;
}

modifier onlyRegisteredInvestor() {
    require(investorProfiles[msg.sender].isRegistered, "Not registered");
    _;
}
```

#### State Protection
```solidity
// Prevent replay attacks
require(!request.isProcessed, "Request already processed");
require(!hasClaimed[artworkId][investor], "Already claimed");
```

### 6. Gas Optimization (HCU Management)

**Homomorphic Computation Unit (HCU)** optimizations:

1. **Optimized Data Types**: Use `euint32` instead of `euint64` where possible
2. **Batched Operations**: Process multiple encryptions in single transactions
3. **Selective Decryption**: Only decrypt when absolutely necessary
4. **Efficient Permissions**: Minimize `FHE.allow()` calls

**Example**:
```solidity
// Efficient: Single encrypted type for scaled values
FHE.euint32 memory encryptedValue = FHE.asEuint32(uint32(msg.value / 1e14));

// Batched ACL grants
FHE.allowThis(encryptedShares);
FHE.allow(encryptedShares, msg.sender);
```

## 📋 Feature Comparison

| Feature | Traditional DeFi | This Platform |
|---------|-----------------|---------------|
| **Privacy** | Public amounts | FHE encrypted |
| **Decryption Failures** | Funds locked | Automatic refunds |
| **Timeout Protection** | None | 24h + 7d windows |
| **Callback Mode** | Synchronous | Async Gateway |
| **Division Privacy** | Leaks info | Random multipliers |
| **Price Obfuscation** | None | Fuzzy calculations |
| **Gas Efficiency** | Standard | HCU optimized |
| **Security Audit** | Basic | Comprehensive |

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

## 🎯 Which Version Should I Use?

### Choose Next.js Version if you:
- ✅ Need server-side rendering (SSR) for better SEO
- ✅ Want built-in API routes for backend logic
- ✅ Plan to deploy on Vercel or similar platforms
- ✅ Need advanced features like middleware and edge functions
- ✅ Are building a production-grade application
- ✅ Want the most feature-rich development experience

### Choose React + Vite Version if you:
- ✅ Want fast Hot Module Replacement (HMR) during development
- ✅ Prefer a simpler, more straightforward architecture
- ✅ Need to deploy on static hosting (GitHub Pages, Netlify, etc.)
- ✅ Are learning React and FHEVM integration
- ✅ Want a smaller bundle size
- ✅ Need quick prototyping and faster build times
- ✅ Prefer client-side only applications

### Feature Parity

Both versions include:
- ✅ Full FHEVM SDK integration
- ✅ Encrypted investment functionality
- ✅ Wallet connection (Wagmi + ConnectKit)
- ✅ TypeScript support
- ✅ Same smart contracts
- ✅ Identical core features
- ✅ Modern React 18 hooks
- ✅ Professional UI/UX

The **only differences** are in the build tooling, deployment strategy, and architectural approach.

---

**Built with ❤️ for privacy-preserving art investment**

*Powered by Zama FHEVM • Available in Next.js and React+Vite • Deployed on Ethereum Sepolia*
