import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { BrowserProvider, formatEther, Eip1193Provider } from 'ethers';
import { WalletState } from '@/types/escrow';
import { toast } from 'sonner';

export type WalletType = 'metamask' | 'coinbase' | 'trust' | 'injected';

interface WalletContextType {
  wallet: WalletState;
  walletType: WalletType | null;
  connect: (type?: WalletType) => Promise<void>;
  disconnect: () => void;
  provider: BrowserProvider | null;
  isConnecting: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const getProvider = (type: WalletType): Eip1193Provider | null => {
  if (typeof window.ethereum === 'undefined') return null;
  
  // Handle multiple injected providers
  if (window.ethereum.providers?.length) {
    switch (type) {
      case 'metamask':
        return window.ethereum.providers.find((p) => p.isMetaMask) || null;
      case 'coinbase':
        return window.ethereum.providers.find((p) => p.isCoinbaseWallet) || null;
      default:
        return window.ethereum.providers[0] || null;
    }
  }
  
  return window.ethereum;
};

const detectWalletType = (): WalletType | null => {
  if (typeof window.ethereum === 'undefined') return null;
  
  if (window.ethereum.isMetaMask) return 'metamask';
  if (window.ethereum.isCoinbaseWallet) return 'coinbase';
  if (window.ethereum.isTrust) return 'trust';
  
  return 'injected';
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    balance: '0',
  });
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [walletType, setWalletType] = useState<WalletType | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(async (type: WalletType = 'injected') => {
    setIsConnecting(true);
    
    const injectedProvider = getProvider(type);
    
    if (!injectedProvider) {
      toast.error('No wallet detected', {
        description: 'Please install a Web3 wallet like MetaMask, Coinbase Wallet, or Trust Wallet.',
      });
      setIsConnecting(false);
      return;
    }

    try {
      const browserProvider = new BrowserProvider(injectedProvider);
      const accounts = await browserProvider.send('eth_requestAccounts', []);
      
      if (accounts.length === 0) {
        toast.error('No accounts found');
        setIsConnecting(false);
        return;
      }

      const address = accounts[0];
      const balance = await browserProvider.getBalance(address);
      const formattedBalance = formatEther(balance);
      const detectedType = detectWalletType() || type;

      setProvider(browserProvider);
      setWalletType(detectedType);
      setWallet({
        address,
        isConnected: true,
        balance: parseFloat(formattedBalance).toFixed(4),
      });

      toast.success('Wallet connected', {
        description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
      });
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      if (error.code === 4001) {
        toast.error('Connection rejected', {
          description: 'You rejected the connection request.',
        });
      } else {
        toast.error('Connection failed', {
          description: error.message || 'Failed to connect wallet.',
        });
      }
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setWallet({
      address: null,
      isConnected: false,
      balance: '0',
    });
    setProvider(null);
    setWalletType(null);
    toast.info('Wallet disconnected');
  }, []);

  // Listen for account/chain changes
  useEffect(() => {
    if (typeof window.ethereum === 'undefined' || !window.ethereum.on) return;

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else if (wallet.isConnected && accounts[0] !== wallet.address) {
        const injectedProvider = getProvider(walletType || 'injected');
        if (!injectedProvider) return;
        
        const browserProvider = new BrowserProvider(injectedProvider);
        const balance = await browserProvider.getBalance(accounts[0]);
        const formattedBalance = formatEther(balance);

        setProvider(browserProvider);
        setWallet({
          address: accounts[0],
          isConnected: true,
          balance: parseFloat(formattedBalance).toFixed(4),
        });

        toast.info('Account switched', {
          description: `Now using ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener?.('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener?.('chainChanged', handleChainChanged);
    };
  }, [wallet.isConnected, wallet.address, walletType, disconnect]);

  return (
    <WalletContext.Provider value={{ wallet, walletType, connect, disconnect, provider, isConnecting }}>
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
