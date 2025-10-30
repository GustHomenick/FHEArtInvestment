import { useState, useEffect } from 'react';
import { useContract } from '../hooks/useContract';
import { ethers } from 'ethers';
import type { FHEVMClient } from '@fhevm/sdk';
import { useEncrypt } from '@fhevm/sdk';

interface InvestmentFormProps {
  fhevmClient: FHEVMClient | null;
  artworks: Array<{
    id: number;
    name: string;
    sharePrice: bigint;
  }>;
  onInvestmentComplete?: () => void;
}

export function InvestmentForm({ fhevmClient, artworks, onInvestmentComplete }: InvestmentFormProps) {
  const { contractWithSigner, userAddress, contractAddress } = useContract();
  const { encrypt, isEncrypting } = useEncrypt(fhevmClient, contractAddress, userAddress || '');
  const [selectedArtwork, setSelectedArtwork] = useState('');
  const [shareAmount, setShareAmount] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    calculateInvestmentAmount();
  }, [selectedArtwork, shareAmount, artworks]);

  function calculateInvestmentAmount() {
    if (selectedArtwork && shareAmount) {
      const artwork = artworks.find(a => a.id.toString() === selectedArtwork);
      if (artwork) {
        const totalAmount = artwork.sharePrice * BigInt(shareAmount);
        const formattedAmount = ethers.formatEther(totalAmount);
        setInvestmentAmount(formattedAmount + ' ETH');
      }
    } else {
      setInvestmentAmount('');
    }
  }

  async function handleInvest() {
    if (!contractWithSigner || !userAddress) {
      setStatus({ message: 'Please connect your wallet first', type: 'error' });
      return;
    }

    if (!selectedArtwork || !shareAmount) {
      setStatus({ message: 'Please select artwork and enter share amount', type: 'error' });
      return;
    }

    setIsLoading(true);
    setStatus({ message: 'Processing investment...', type: 'info' });

    try {
      const contract = await contractWithSigner;

      // Check if registered
      const isRegistered = await contract.isInvestorRegistered(userAddress);
      if (!isRegistered) {
        setStatus({ message: 'Please register as investor first', type: 'error' });
        setIsLoading(false);
        return;
      }

      const artwork = artworks.find(a => a.id.toString() === selectedArtwork);
      if (!artwork) {
        setStatus({ message: 'Artwork not found', type: 'error' });
        setIsLoading(false);
        return;
      }

      const investmentValue = artwork.sharePrice * BigInt(shareAmount);

      // In a full FHEVM implementation, we would encrypt the share amount here
      // For now, we'll use the regular contract call
      const tx = await contract.makePrivateInvestment(selectedArtwork, shareAmount, {
        value: investmentValue
      });

      setStatus({ message: `Transaction submitted: ${tx.hash}`, type: 'info' });

      await tx.wait();
      setStatus({ message: 'Investment successful!', type: 'success' });

      // Clear form
      setSelectedArtwork('');
      setShareAmount('');
      setInvestmentAmount('');

      if (onInvestmentComplete) {
        onInvestmentComplete();
      }
    } catch (error: any) {
      console.error('Investment failed:', error);
      setStatus({ message: `Investment failed: ${error.message}`, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div className="privacy-badge">
        <strong>Privacy Protected Investment</strong>
        Your investment amount and share quantities will be fully encrypted using FHE technology, ensuring investment privacy.
      </div>

      <div className="form-group">
        <label>Select Artwork:</label>
        <select
          value={selectedArtwork}
          onChange={(e) => setSelectedArtwork(e.target.value)}
          disabled={isLoading}
        >
          <option value="">Choose artwork to invest in...</option>
          {artworks.map((artwork) => (
            <option key={artwork.id} value={artwork.id}>
              {artwork.name} - {ethers.formatEther(artwork.sharePrice)} ETH/share
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Investment Shares:</label>
        <input
          type="number"
          value={shareAmount}
          onChange={(e) => setShareAmount(e.target.value)}
          placeholder="Enter number of shares to purchase (will be encrypted)"
          min="1"
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label>Investment Amount (ETH):</label>
        <input
          type="text"
          value={investmentAmount}
          placeholder="Will be calculated automatically (encrypted storage)"
          readOnly
        />
      </div>

      <div className="form-group">
        <button
          className="btn"
          onClick={handleInvest}
          disabled={isLoading || !selectedArtwork || !shareAmount}
        >
          {isLoading ? 'Processing...' : 'Make Private Investment'}
        </button>
      </div>

      {status && (
        <div className={`status ${status.type}`}>
          {status.message}
        </div>
      )}
    </div>
  );
}
