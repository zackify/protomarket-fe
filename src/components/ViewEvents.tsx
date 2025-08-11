import React, { useState } from "react";
import {
  useReadProtomarketEvents,
  useReadProtomarketGetEventCount,
  useReadProtomarketGetEventsRange,
} from "../generated";
import { hexToString } from "viem";
import { formatDistanceToNow } from "date-fns";
import {
  useChainId,
  useEnsName,
  useEnsAvatar,
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { monadTestnet, mainnet } from "wagmi/chains";
import { abi } from "../models/abi";
import { coins } from "../models/coins";

// Creator display component with ENS support
const CreatorDisplay: React.FC<{ address: string }> = ({ address }) => {
  const { data: ensName } = useEnsName({
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
      {ensAvatar && (
        <img
          src={ensAvatar}
          alt="ENS Avatar"
          className="w-4 h-4 rounded-full"
        />
      )}
      <span className="text-green-400">{ensName || truncatedAddress}</span>
    </div>
  );
};

// Place Bet component for betting on outcomes
const PlaceBet: React.FC<{
  eventIndex: number;
  outcomeA: string;
  outcomeB: string;
  selectedOutcome: number;
  acceptedToken: string;
  onClose: () => void;
}> = ({ eventIndex, outcomeA, outcomeB, selectedOutcome, acceptedToken, onClose }) => {
  const chainId = useChainId();
  const availableCoins = coins[chainId] || [];
  const tokenInfo = availableCoins.find(coin => coin.address.toLowerCase() === acceptedToken.toLowerCase());
  const [betAmount, setBetAmount] = useState("");

  const {
    data: hash,
    writeContract,
    isPending,
    error: writeError,
    isError: isWriteError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const placeBet = async () => {
    if (!betAmount || parseFloat(betAmount) <= 0) {
      alert("Please enter a valid bet amount");
      return;
    }

    try {
      // Convert to wei (assuming 18 decimals)
      const amountWei = BigInt(Math.floor(parseFloat(betAmount) * 1e18));

      writeContract({
        address: "0x792a00E52B858E913d20B364D06CF89865Ad3f9b",
        abi: abi,
        functionName: "placePrediction",
        chainId: monadTestnet.id,
        args: [BigInt(eventIndex), selectedOutcome, amountWei],
        value: amountWei,
      });
    } catch (error) {
      console.error("Place bet error:", error);
    }
  };

  React.useEffect(() => {
    if (isConfirmed) {
      onClose();
    }
  }, [isConfirmed, onClose]);

  const outcomes = [outcomeA, outcomeB];
  const colors = ["blue", "purple"];
  const currentColor = colors[selectedOutcome];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 border border-green-400/30 max-w-md w-full mx-4">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-green-400 font-sharetech tracking-wider uppercase mb-2">
            PLACE BET - EVENT #{eventIndex}
          </h3>
          <p className="text-gray-300 font-mono text-sm">You're betting on:</p>
        </div>

        {/* Selected Outcome Display */}
        <div className="mb-6">
          <div
            className={`w-full p-4 rounded-lg border-2 ${
              currentColor === "blue"
                ? "bg-blue-900/40 border-blue-400/60"
                : "bg-purple-900/40 border-purple-400/60"
            }`}
          >
            <div
              className={`text-xs font-mono mb-1 ${
                currentColor === "blue" ? "text-blue-400" : "text-purple-400"
              }`}
            >
              {selectedOutcome === 0 ? "OUTCOME A:" : "OUTCOME B:"}
            </div>
            <div className="text-white font-semibold">
              {outcomes[selectedOutcome]}
            </div>
          </div>
        </div>

        {/* Bet Amount Input */}
        <div className="mb-6">
          <label className="block text-sm font-mono text-green-400 mb-2">
            BET AMOUNT ({tokenInfo?.symbol || 'TOKEN'})
          </label>
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            placeholder="0.1"
            step="0.001"
            min="0"
            className="w-full px-4 py-3 bg-gray-800 border border-green-400/20 rounded-lg text-white font-mono text-sm placeholder-gray-500 focus:outline-none focus:border-green-400/50 focus:ring-1 focus:ring-green-400/20"
          />
          <p className="text-xs text-gray-500 mt-1 font-mono">
            Minimum: 0.001 {tokenInfo?.symbol || 'TOKEN'}
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors font-mono text-sm"
          >
            Cancel
          </button>
          <button
            onClick={placeBet}
            disabled={isPending || !betAmount || parseFloat(betAmount) <= 0}
            className="flex-1 px-4 py-2 bg-green-400/10 text-green-400 border border-green-400/30 rounded-lg hover:bg-green-400/20 hover:border-green-400/50 transition-all duration-200 font-mono text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "PLACING BET..." : "PLACE BET"}
          </button>
        </div>

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
              Bet placed successfully! 🎉
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
    </div>
  );
};

// Grade Event component for creators to resolve events
const GradeEvent: React.FC<{
  eventIndex: number;
  outcomeA: string;
  outcomeB: string;
  onClose: () => void;
}> = ({ eventIndex, outcomeA, outcomeB, onClose }) => {
  const [selectedOutcome, setSelectedOutcome] = useState<number | null>(null);

  const {
    data: hash,
    writeContract,
    isPending,
    error: writeError,
    isError: isWriteError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const resolveEvent = async () => {
    if (selectedOutcome === null) {
      alert("Please select the winning outcome");
      return;
    }

    try {
      writeContract({
        address: "0x792a00E52B858E913d20B364D06CF89865Ad3f9b",
        abi: abi,
        functionName: "resolveEvent",
        chainId: monadTestnet.id,
        args: [BigInt(eventIndex), selectedOutcome],
      });
    } catch (error) {
      console.error("Resolve event error:", error);
    }
  };

  React.useEffect(() => {
    if (isConfirmed) {
      onClose();
    }
  }, [isConfirmed, onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 border border-green-400/30 max-w-md w-full mx-4">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-green-400 font-sharetech tracking-wider uppercase mb-2">
            GRADE EVENT #{eventIndex}
          </h3>
          <p className="text-gray-300 font-mono text-sm">
            Select the winning outcome to resolve this event:
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <button
            onClick={() => setSelectedOutcome(0)}
            className={`w-full p-4 rounded-lg border-2 transition-all duration-200 font-mono text-left ${
              selectedOutcome === 0
                ? "bg-blue-900/40 border-blue-400/60 text-blue-300"
                : "bg-blue-900/20 border-blue-400/20 text-blue-400 hover:bg-blue-900/30 hover:border-blue-400/40"
            }`}
          >
            <div className="text-xs font-mono text-blue-400 mb-1">
              OUTCOME A WINS:
            </div>
            <div className="text-white">{outcomeA}</div>
          </button>

          <button
            onClick={() => setSelectedOutcome(1)}
            className={`w-full p-4 rounded-lg border-2 transition-all duration-200 font-mono text-left ${
              selectedOutcome === 1
                ? "bg-purple-900/40 border-purple-400/60 text-purple-300"
                : "bg-purple-900/20 border-purple-400/20 text-purple-400 hover:bg-purple-900/30 hover:border-purple-400/40"
            }`}
          >
            <div className="text-xs font-mono text-purple-400 mb-1">
              OUTCOME B WINS:
            </div>
            <div className="text-white">{outcomeB}</div>
          </button>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors font-mono text-sm"
          >
            Cancel
          </button>
          <button
            onClick={resolveEvent}
            disabled={isPending || selectedOutcome === null}
            className="flex-1 px-4 py-2 bg-green-400/10 text-green-400 border border-green-400/30 rounded-lg hover:bg-green-400/20 hover:border-green-400/50 transition-all duration-200 font-mono text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "RESOLVING..." : "RESOLVE EVENT"}
          </button>
        </div>

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
              Event resolved successfully! 🎉
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
    </div>
  );
};

export function ViewEvents() {
  const { address } = useAccount();
  const chainId = useChainId();
  const availableCoins = coins[chainId] || [];
  const [gradingEventIndex, setGradingEventIndex] = useState<number | null>(
    null
  );
  const [gradingOutcomes, setGradingOutcomes] = useState<{
    outcomeA: string;
    outcomeB: string;
  } | null>(null);

  // Betting state
  const [bettingEventIndex, setBettingEventIndex] = useState<number | null>(
    null
  );
  const [bettingOutcomes, setBettingOutcomes] = useState<{
    outcomeA: string;
    outcomeB: string;
  } | null>(null);
  const [selectedBetOutcome, setSelectedBetOutcome] = useState<number | null>(
    null
  );

  const events = useReadProtomarketEvents({
    args: [0n],
  });
  const eventCount = useReadProtomarketGetEventCount();

  // Calculate the range to show last 20 events (or all if fewer than 20)
  const startIndex = eventCount.data
    ? Number(eventCount.data) >= 20
      ? BigInt(Number(eventCount.data) - 20)
      : 0n
    : 0n;
  const endIndex = eventCount.data ? eventCount.data : 2n;

  const eventsRange = useReadProtomarketGetEventsRange({
    args: [startIndex, endIndex],
  }); // errors if end arg bigint is greater than total amount of events

  //   console.log(events);
  //   console.log(eventCount);
  //   console.log(eventsRange);

  const isLoading =
    eventCount.isLoading || eventsRange.isLoading || events.isLoading;
  const errors = [events.error, eventCount.error, eventsRange.error];

  // Helper function to parse bytes32 to text
  const parseBytes32ToText = (value: any): string => {
    try {
      if (typeof value === "string" && value.startsWith("0x")) {
        return hexToString(value as `0x${string}`);
      }
      return String(value);
    } catch (error) {
      return String(value); // fallback to original value if parsing fails
    }
  };

  // Helper function to get token info
  const getTokenInfo = (tokenAddress: string) => {
    return availableCoins.find(coin => coin.address.toLowerCase() === tokenAddress.toLowerCase());
  };

  // Helper function to format timestamp to time distance
  const formatStartTime = (value: any): string => {
    try {
      // Convert BigInt timestamp to milliseconds (assuming it's in seconds)
      const timestamp =
        typeof value === "bigint" ? Number(value) * 1000 : Number(value) * 1000;
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return String(value); // fallback to original value if parsing fails
    }
  };

  return (
    <div className="">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-green-400 font-sharetech tracking-wider uppercase">
          UPCOMING EVENTS
        </h2>
        <div className="text-sm text-gray-400 font-mono">
          Total: {eventCount.data?.toString() || "0"}
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <div className="text-green-400 font-mono animate-pulse">
            LOADING EVENTS...
          </div>
        </div>
      )}

      {errors.some((err) => err) && (
        <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-4 mb-4">
          <div className="text-red-400 font-mono text-sm">
            {errors.map((err, index) => {
              if (!err) return null;
              return (
                <div key={index} className="mb-2">
                  Error loading events: {err.message || "Unknown error"}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {eventsRange.data && eventsRange.data.length > 0
          ? eventsRange.data.map((event, index) => {
              const outcomeA = parseBytes32ToText(event.outcomeA);
              const outcomeB = parseBytes32ToText(event.outcomeB);
              const startTime = formatStartTime(event.startTime);

              return (
                <div
                  key={index}
                  className="bg-gray-800/50 rounded-lg p-4 border border-green-400/10"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-green-400 font-mono text-sm">
                          EVENT #{index}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-700/50 px-2 py-1 rounded">
                          {event.status === 0
                            ? "PENDING"
                            : event.status === 1
                              ? "ACTIVE"
                              : "RESOLVED"}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div
                          onClick={() => {
                            setBettingEventIndex(index);
                            setBettingOutcomes({ outcomeA, outcomeB });
                            setSelectedBetOutcome(0);
                          }}
                          className="bg-blue-900/20 border border-blue-400/20 rounded px-3 py-2 cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-blue-900/30 hover:border-blue-400/40 hover:shadow-lg hover:shadow-blue-400/20"
                        >
                          <div className="text-white my-2">{outcomeA}</div>
                        </div>
                        <div
                          onClick={() => {
                            setBettingEventIndex(index);
                            setBettingOutcomes({ outcomeA, outcomeB });
                            setSelectedBetOutcome(1);
                          }}
                          className="bg-purple-900/20 border border-purple-400/20 rounded px-3 py-2 cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-purple-900/30 hover:border-purple-400/40 hover:shadow-lg hover:shadow-purple-400/20"
                        >
                          <div className="text-white my-2">{outcomeB}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                    <div>
                      <span className="text-gray-500">Starts:</span> {startTime}
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">Fee:</span>{" "}
                        {event.creatorFeePercent}%
                        {(() => {
                          const tokenInfo = getTokenInfo(event.acceptedToken);
                          return tokenInfo ? (
                            <div className="flex items-center space-x-1 text-xs">
                              <img src={tokenInfo.logo} alt={tokenInfo.name} className="w-3 h-3" />
                              <span className="text-gray-400">{tokenInfo.name}</span>
                            </div>
                          ) : null;
                        })()}
                      </div>
                      <div className="flex items-center space-x-2 bg-gray-700/30 px-2 py-1 rounded">
                        <span className="text-gray-500">Creator:</span>
                        {event.creator ? (
                          <CreatorDisplay address={event.creator} />
                        ) : (
                          <span className="text-green-400">N/A</span>
                        )}
                        {event.creator &&
                          address &&
                          event.creator.toLowerCase() ===
                            address.toLowerCase() && (
                            <button
                              onClick={() => {
                                setGradingEventIndex(index);
                                setGradingOutcomes({ outcomeA, outcomeB });
                              }}
                              className="ml-2 px-2 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-400/30 rounded hover:bg-yellow-500/20 hover:border-yellow-400/50 transition-all duration-200 font-mono text-xs font-semibold"
                            >
                              GRADE
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          : !isLoading && (
              <div className="text-center py-8">
                <div className="text-gray-500 font-mono">No events found</div>
              </div>
            )}
      </div>

      {/* Place Bet Modal */}
      {bettingEventIndex !== null &&
        bettingOutcomes &&
        selectedBetOutcome !== null && (
          <PlaceBet
            eventIndex={bettingEventIndex}
            outcomeA={bettingOutcomes.outcomeA}
            outcomeB={bettingOutcomes.outcomeB}
            selectedOutcome={selectedBetOutcome}
            acceptedToken={eventsRange.data?.[bettingEventIndex]?.acceptedToken || ''}
            onClose={() => {
              setBettingEventIndex(null);
              setBettingOutcomes(null);
              setSelectedBetOutcome(null);
            }}
          />
        )}

      {/* Grade Event Modal */}
      {gradingEventIndex !== null && gradingOutcomes && (
        <GradeEvent
          eventIndex={gradingEventIndex}
          outcomeA={gradingOutcomes.outcomeA}
          outcomeB={gradingOutcomes.outcomeB}
          onClose={() => {
            setGradingEventIndex(null);
            setGradingOutcomes(null);
          }}
        />
      )}
    </div>
  );
}
