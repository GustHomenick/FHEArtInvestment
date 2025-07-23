# Private Art Investment Platform

> Privacy-Protected Art Collection Investment Using FHE Encryption Technology

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://private-art-investment.vercel.app/)
[![Contract](https://img.shields.io/badge/contract-verified-blue)](https://sepolia.etherscan.io/address/0xa0eE56B7697846877d0E90FA654377dcDD68Aaa8)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## 🎨 Overview

The Private Art Investment Platform revolutionizes art investment by combining blockchain transparency with Fully Homomorphic Encryption (FHE) technology. This platform enables investors to purchase fractional shares of valuable artworks while maintaining complete privacy of their investment amounts and portfolio holdings.

### Live Application

🌐 **Website**: [https://private-art-investment.vercel.app/](https://private-art-investment.vercel.app/)

📜 **Smart Contract**: `0xa0eE56B7697846877d0E90FA654377dcDD68Aaa8` (Sepolia Testnet)

🔗 **GitHub Repository**: [https://github.com/GustHomenick/PrivateArtInvestment](https://github.com/GustHomenick/PrivateArtInvestment)

## 🔐 Core Concepts

### Fully Homomorphic Encryption (FHE)

Our platform leverages FHE technology to ensure investor privacy while maintaining blockchain transparency:

- **Encrypted Investment Amounts**: All investment values are encrypted on-chain using FHE, making them invisible to external observers
- **Private Share Holdings**: The number of shares owned by each investor is encrypted and cannot be viewed by others
- **Homomorphic Computations**: Mathematical operations can be performed on encrypted data without decryption, enabling:
  - Portfolio value calculations
  - Returns distribution based on encrypted share amounts
  - Investment statistics aggregation

### Anonymous Art Investment

Traditional art investment platforms expose investor information publicly. Our FHE-powered solution addresses this privacy concern:

1. **Investment Privacy**: Your investment amount remains confidential - only you can decrypt and view your holdings
2. **Portfolio Confidentiality**: Total portfolio value is computed homomorphically, keeping individual investments private
3. **Transparent Verification**: Despite encryption, all transactions are verifiable on-chain, ensuring authenticity
4. **Fair Returns Distribution**: Returns are distributed proportionally based on encrypted share amounts using FHE computation

## 🎭 Key Features

### For Investors

- **Private Registration**: Register as an investor with encrypted profile initialization
- **Confidential Investments**: Invest in artworks with fully encrypted transaction amounts
- **Portfolio Privacy**: View your own portfolio while keeping it hidden from others
- **Secure Returns**: Receive proportional returns based on your encrypted shareholdings

### For Art Curators

- **Artwork Listing**: List high-value artworks with fractional share offerings
- **IPFS Integration**: Store artwork metadata and images on decentralized storage
- **Investor Management**: Track total investor count while respecting individual privacy
- **Returns Distribution**: Distribute profits to investors using FHE-based calculations

### Platform Security

- **On-Chain Encryption**: All sensitive data encrypted at the smart contract level
- **Access Control**: Granular permissions using FHE access control lists (ACL)
- **Decryption Requests**: Secure async decryption for authorized operations only
- **Cryptographic Signatures**: Multi-signature verification for sensitive operations

## 📊 How It Works

### Investment Flow

```
1. Connect Wallet (MetaMask) → Sepolia Testnet
2. Register as Investor → Encrypted profile created
3. Browse Artwork Gallery → View available fractional shares
4. Select Artwork & Shares → Choose investment amount
5. Confirm Transaction → Investment encrypted and recorded
6. Private Portfolio → View your holdings (only you can see)
```

### Returns Distribution

```
1. Artwork Sold/Generates Revenue
2. Curator Initiates Returns Distribution
3. FHE Decryption Request → Encrypted shares decrypted securely
4. Proportional Calculation → Returns computed based on shareholding
5. Automatic Distribution → Funds transferred to investor wallets
```

## 🖼️ Demo & Screenshots

### Video Demonstration

*PrivateArtInvestment.mp4 showcases the complete investor journey from registration to receiving returns*

### On-Chain Transactions

Below are real PrivateArtInvestment.png from the Sepolia testnet:


## 🏗️ Technical Architecture

### Smart Contract Stack

- **Solidity**: Smart contract development (v0.8.24)
- **FHE Library**: Zama's fhEVM for homomorphic encryption
- **Network**: Sepolia Ethereum Testnet
- **Storage**: IPFS for artwork metadata

### Frontend Stack

- **Vanilla JavaScript**: Lightweight and fast
- **Ethers.js v6**: Ethereum interaction library
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Auto-refresh every 30 seconds

### Encryption Implementation

```solidity
// Example: Private investment encryption
struct PrivateInvestment {
    FHE.euint32 encryptedShares;       // Encrypted share amount
    FHE.euint32 encryptedValue;        // Encrypted investment value
    bool hasInvested;
    uint256 timestamp;
}

// Homomorphic addition for portfolio calculation
investorProfiles[msg.sender].encryptedTotalInvestment =
    FHE.add(currentTotal, encryptedValue);
```

## 🎯 Use Cases

### 1. High-Net-Worth Investors
Invest in blue-chip artworks while maintaining portfolio confidentiality from competitors and public scrutiny.

### 2. Institutional Buyers
Art funds and investment firms can diversify portfolios without revealing strategy or holdings to market.

### 3. Privacy-Conscious Collectors
Individual collectors who value privacy can participate in fractional art ownership anonymously.

### 4. Emerging Artists
Up-and-coming artists can attract investment while protecting early supporter identities.

## 🔒 Privacy Guarantees

### What is Private?

✅ **Your investment amounts**: Fully encrypted using FHE
✅ **Your share quantities**: Encrypted on-chain
✅ **Your portfolio value**: Homomorphically computed, remains encrypted
✅ **Your transaction history**: Amounts encrypted, only you can decrypt

### What is Public?

📖 **Artwork listings**: Names, artists, total value, share prices
📖 **Total statistics**: Number of artworks, total registered investors
📖 **Transaction existence**: That a transaction occurred (not the amount)
📖 **Your participation**: That you invested in a specific artwork (not how much)

## 🌟 Benefits

### Privacy
- Zero-knowledge investment amounts
- Encrypted portfolio holdings
- Confidential returns distribution
- Protected investor identities

### Security
- Blockchain immutability
- Smart contract automation
- Multi-signature verification
- Decentralized storage (IPFS)

### Accessibility
- Fractional ownership
- Lower investment barriers
- Global participation
- 24/7 availability

### Transparency
- Verifiable on-chain transactions
- Auditable smart contract code
- Artwork provenance tracking
- Fair returns calculation

## 📱 Getting Started

### Prerequisites

- MetaMask wallet extension
- Sepolia ETH for gas fees ([Faucet](https://sepoliafaucet.com/))
- Modern web browser (Chrome, Firefox, Brave)

### Quick Start

1. Visit [https://private-art-investment.vercel.app/](https://private-art-investment.vercel.app/)
2. Connect your MetaMask wallet
3. Switch to Sepolia testnet
4. Register as an investor
5. Browse artwork gallery
6. Make your first private investment!

## 🤝 Contributing

We welcome contributions to improve the Private Art Investment Platform! Here's how you can help:

- 🐛 Report bugs and issues
- 💡 Suggest new features
- 📖 Improve documentation
- 🔧 Submit pull requests

Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Application**: [https://private-art-investment.vercel.app/](https://private-art-investment.vercel.app/)
- **GitHub Repository**: [https://github.com/GustHomenick/PrivateArtInvestment](https://github.com/GustHomenick/PrivateArtInvestment)
- **Smart Contract**: [0xa0eE56B7697846877d0E90FA654377dcDD68Aaa8](https://sepolia.etherscan.io/address/0xa0eE56B7697846877d0E90FA654377dcDD68Aaa8)
- **Zama fhEVM Docs**: [https://docs.zama.ai/fhevm](https://docs.zama.ai/fhevm)

## 💬 Support

For questions, feedback, or support:

- 📧 Open an issue on [GitHub](https://github.com/GustHomenick/PrivateArtInvestment/issues)
- 💬 Join our community discussions
- 📚 Read the [documentation](https://github.com/GustHomenick/PrivateArtInvestment/wiki)

## 🙏 Acknowledgments

- **Zama**: For providing the FHE encryption library (fhEVM)
- **Ethereum Foundation**: For Sepolia testnet infrastructure
- **IPFS**: For decentralized storage solutions
- **Open Source Community**: For invaluable tools and libraries

---

**Built with ❤️ for privacy-conscious art investors**

*Combining the transparency of blockchain with the privacy of homomorphic encryption*