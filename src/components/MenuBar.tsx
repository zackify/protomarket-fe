import React, { useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsName,
  useEnsAvatar,
} from "wagmi";
import { injected } from "wagmi/connectors";
import { monadTestnet, base, mainnet } from "wagmi/chains";
import { Dropdown, type DropdownOption } from "./Dropdown";
import { useAppContext } from "../contexts/AppContext";
import monadLogo from "../assets/images/monad-logo.svg";
import baseLogo from "../assets/images/base-logo.svg";

const ChainIcon: React.FC<{ chainId: number }> = ({ chainId }) => {
  if (chainId === base.id) {
    return <img src={baseLogo} alt="Base" className="w-5 h-5 rounded-full" />;
  }

  // Monad testnet
  return <img src={monadLogo} alt="Monad" className="w-5 h-5 rounded-full" />;
};

export const MenuBar: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const { data: ensName, isLoading: ensNameLoading } = useEnsName({
    address,
    chainId: mainnet.id,
  });
  const { data: ensAvatar, isLoading: ensAvatarLoading } = useEnsAvatar({
    name: ensName || undefined,
    chainId: mainnet.id,
  });

  const { selectedChain, switchToChain } = useAppContext();


  const chainOptions: DropdownOption[] = [
    {
      value: base.id.toString(),
      label: "Base",
      icon: <ChainIcon chainId={base.id} />,
    },
    {
      value: monadTestnet.id.toString(),
      label: "Monad Testnet",
      icon: <ChainIcon chainId={monadTestnet.id} />,
    },
  ];

  const handleChainChange = async (chainId: string) => {
    try {
      await switchToChain(parseInt(chainId));
    } catch (error) {
      console.error("Failed to switch chain:", error);
    }
  };

  const handleConnect = async () => {
    try {
      setConnectionError(null);
      await connect({ connector: injected() });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      setConnectionError(error instanceof Error ? error.message : "Failed to connect wallet");
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  return (
    <div className="w-full border-b border-green-400/20 mb-8">
      <div className="py-4">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl md:text-3xl font-bold text-green-400 font-sharetech tracking-widest uppercase">
              P33RPR3DICT
            </h1>
          </div>

          <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-y-0 md:space-x-4 flex-1 md:flex-none">
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <Dropdown
                options={chainOptions}
                selectedValue={selectedChain.id.toString()}
                onSelect={handleChainChange}
                className="flex-1 md:flex-none"
              />
            </div>

            {isConnected ? (
              <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-3">
                <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-2 border border-green-400/20">
                  {ensNameLoading ? (
                    <div className="w-6 h-6"></div>
                  ) : ensAvatar ? (
                    <img
                      src={ensAvatar}
                      alt="ENS Avatar"
                      className="w-6 h-6 min-w-[1.5rem] min-h-[1.5rem] rounded-full"
                    />
                  ) : null}
                  <span className="text-sm text-green-400 font-mono min-w-[80px] min-h-[1rem]">
                    {ensNameLoading
                      ? ""
                      : ensName || (address ? formatAddress(address) : "")}
                  </span>
                </div>
                <button
                  onClick={() => disconnect()}
                  className="px-3 py-2 text-xs font-mono text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors border border-red-400/20 hover:border-red-400/40 w-full md:w-auto"
                >
                  DISCONNECT
                </button>
              </div>
            ) : (
              <div className="w-full md:w-auto">
                <button
                  onClick={handleConnect}
                  className="px-4 py-2 bg-green-400/10 text-green-400 border border-green-400/30 rounded-lg hover:bg-green-400/20 hover:border-green-400/50 transition-all duration-200 font-mono text-sm font-semibold shadow-lg hover:shadow-green-400/20 w-full md:w-auto"
                >
                  CONNECT WALLET
                </button>
                {connectionError && (
                  <div className="mt-2 bg-red-900/20 border border-red-400/30 rounded-lg p-2">
                    <div className="text-red-400 font-mono text-xs">
                      {connectionError}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
