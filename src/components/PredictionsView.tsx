import React, { useState } from "react";
import { useReadProtomarketPredictions } from "../generated";
import { hexToString } from "viem";
import {
  useChainId,
  useEnsName,
  useEnsAvatar,
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { mainnet, monadTestnet } from "wagmi/chains";
import { coins } from "../models/coins";
import { abi } from "../models/abi";

// Creator display component with ENS support
const CreatorDisplay: React.FC<{ address: string }> = ({ address }) => {
  const { data: ensName, isLoading: ensNameLoading } = useEnsName({
    address: address as `0x${string}`,
    chainId: mainnet.id,
  });
  const { data: ensAvatar } = useEnsAvatar({
    name: ensName || undefined,
    chainId: mainnet.id,
  });

  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "N/A";

  return (
    <div className="flex items-center space-x-2">
      {ensNameLoading ? (
        <div className="w-4 h-4"></div>
      ) : ensAvatar ? (
        <img
          src={ensAvatar}
          alt="ENS Avatar"
          className="w-4 h-4 min-w-[1rem] min-h-[1rem] rounded-full"
        />
      ) : null}
      <span className="text-green-400 min-w-[70px] min-h-[0.75rem]">
        {ensNameLoading ? "" : ensName || truncatedAddress}
      </span>
    </div>
  );
};

// PredictionsView component to show all predictions for a specific event
export const PredictionsView: React.FC<{
  eventIndex: number;
  eventData: any;
  onBack: () => void;
}> = ({ eventIndex, eventData, onBack }) => {
  const chainId = useChainId();
  const availableCoins = coins[chainId] || [];
  const [predictions, setPredictions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { address } = useAccount();

  const {
    data: hash,
    writeContract,
    isPending,
    error: writeError,
    isError: isWriteError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  // Helper function to get token info
  const getTokenInfo = (tokenAddress: string) => {
    return availableCoins.find(
      (coin) => coin.address.toLowerCase() === tokenAddress.toLowerCase()
    );
  };

  // Helper function to parse bytes32 to text
  const parseBytes32ToText = (value: any): string => {
    try {
      if (typeof value === "string" && value.startsWith("0x")) {
        return hexToString(value as `0x${string}`);
      }
      return String(value);
    } catch (error) {
      return String(value);
    }
  };

  const outcomeA = parseBytes32ToText(eventData.outcomeA);
  const outcomeB = parseBytes32ToText(eventData.outcomeB);
  const tokenInfo = getTokenInfo(eventData.acceptedToken);

  // Fetch predictions for multiple indices (0-4 should be enough for most cases)
  const prediction0 = useReadProtomarketPredictions({
    args: [BigInt(eventIndex), 0n],
  });
  const prediction1 = useReadProtomarketPredictions({
    args: [BigInt(eventIndex), 1n],
  });
  const prediction2 = useReadProtomarketPredictions({
    args: [BigInt(eventIndex), 2n],
  });
  const prediction3 = useReadProtomarketPredictions({
    args: [BigInt(eventIndex), 3n],
  });
  const prediction4 = useReadProtomarketPredictions({
    args: [BigInt(eventIndex), 4n],
  });

  const matchPrediction = async (predictionIndex: number, amount: bigint) => {
    try {
      writeContract({
        address: "0x792a00E52B858E913d20B364D06CF89865Ad3f9b",
        abi: abi,
        functionName: "matchPrediction",
        chainId: monadTestnet.id,
        args: [BigInt(eventIndex), BigInt(predictionIndex)],
        value: amount,
      });
    } catch (error) {
      console.error("Match prediction error:", error);
    }
  };

  React.useEffect(() => {
    const allPredictions = [
      prediction0,
      prediction1,
      prediction2,
      prediction3,
      prediction4,
    ];
    const loadedPredictions = [];

    for (let i = 0; i < allPredictions.length; i++) {
      const pred = allPredictions[i];
      if (pred?.data && pred.data[0] > 0n) {
        // Check if amount is greater than 0
        loadedPredictions.push({
          amount: pred.data[0],
          playerA: pred.data[1],
          outcomeA: pred.data[2],
          outcomeB: pred.data[3],
          playerB: pred.data[4],
          index: i, // Store the prediction index
        });
      }
    }

    setPredictions(loadedPredictions);
    setIsLoading(allPredictions.some((pred) => pred.isLoading));
  }, [
    prediction0.data,
    prediction1.data,
    prediction2.data,
    prediction3.data,
    prediction4.data,
    prediction0.isLoading,
    prediction1.isLoading,
    prediction2.isLoading,
    prediction3.isLoading,
    prediction4.isLoading,
  ]);

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 border border-green-400/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-green-400 font-sharetech tracking-wider uppercase">
          Predictions
        </h3>
        <button
          onClick={onBack}
          className="px-3 py-1 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors font-mono text-xs"
        >
          BACK
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="text-green-400 font-mono animate-pulse">
            LOADING PREDICTIONS...
          </div>
        </div>
      ) : predictions.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 font-mono">
            No predictions found for this event
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Matched Predictions */}
          {predictions.some(
            (p) =>
              p.playerB &&
              p.playerB !== "0x0000000000000000000000000000000000000000"
          ) && (
            <div>
              <h4 className="text-md font-bold text-green-400 font-sharetech tracking-wider uppercase mb-3">
                MATCHED PREDICTIONS
              </h4>
              <div className="space-y-3">
                {predictions
                  .filter(
                    (p) =>
                      p.playerB &&
                      p.playerB !== "0x0000000000000000000000000000000000000000"
                  )
                  .map((prediction, index) => {
                    const outcomeNames = [outcomeA, outcomeB];
                    const playerAOutcome =
                      outcomeNames[Number(prediction.outcomeA)];
                    const playerBOutcome =
                      outcomeNames[Number(prediction.outcomeB)];

                    return (
                      <div
                        key={index}
                        className="bg-gray-700/30 rounded-lg p-3"
                      >
                        <div className="flex flex-col space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                                <CreatorDisplay address={prediction.playerA} />
                                <span className="text-blue-400 text-xs font-mono bg-blue-900/20 px-2 py-1 rounded w-fit">
                                  {playerAOutcome}
                                </span>
                              </div>
                              <span className="text-gray-400 text-xs font-mono hidden sm:inline">
                                vs
                              </span>
                              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                                <CreatorDisplay address={prediction.playerB} />
                                <span className="text-purple-400 text-xs font-mono bg-purple-900/20 px-2 py-1 rounded w-fit">
                                  {playerBOutcome}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-white font-mono text-sm">
                                {(Number(prediction.amount) / 1e18).toFixed(4)}
                              </span>
                              {tokenInfo && (
                                <div className="flex items-center space-x-1">
                                  <img
                                    src={tokenInfo.logo}
                                    alt={tokenInfo.name}
                                    className="w-4 h-4"
                                  />
                                  <span className="text-gray-400 text-xs">
                                    {tokenInfo.symbol}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Unmatched Predictions */}
          {predictions.some(
            (p) =>
              !p.playerB ||
              p.playerB === "0x0000000000000000000000000000000000000000"
          ) && (
            <div>
              <h4 className="text-md font-bold text-green-400 font-sharetech tracking-wider uppercase mb-3">
                UNMATCHED PREDICTIONS
              </h4>
              <div className="space-y-3">
                {predictions
                  .filter(
                    (p) =>
                      !p.playerB ||
                      p.playerB === "0x0000000000000000000000000000000000000000"
                  )
                  .map((prediction, index) => {
                    const outcomeNames = [outcomeA, outcomeB];
                    const playerAOutcome =
                      outcomeNames[Number(prediction.outcomeA)];

                    return (
                      <div
                        key={index}
                        className="bg-gray-700/30 rounded-lg p-3"
                      >
                        <div className="flex flex-col space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                              <CreatorDisplay address={prediction.playerA} />
                              <div className="flex items-center justify-between sm:justify-start space-x-2">
                                <span className="text-blue-400 text-xs font-mono bg-blue-900/20 px-2 py-1 rounded w-fit">
                                  {playerAOutcome}
                                </span>
                                {!(address && address.toLowerCase() !== prediction.playerA.toLowerCase()) && (
                                  <span className="text-gray-500 text-xs font-mono bg-gray-600/20 px-2 py-1 rounded">
                                    Waiting for match
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center justify-end sm:justify-start space-x-2">
                              <span className="text-white font-mono text-sm">
                                {(Number(prediction.amount) / 1e18).toFixed(4)}
                              </span>
                              {tokenInfo && (
                                <div className="flex items-center space-x-1">
                                  <img
                                    src={tokenInfo.logo}
                                    alt={tokenInfo.name}
                                    className="w-4 h-4"
                                  />
                                  <span className="text-gray-400 text-xs">
                                    {tokenInfo.symbol}
                                  </span>
                                </div>
                              )}
                              {address &&
                              address.toLowerCase() !==
                                prediction.playerA.toLowerCase() && (
                                <button
                                  onClick={() =>
                                    matchPrediction(
                                      prediction.index,
                                      prediction.amount
                                    )
                                  }
                                  disabled={isPending}
                                  className="px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-400/30 rounded hover:bg-purple-500/20 hover:border-purple-400/50 transition-all duration-200 font-mono text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isPending
                                    ? "BETTING..."
                                    : `BET ${outcomeNames[1 - Number(prediction.outcomeA)]}`}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Transaction Status */}
      {hash && (
        <div className="mt-4 bg-blue-900/20 border border-blue-400/30 rounded-lg p-3">
          <div className="text-blue-400 font-mono text-xs">
            Transaction: {hash.slice(0, 10)}...{hash.slice(-8)}
          </div>
        </div>
      )}

      {isConfirming && (
        <div className="mt-4 bg-yellow-900/20 border border-yellow-400/30 rounded-lg p-3">
          <div className="text-yellow-400 font-mono text-xs animate-pulse">
            Confirming transaction...
          </div>
        </div>
      )}

      {isConfirmed && (
        <div className="mt-4 bg-green-900/20 border border-green-400/30 rounded-lg p-3">
          <div className="text-green-400 font-mono text-xs">
            Prediction matched successfully! 🎉
          </div>
        </div>
      )}

      {isWriteError && writeError && (
        <div className="mt-4 bg-red-900/20 border border-red-400/30 rounded-lg p-3">
          <div className="text-red-400 font-mono text-xs">
            Error: {writeError.message}
          </div>
        </div>
      )}
    </div>
  );
};
