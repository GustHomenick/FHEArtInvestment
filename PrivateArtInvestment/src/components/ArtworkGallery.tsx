import { useEffect, useState } from 'react';
import { useContract, type ArtworkInfo } from '../hooks/useContract';
import { ethers } from 'ethers';

interface ArtworkGalleryProps {
  onSelectArtwork?: (artworkId: number) => void;
  refreshTrigger?: number;
}

interface ArtworkDisplay extends ArtworkInfo {
  id: number;
}

export function ArtworkGallery({ onSelectArtwork, refreshTrigger }: ArtworkGalleryProps) {
  const { contract } = useContract();
  const [artworks, setArtworks] = useState<ArtworkDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadArtworks();
  }, [contract, refreshTrigger]);

  async function loadArtworks() {
    if (!contract) return;

    setIsLoading(true);
    try {
      const contractInstance = await contract;
      const [totalArtworks] = await contractInstance.getTotalStats();

      const artworksList: ArtworkDisplay[] = [];

      for (let i = 0; i < Number(totalArtworks); i++) {
        try {
          const artworkInfo = await contractInstance.getArtworkInfo(i);
          artworksList.push({
            id: i,
            name: artworkInfo.name,
            artist: artworkInfo.artist,
            ipfsHash: artworkInfo.ipfsHash,
            totalValue: artworkInfo.totalValue,
            sharePrice: artworkInfo.sharePrice,
            totalShares: artworkInfo.totalShares,
            availableShares: artworkInfo.availableShares,
            investorCount: artworkInfo.investorCount,
          });
        } catch (error) {
          console.error(`Failed to load artwork ${i}:`, error);
        }
      }

      setArtworks(artworksList);
    } catch (error) {
      console.error('Failed to load artworks:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleInvestClick(artworkId: number) {
    if (onSelectArtwork) {
      onSelectArtwork(artworkId);
    }
  }

  if (isLoading) {
    return (
      <div className="card artwork-gallery">
        <h3>Artwork Gallery</h3>
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading artworks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card artwork-gallery">
      <h3>Artwork Gallery</h3>
      <div className="artworks-grid">
        {artworks.length === 0 ? (
          <div className="artwork-card">
            <div className="artwork-image">🎨</div>
            <div className="artwork-info">
              <div className="artwork-title">No Artworks Yet</div>
              <div className="artwork-artist">Please list artworks first</div>
              <div className="artwork-stats">
                <div className="stat">
                  <div className="stat-value">-</div>
                  <div className="stat-label">Total Value</div>
                </div>
                <div className="stat">
                  <div className="stat-value">-</div>
                  <div className="stat-label">Available Shares</div>
                </div>
                <div className="stat">
                  <div className="stat-value">-</div>
                  <div className="stat-label">Investors</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          artworks.map((artwork) => (
            <div key={artwork.id} className="artwork-card">
              <div className="artwork-image">🎨</div>
              <div className="artwork-info">
                <div className="artwork-title">{artwork.name}</div>
                <div className="artwork-artist">by {artwork.artist}</div>
                <div className="artwork-stats">
                  <div className="stat">
                    <div className="stat-value">{ethers.formatEther(artwork.totalValue)} ETH</div>
                    <div className="stat-label">Total Value</div>
                  </div>
                  <div className="stat">
                    <div className="stat-value">{artwork.availableShares.toString()}</div>
                    <div className="stat-label">Available Shares</div>
                  </div>
                  <div className="stat">
                    <div className="stat-value">{artwork.investorCount.toString()}</div>
                    <div className="stat-label">Investors</div>
                  </div>
                </div>
                <button
                  className="invest-btn"
                  onClick={() => handleInvestClick(artwork.id)}
                >
                  Invest ({ethers.formatEther(artwork.sharePrice)} ETH/share)
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
