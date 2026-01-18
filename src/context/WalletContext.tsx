import React, { createContext, useContext, useState, useCallback } from 'react';
import { WalletState } from '@/types/escrow';

interface WalletContextType {
  wallet: WalletState;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    balance: '0',
  });

  const connect = useCallback(async () => {
    // Mock wallet connection - replace with actual web3 provider later
    // For demo, we'll simulate a connection
    const mockAddress = '0x' + Math.random().toString(16).slice(2, 10) + '...';
    const fullAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f8dB21';
    
    setWallet({
      address: fullAddress,
      isConnected: true,
      balance: '2.547',
    });
  }, []);

  const disconnect = useCallback(() => {
    setWallet({
      address: null,
      isConnected: false,
      balance: '0',
    });
  }, []);

  return (
    <WalletContext.Provider value={{ wallet, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
