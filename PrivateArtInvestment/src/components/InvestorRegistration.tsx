import { useState } from 'react';
import { useContract } from '../hooks/useContract';

interface InvestorRegistrationProps {
  onRegistrationComplete?: () => void;
}

export function InvestorRegistration({ onRegistrationComplete }: InvestorRegistrationProps) {
  const { contractWithSigner, userAddress } = useContract();
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister() {
    if (!contractWithSigner || !userAddress) {
      setStatus({ message: 'Please connect your wallet first', type: 'error' });
      return;
    }

    setIsLoading(true);
    setStatus({ message: 'Registering investor...', type: 'info' });

    try {
      const contract = await contractWithSigner;

      // Check if already registered
      const isRegistered = await contract.isInvestorRegistered(userAddress);
      if (isRegistered) {
        setStatus({ message: 'You are already a registered investor', type: 'info' });
        setIsLoading(false);
        return;
      }

      const tx = await contract.registerInvestor();
      setStatus({ message: `Transaction submitted: ${tx.hash}`, type: 'info' });

      await tx.wait();
      setStatus({ message: 'Investor registration successful!', type: 'success' });

      if (onRegistrationComplete) {
        onRegistrationComplete();
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      setStatus({ message: `Registration failed: ${error.message}`, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="form-group">
      <button className="btn" onClick={handleRegister} disabled={isLoading}>
        {isLoading ? 'Registering...' : 'Register as Investor'}
      </button>
      {status && (
        <div className={`status ${status.type}`}>
          {status.message}
        </div>
      )}
    </div>
  );
}
