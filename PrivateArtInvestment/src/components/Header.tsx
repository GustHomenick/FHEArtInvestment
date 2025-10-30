import { ConnectKitButton } from 'connectkit';

export function Header() {
  return (
    <div className="header">
      <h1>Private Art Investment Platform</h1>
      <p>Privacy-Protected Art Collection Investment Using FHE Encryption Technology</p>
      <div className="header-features">
        <strong>FHE Privacy Features:</strong>
        <div>• Investment amounts fully encrypted</div>
        <div>• Share quantities privacy protected</div>
        <div>• Portfolio data encrypted computation</div>
        <div>• Homomorphic encryption ensures data never leaks</div>
      </div>
      <div style={{ marginTop: '20px' }}>
        <ConnectKitButton />
      </div>
    </div>
  );
}
