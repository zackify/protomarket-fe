import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useChainId, useSwitchChain, useAccount } from "wagmi";
import { monadTestnet, base } from "wagmi/chains";

export interface AppContextType {
  selectedChain: typeof monadTestnet | typeof base;
  contractVersion: string;
  setSelectedChain: (chain: typeof monadTestnet | typeof base) => void;
  setContractVersion: (version: string) => void;
  switchToChain: (chainId: number) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {
  // Initialize selectedChain from localStorage or default to monadTestnet
  const [selectedChain, setSelectedChain] = useState<
    typeof monadTestnet | typeof base
  >(() => {
    try {
      const saved = localStorage.getItem("selectedChain");
      if (saved) {
        const chainId = JSON.parse(saved);
        return chainId === base.id ? base : monadTestnet;
      }
    } catch (error) {
      console.error("Failed to load selectedChain from localStorage:", error);
    }
    return monadTestnet;
  });
  
  const [contractVersion, setContractVersion] = useState<string>("V0");

  const currentChainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { isConnected } = useAccount();

  // Save selectedChain to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("selectedChain", JSON.stringify(selectedChain.id));
    } catch (error) {
      console.error("Failed to save selectedChain to localStorage:", error);
    }
  }, [selectedChain]);

  // Auto-switch to selected chain when wallet connects (but only if not already on the right chain)
  useEffect(() => {
    if (isConnected && currentChainId !== selectedChain.id) {
      // Small delay to ensure wallet connection is fully established
      switchToChain(selectedChain.id).catch(console.error);
    }
  }, [isConnected]);

  const switchToChain = async (chainId: number) => {
    try {
      await switchChain({ chainId });
      const newChain = chainId === base.id ? base : monadTestnet;
      setSelectedChain(newChain);
    } catch (error) {
      console.error("Failed to switch chain:", error);
      throw error;
    }
  };

  const contextValue: AppContextType = {
    selectedChain,
    contractVersion,
    setSelectedChain,
    setContractVersion,
    switchToChain,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};
