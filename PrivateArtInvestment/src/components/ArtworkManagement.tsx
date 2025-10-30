import { useState } from 'react';
import { useContract } from '../hooks/useContract';
import { ethers } from 'ethers';

interface ArtworkManagementProps {
  onArtworkListed?: () => void;
}

export function ArtworkManagement({ onArtworkListed }: ArtworkManagementProps) {
  const { contractWithSigner } = useContract();
  const [formData, setFormData] = useState({
    name: '',
    artist: '',
    ipfsHash: '',
    totalValue: '',
    sharePrice: '',
    totalShares: '',
  });
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleInputChange(field: string, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  async function handleListArtwork() {
    if (!contractWithSigner) {
      setStatus({ message: 'Please connect your wallet first', type: 'error' });
      return;
    }

    const { name, artist, ipfsHash, totalValue, sharePrice, totalShares } = formData;

    if (!name || !artist || !ipfsHash || !totalValue || !sharePrice || !totalShares) {
      setStatus({ message: 'Please fill all fields', type: 'error' });
      return;
    }

    setIsLoading(true);
    setStatus({ message: 'Listing artwork...', type: 'info' });

    try {
      const contract = await contractWithSigner;
      const totalValueWei = ethers.parseEther(totalValue);
      const sharePriceWei = ethers.parseEther(sharePrice);

      const tx = await contract.listArtwork(
        name,
        artist,
        ipfsHash,
        totalValueWei,
        sharePriceWei,
        totalShares
      );

      setStatus({ message: `Transaction submitted: ${tx.hash}`, type: 'info' });

      await tx.wait();
      setStatus({ message: 'Artwork listed successfully!', type: 'success' });

      // Clear form
      setFormData({
        name: '',
        artist: '',
        ipfsHash: '',
        totalValue: '',
        sharePrice: '',
        totalShares: '',
      });

      if (onArtworkListed) {
        onArtworkListed();
      }
    } catch (error: any) {
      console.error('Listing failed:', error);
      setStatus({ message: `Listing failed: ${error.message}`, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="card">
      <h3>Artwork Management</h3>

      <div className="form-group">
        <label>Artwork Name:</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter artwork name"
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label>Artist:</label>
        <input
          type="text"
          value={formData.artist}
          onChange={(e) => handleInputChange('artist', e.target.value)}
          placeholder="Enter artist name"
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label>IPFS Hash:</label>
        <input
          type="text"
          value={formData.ipfsHash}
          onChange={(e) => handleInputChange('ipfsHash', e.target.value)}
          placeholder="Enter artwork IPFS hash"
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label>Total Value (ETH):</label>
        <input
          type="number"
          value={formData.totalValue}
          onChange={(e) => handleInputChange('totalValue', e.target.value)}
          placeholder="0.0"
          step="0.001"
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label>Share Price (ETH):</label>
        <input
          type="number"
          value={formData.sharePrice}
          onChange={(e) => handleInputChange('sharePrice', e.target.value)}
          placeholder="0.0"
          step="0.001"
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label>Total Shares:</label>
        <input
          type="number"
          value={formData.totalShares}
          onChange={(e) => handleInputChange('totalShares', e.target.value)}
          placeholder="100"
          min="1"
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <button className="btn" onClick={handleListArtwork} disabled={isLoading}>
          {isLoading ? 'Listing...' : 'List Artwork'}
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
