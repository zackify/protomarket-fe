import React from "react";
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

  const { data: ensName } = useEnsName({
    address,
    chainId: mainnet.id,
  });
  const { data: ensAvatar } = useEnsAvatar({
    name: ensName || undefined,
    chainId: mainnet.id,
  });

  const { selectedChain, contractVersion, setContractVersion, switchToChain } =
    useAppContext();

  const contractVersionOptions: DropdownOption[] = [
    { value: "V0", label: "V0" },
  ];

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
      await connect({ connector: injected() });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  return (
    <div className="w-full border-b border-green-400/20 mb-8">
      <div className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-green-400 font-sharetech tracking-widest uppercase">
              PEERBET
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Dropdown
                options={contractVersionOptions}
                selectedValue={contractVersion}
                onSelect={setContractVersion}
                className="w-24"
              />
            </div>

            <div className="flex items-center space-x-3">
              <Dropdown
                options={chainOptions}
                selectedValue={selectedChain.id.toString()}
                onSelect={handleChainChange}
                className="w-50"
              />
            </div>

            {isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-2 border border-green-400/20">
                  {ensAvatar && (
                    <img
                      src={ensAvatar}
                      alt="ENS Avatar"
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span className="text-sm text-green-400 font-mono">
                    {ensName || (address ? formatAddress(address) : "")}
                  </span>
                </div>
                <button
                  onClick={() => disconnect()}
                  className="px-3 py-2 text-xs font-mono text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors border border-red-400/20 hover:border-red-400/40"
                >
                  DISCONNECT
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                className="px-4 py-2 bg-green-400/10 text-green-400 border border-green-400/30 rounded-lg hover:bg-green-400/20 hover:border-green-400/50 transition-all duration-200 font-mono text-sm font-semibold shadow-lg hover:shadow-green-400/20"
              >
                CONNECT WALLET
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
