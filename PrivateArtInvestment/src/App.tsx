import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { createFHEVMClient, type FHEVMClient } from '@fhevm/sdk';
import { Header } from './components/Header';
import { StatsDisplay } from './components/StatsDisplay';
import { InvestorRegistration } from './components/InvestorRegistration';
import { InvestmentForm } from './components/InvestmentForm';
import { ArtworkManagement } from './components/ArtworkManagement';
import { ArtworkGallery } from './components/ArtworkGallery';
import { useContract } from './hooks/useContract';

function App() {
  const { address, isConnected } = useAccount();
  const { contract } = useContract();
  const [fhevmClient, setFhevmClient] = useState<FHEVMClient | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [activeTab, setActiveTab] = useState<'register' | 'invest'>('register');
  const [artworks, setArtworks] = useState<Array<{ id: number; name: string; sharePrice: bigint }>>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Initialize FHEVM client when connected
  useEffect(() => {
    async function initFHEVM() {
      if (!isConnected || fhevmClient) return;

      setIsInitializing(true);
      try {
        const client = await createFHEVMClient({
          chainId: Number(import.meta.env.VITE_CHAIN_ID || 11155111),
          provider: import.meta.env.VITE_RPC_URL || '',
          debug: true,
        });
        setFhevmClient(client);
      } catch (error) {
        console.error('Failed to initialize FHEVM client:', error);
      } finally {
        setIsInitializing(false);
      }
    }

    initFHEVM();
  }, [isConnected, fhevmClient]);

  // Load artworks for the investment form
  useEffect(() => {
    loadArtworks();
  }, [contract, refreshTrigger]);

  async function loadArtworks() {
    if (!contract) return;

    try {
      const contractInstance = await contract;
      const [totalArtworks] = await contractInstance.getTotalStats();

      const artworksList = [];
      for (let i = 0; i < Number(totalArtworks); i++) {
        try {
          const artworkInfo = await contractInstance.getArtworkInfo(i);
          artworksList.push({
            id: i,
            name: artworkInfo.name,
            sharePrice: artworkInfo.sharePrice,
          });
        } catch (error) {
          console.error(`Failed to load artwork ${i}:`, error);
        }
      }

      setArtworks(artworksList);
    } catch (error) {
      console.error('Failed to load artworks:', error);
    }
  }

  function handleDataUpdate() {
    setRefreshTrigger(prev => prev + 1);
  }

  function handleSelectArtwork(artworkId: number) {
    setActiveTab('invest');
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (!isConnected) {
    return (
      <div className="app">
        <div className="container">
          <Header />
          <div className="welcome-card">
            <h2>Welcome to Private Art Investment Platform</h2>
            <p>Connect your wallet to start investing in art with privacy-protected transactions</p>
          </div>
        </div>
      </div>
    );
  }

  if (isInitializing) {
    return (
      <div className="app">
        <div className="container">
          <Header />
          <div className="loading">
            <div className="spinner"></div>
            <p>Initializing FHEVM client...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="connection-status connected">
        Connected: {address?.substring(0, 6)}...{address?.substring(38)}
      </div>

      <div className="container">
        <Header />

        <StatsDisplay />

        <div className="main-content">
          <div className="card">
            <h3>Investor Registration</h3>

            <div className="tabs">
              <div
                className={`tab ${activeTab === 'register' ? 'active' : ''}`}
                onClick={() => setActiveTab('register')}
              >
                Register Investor
              </div>
              <div
                className={`tab ${activeTab === 'invest' ? 'active' : ''}`}
                onClick={() => setActiveTab('invest')}
              >
                Private Investment
              </div>
            </div>

            <div className={`tab-content ${activeTab === 'register' ? 'active' : ''}`}>
              <InvestorRegistration onRegistrationComplete={handleDataUpdate} />
            </div>

            <div className={`tab-content ${activeTab === 'invest' ? 'active' : ''}`}>
              <InvestmentForm
                fhevmClient={fhevmClient}
                artworks={artworks}
                onInvestmentComplete={handleDataUpdate}
              />
            </div>
          </div>

          <ArtworkManagement onArtworkListed={handleDataUpdate} />
        </div>

        <ArtworkGallery
          onSelectArtwork={handleSelectArtwork}
          refreshTrigger={refreshTrigger}
        />
      </div>
    </div>
  );
}

export default App;
