'use client';

import { WalletProvider } from '@solana/wallet-adapter-react';
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

  // Use standard wallet adapters to avoid warnings
  const wallets = useMemo(
    () => [
      // Remove PhantomWalletAdapter as it's now a standard wallet
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <WalletProvider wallets={wallets} endpoint={endpoint} autoConnect>
      <WalletModalProvider>
        {children}
      </WalletModalProvider>
    </WalletProvider>
  );
}