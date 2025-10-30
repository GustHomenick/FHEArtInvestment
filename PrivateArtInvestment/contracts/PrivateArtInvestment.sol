// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, FHEVMConfigStruct, SepoliaConfig } from "./LocalFHE.sol";

contract PrivateArtInvestment is SepoliaConfig {

    address public owner;
    uint256 public totalArtworks;
    uint256 public totalInvestors;

    struct ArtworkInfo {
        string name;
        string artist;
        string ipfsHash;
        uint256 totalValue;
        uint256 sharePrice;
        uint256 totalShares;
        uint256 availableShares;
        bool isActive;
        address creator;
        uint256 createdAt;
    }

    struct PrivateInvestment {
        FHE.euint32 encryptedShares;       // FHE encrypted share amount
        FHE.euint32 encryptedValue;        // FHE encrypted investment value
        bool hasInvested;
        uint256 timestamp;
    }

    struct InvestorProfile {
        FHE.euint32 encryptedTotalInvestment;    // FHE encrypted total investment
        FHE.euint32 encryptedPortfolioCount;     // FHE encrypted portfolio count
        bool isRegistered;
        uint256 registeredAt;
    }

    mapping(uint256 => ArtworkInfo) public artworks;
    mapping(uint256 => mapping(address => PrivateInvestment)) public artworkInvestments;
    mapping(address => InvestorProfile) public investorProfiles;
    mapping(uint256 => address[]) public artworkInvestors;

    // For decryption requests
    mapping(uint256 => uint256) private pendingReturns;
    mapping(uint256 => address[]) private pendingInvestors;

    event ArtworkListed(
        uint256 indexed artworkId,
        string name,
        uint256 totalValue,
        uint256 sharePrice
    );
    event PrivateInvestmentMade(
        address indexed investor,
        uint256 indexed artworkId,
        uint256 timestamp
    );
    event InvestorRegistered(address indexed investor, uint256 timestamp);
    event ReturnsDistributed(uint256 indexed artworkId, uint256 totalReturns);
    event ArtworkSold(uint256 indexed artworkId, uint256 salePrice);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyRegisteredInvestor() {
        require(investorProfiles[msg.sender].isRegistered, "Not registered investor");
        _;
    }

    modifier validArtwork(uint256 artworkId) {
        require(artworkId < totalArtworks, "Invalid artwork ID");
        require(artworks[artworkId].isActive, "Artwork not active");
        _;
    }

    constructor() {
        owner = msg.sender;
        totalArtworks = 0;
        totalInvestors = 0;
    }

    function registerInvestor() external {
        require(!investorProfiles[msg.sender].isRegistered, "Already registered");

        // Initialize with encrypted zeros using FHE
        FHE.euint32 memory zeroInvestment = FHE.asEuint32(0);
        FHE.euint32 memory zeroPortfolio = FHE.asEuint32(0);

        investorProfiles[msg.sender] = InvestorProfile({
            encryptedTotalInvestment: zeroInvestment,
            encryptedPortfolioCount: zeroPortfolio,
            isRegistered: true,
            registeredAt: block.timestamp
        });

        // Grant ACL permissions
        FHE.allowThis(zeroInvestment);
        FHE.allowThis(zeroPortfolio);
        FHE.allow(zeroInvestment, msg.sender);
        FHE.allow(zeroPortfolio, msg.sender);

        totalInvestors++;
        emit InvestorRegistered(msg.sender, block.timestamp);
    }

    function listArtwork(
        string memory _name,
        string memory _artist,
        string memory _ipfsHash,
        uint256 _totalValue,
        uint256 _sharePrice,
        uint256 _totalShares
    ) external onlyOwner {
        require(_totalValue > 0, "Invalid total value");
        require(_sharePrice > 0, "Invalid share price");
        require(_totalShares > 0, "Invalid total shares");
        require(_totalValue == _sharePrice * _totalShares, "Value calculation mismatch");

        artworks[totalArtworks] = ArtworkInfo({
            name: _name,
            artist: _artist,
            ipfsHash: _ipfsHash,
            totalValue: _totalValue,
            sharePrice: _sharePrice,
            totalShares: _totalShares,
            availableShares: _totalShares,
            isActive: true,
            creator: msg.sender,
            createdAt: block.timestamp
        });

        emit ArtworkListed(totalArtworks, _name, _totalValue, _sharePrice);
        totalArtworks++;
    }

    function makePrivateInvestment(
        uint256 artworkId,
        uint32 shareAmount
    ) external payable onlyRegisteredInvestor validArtwork(artworkId) {
        require(shareAmount > 0, "Invalid share amount");
        require(artworks[artworkId].availableShares >= shareAmount, "Insufficient shares available");
        require(
            !artworkInvestments[artworkId][msg.sender].hasInvested,
            "Already invested in this artwork"
        );

        uint256 requiredPayment = artworks[artworkId].sharePrice * shareAmount;
        require(msg.value >= requiredPayment, "Insufficient payment");

        // Encrypt the investment data using FHE
        FHE.euint32 memory encryptedShares = FHE.asEuint32(shareAmount);
        FHE.euint32 memory encryptedValue = FHE.asEuint32(uint32(msg.value / 1e14)); // Scale down for euint32

        artworkInvestments[artworkId][msg.sender] = PrivateInvestment({
            encryptedShares: encryptedShares,
            encryptedValue: encryptedValue,
            hasInvested: true,
            timestamp: block.timestamp
        });

        artworkInvestors[artworkId].push(msg.sender);
        artworks[artworkId].availableShares -= shareAmount;

        // Update investor profile with FHE operations
        FHE.euint32 memory currentTotal = investorProfiles[msg.sender].encryptedTotalInvestment;
        FHE.euint32 memory currentPortfolio = investorProfiles[msg.sender].encryptedPortfolioCount;

        investorProfiles[msg.sender].encryptedTotalInvestment = FHE.add(currentTotal, encryptedValue);
        investorProfiles[msg.sender].encryptedPortfolioCount = FHE.add(currentPortfolio, FHE.asEuint32(1));

        // Grant ACL permissions
        FHE.allowThis(encryptedShares);
        FHE.allowThis(encryptedValue);
        FHE.allowThis(investorProfiles[msg.sender].encryptedTotalInvestment);
        FHE.allowThis(investorProfiles[msg.sender].encryptedPortfolioCount);
        FHE.allow(encryptedShares, msg.sender);
        FHE.allow(encryptedValue, msg.sender);
        FHE.allow(investorProfiles[msg.sender].encryptedTotalInvestment, msg.sender);
        FHE.allow(investorProfiles[msg.sender].encryptedPortfolioCount, msg.sender);

        // Return excess payment
        if (msg.value > requiredPayment) {
            payable(msg.sender).transfer(msg.value - requiredPayment);
        }

        emit PrivateInvestmentMade(msg.sender, artworkId, block.timestamp);
    }

    function requestReturnsDistribution(uint256 artworkId) external payable onlyOwner validArtwork(artworkId) {
        require(msg.value > 0, "No returns to distribute");
        require(artworkInvestors[artworkId].length > 0, "No investors for this artwork");

        // Store pending returns for async processing
        pendingReturns[artworkId] = msg.value;
        pendingInvestors[artworkId] = artworkInvestors[artworkId];

        // Prepare encrypted shares for decryption - following reference pattern
        address[] memory investors = artworkInvestors[artworkId];
        bytes32[] memory cts = new bytes32[](investors.length);

        for (uint i = 0; i < investors.length; i++) {
            cts[i] = FHE.toBytes32(artworkInvestments[artworkId][investors[i]].encryptedShares);
        }

        // Request async decryption following reference pattern
        FHE.requestDecryption(cts, this.processReturnsDistribution.selector);
    }

    function processReturnsDistribution(
        uint256 requestId,
        uint32[] memory decryptedShares,
        bytes[] memory signatures
    ) external {
        // Verify signatures following reference pattern
        FHE.checkSignatures(requestId, signatures);

        // Find the artworkId from the request (simplified for demo)
        uint256 artworkId = _findArtworkFromRequest(requestId);

        uint256 totalReturns = pendingReturns[artworkId];
        address[] memory investors = pendingInvestors[artworkId];

        require(decryptedShares.length == investors.length, "Shares count mismatch");

        // Calculate total shares
        uint256 totalShares = 0;
        for (uint i = 0; i < decryptedShares.length; i++) {
            totalShares += decryptedShares[i];
        }

        // Distribute returns proportionally
        for (uint i = 0; i < investors.length; i++) {
            if (decryptedShares[i] > 0) {
                uint256 investorReturn = (totalReturns * decryptedShares[i]) / totalShares;
                if (investorReturn > 0) {
                    payable(investors[i]).transfer(investorReturn);
                }
            }
        }

        // Clean up pending data
        delete pendingReturns[artworkId];
        delete pendingInvestors[artworkId];

        emit ReturnsDistributed(artworkId, totalReturns);
    }

    function _findArtworkFromRequest(uint256 requestId) private pure returns (uint256) {
        // Simplified mapping - in production you would maintain proper request tracking
        return requestId % 1000;
    }

    function sellArtwork(uint256 artworkId, uint256 salePrice) external onlyOwner validArtwork(artworkId) {
        require(salePrice > 0, "Invalid sale price");
        artworks[artworkId].isActive = false;
        emit ArtworkSold(artworkId, salePrice);
    }

    function getArtworkInfo(uint256 artworkId) external view validArtwork(artworkId) returns (
        string memory name,
        string memory artist,
        string memory ipfsHash,
        uint256 totalValue,
        uint256 sharePrice,
        uint256 totalShares,
        uint256 availableShares,
        uint256 investorCount
    ) {
        ArtworkInfo storage artwork = artworks[artworkId];
        uint256 investors = artworkInvestors[artworkId].length;
        return (
            artwork.name,
            artwork.artist,
            artwork.ipfsHash,
            artwork.totalValue,
            artwork.sharePrice,
            artwork.totalShares,
            artwork.availableShares,
            investors
        );
    }

    function getInvestmentStatus(address investor, uint256 artworkId) external view returns (
        bool hasInvested,
        uint256 timestamp
    ) {
        PrivateInvestment storage investment = artworkInvestments[artworkId][investor];
        return (investment.hasInvested, investment.timestamp);
    }

    function getTotalStats() external view returns (
        uint256 totalArtworksListed,
        uint256 totalRegisteredInvestors
    ) {
        return (totalArtworks, totalInvestors);
    }

    function isInvestorRegistered(address investor) external view returns (bool) {
        return investorProfiles[investor].isRegistered;
    }

    function getArtworkInvestors(uint256 artworkId) external view validArtwork(artworkId) returns (uint256) {
        return artworkInvestors[artworkId].length;
    }

    // FHE-specific function to get encrypted investment summary
    function getEncryptedInvestmentSummary(address user) external view returns (
        FHE.euint32 memory encryptedTotalInvested,
        FHE.euint32 memory encryptedPortfolioCount,
        bool isRegistered
    ) {
        InvestorProfile storage profile = investorProfiles[user];
        return (
            profile.encryptedTotalInvestment,
            profile.encryptedPortfolioCount,
            profile.isRegistered
        );
    }

    // Function to get encrypted shares for a specific investment
    function getEncryptedShares(address investor, uint256 artworkId) external view returns (FHE.euint32 memory) {
        return artworkInvestments[artworkId][investor].encryptedShares;
    }

    function emergencyWithdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    receive() external payable {}
}