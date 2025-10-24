'use client';

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';

// Import the default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl('devnet'), []);

  // Use only Solana-specific wallet adapters
  const wallets = useMemo(
    () => [
      new SolflareWalletAdapter({
        // Disable MetaMask detection to prevent warnings
        detectEthereumProvider: false,
      }),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}