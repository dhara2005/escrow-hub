import React from 'react';
import { Header } from '@/components/Header';
import { Dashboard } from '@/components/Dashboard';
import { ConnectWalletPrompt } from '@/components/ConnectWalletPrompt';
import { useWallet } from '@/context/WalletContext';

const Index: React.FC = () => {
  const { wallet } = useWallet();

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-info/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <Header />
        {wallet.isConnected ? <Dashboard /> : <ConnectWalletPrompt />}
      </div>
    </div>
  );
};

export default Index;
