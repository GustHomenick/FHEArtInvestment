import { useEffect, useState } from 'react';
import { useContract } from '../hooks/useContract';

interface Stats {
  totalArtworks: string;
  totalInvestors: string;
  userPortfolio: string;
}

export function StatsDisplay() {
  const { contract, userAddress } = useContract();
  const [stats, setStats] = useState<Stats>({
    totalArtworks: '0',
    totalInvestors: '0',
    userPortfolio: '0',
  });

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, [contract, userAddress]);

  async function loadStats() {
    if (!contract) return;

    try {
      const contractInstance = await contract;
      const [totalArtworks, totalInvestors] = await contractInstance.getTotalStats();

      let portfolioDisplay = '0';
      if (userAddress) {
        try {
          const isRegistered = await contractInstance.isInvestorRegistered(userAddress);
          portfolioDisplay = isRegistered ? '🔐' : '0';
        } catch (error) {
          console.error('Failed to get user portfolio:', error);
        }
      }

      setStats({
        totalArtworks: totalArtworks.toString(),
        totalInvestors: totalInvestors.toString(),
        userPortfolio: portfolioDisplay,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-number">{stats.totalArtworks}</div>
        <div>Total Artworks</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{stats.totalInvestors}</div>
        <div>Total Investors</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{stats.userPortfolio}</div>
        <div>My Portfolio</div>
      </div>
    </div>
  );
}
