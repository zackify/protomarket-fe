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
  const [selectedChain, setSelectedChain] = useState<
    typeof monadTestnet | typeof base
  >(monadTestnet);
  const [contractVersion, setContractVersion] = useState<string>("V0");

  const currentChainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { isConnected } = useAccount();

  // Auto-switch to monadTestnet when wallet connects
  useEffect(() => {
    if (isConnected) {
      // Small delay to ensure wallet connection is fully established
      switchToChain(monadTestnet.id).catch(console.error);
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
