import { useMemo } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0xa0eE56B7697846877d0E90FA654377dcDD68Aaa8";

const CONTRACT_ABI = [
  "function registerInvestor() external",
  "function listArtwork(string memory _name, string memory _artist, string memory _ipfsHash, uint256 _totalValue, uint256 _sharePrice, uint256 _totalShares) external",
  "function makePrivateInvestment(uint256 artworkId, uint32 shareAmount) external payable",
  "function requestReturnsDistribution(uint256 artworkId) external payable",
  "function getArtworkInfo(uint256 artworkId) external view returns (string memory name, string memory artist, string memory ipfsHash, uint256 totalValue, uint256 sharePrice, uint256 totalShares, uint256 availableShares, uint256 investorCount)",
  "function getTotalStats() external view returns (uint256 totalArtworksListed, uint256 totalRegisteredInvestors)",
  "function isInvestorRegistered(address investor) external view returns (bool)",
  "function getInvestmentStatus(address investor, uint256 artworkId) external view returns (bool hasInvested, uint256 timestamp)",
  "function owner() external view returns (address)",
  "event ArtworkListed(uint256 indexed artworkId, string name, uint256 totalValue, uint256 sharePrice)",
  "event PrivateInvestmentMade(address indexed investor, uint256 indexed artworkId, uint256 timestamp)",
  "event InvestorRegistered(address indexed investor, uint256 timestamp)",
  "event ReturnsDistributed(uint256 indexed artworkId, uint256 totalReturns)"
];

export interface ArtworkInfo {
  name: string;
  artist: string;
  ipfsHash: string;
  totalValue: bigint;
  sharePrice: bigint;
  totalShares: bigint;
  availableShares: bigint;
  investorCount: bigint;
}

export function useContract() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const contract = useMemo(() => {
    if (!walletClient) return null;

    const provider = new ethers.BrowserProvider(walletClient as any);
    return new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      provider
    );
  }, [walletClient]);

  const contractWithSigner = useMemo(async () => {
    if (!contract || !walletClient) return null;

    const provider = new ethers.BrowserProvider(walletClient as any);
    const signer = await provider.getSigner();
    return new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );
  }, [contract, walletClient]);

  return {
    contract,
    contractWithSigner,
    contractAddress: CONTRACT_ADDRESS,
    userAddress: address,
  };
}
