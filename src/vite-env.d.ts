/// <reference types="vite/client" />

import { Eip1193Provider } from 'ethers';

declare global {
  interface Window {
    ethereum?: Eip1193Provider & {
      isMetaMask?: boolean;
      isCoinbaseWallet?: boolean;
      isTrust?: boolean;
      providers?: Array<Eip1193Provider & { isMetaMask?: boolean; isCoinbaseWallet?: boolean }>;
      on?: (event: string, callback: (...args: any[]) => void) => void;
      removeListener?: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}

export {};
