import React, { useState } from "react";
import {
  useReadProtomarketEvents,
  useReadProtomarketGetEventCount,
  useReadProtomarketGetEventsRange,
  useReadProtomarketPredictions,
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
import { PredictionsView } from "./PredictionsView";

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

// Place Bet component for betting on outcomes
const PlaceBet: React.FC<{
  eventIndex: number;
  outcomeA: string;
  outcomeB: string;
  selectedOutcome: number;
  acceptedToken: string;
  onClose: () => void;
}> = ({
  eventIndex,
  outcomeA,
  outcomeB,
  selectedOutcome,
  acceptedToken,
  onClose,
}) => {
  const chainId = useChainId();
  const availableCoins = coins[chainId] || [];
  const tokenInfo = availableCoins.find(
    (coin) => coin.address.toLowerCase() === acceptedToken.toLowerCase()
  );
  const [betAmount, setBetAmount] = useState("");
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

  // Fetch first 2 predictions to find opposite side matches
  const prediction0 = useReadProtomarketPredictions({
    args: [BigInt(eventIndex), 0n],
  });
  const prediction1 = useReadProtomarketPredictions({
    args: [BigInt(eventIndex), 1n],
  });

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

  // Filter predictions that are unmatched and chose the opposite outcome
  const oppositeOutcome = selectedOutcome === 0 ? 1 : 0;
  const matchablePredictions: Array<{
    amount: bigint;
    playerA: string;
    outcomeA: number;
    outcomeB: number;
    playerB: string;
    index: number;
  }> = [];

  [prediction0, prediction1].forEach((pred, index) => {
    if (pred?.data && pred.data[0] > 0n) {
      const isUnmatched =
        !pred.data[4] ||
        pred.data[4] === "0x0000000000000000000000000000000000000000";
      const isOppositeOutcome = Number(pred.data[2]) === oppositeOutcome;
      const isNotSameUser =
        address && pred.data[1].toLowerCase() !== address.toLowerCase();

      if (isUnmatched && isOppositeOutcome && isNotSameUser) {
        matchablePredictions.push({
          amount: pred.data[0],
          playerA: pred.data[1],
          outcomeA: pred.data[2],
          outcomeB: pred.data[3],
          playerB: pred.data[4],
          index: index,
        });
      }
    }
  });

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
            PLACE BET
          </h3>
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
            BET AMOUNT ({tokenInfo?.symbol || "TOKEN"})
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
            Minimum: 0.001 {tokenInfo?.symbol || "TOKEN"}
          </p>
        </div>

        {/* Matchable Predictions Section */}
        {matchablePredictions.length > 0 && (
          <div className="mb-6 @container">
            <h4 className="text-sm font-mono text-green-400 mb-3">
              OR MATCH EXISTING PREDICTIONS
            </h4>
            <div className="space-y-2">
              {matchablePredictions.map((prediction, index) => {
                const outcomeNames = [outcomeA, outcomeB];
                const playerOutcome = outcomeNames[Number(prediction.outcomeA)];

                return (
                  <div key={index} className="bg-gray-700/30 rounded-lg p-3">
                    <div className="flex flex-col @md:flex-row @md:items-center @md:justify-between space-y-2 @md:space-y-0">
                      <div className="flex flex-col @md:flex-row @md:items-center space-y-1 @md:space-y-0 @md:space-x-2">
                        <CreatorDisplay address={prediction.playerA} />
                        <div className="flex items-center justify-between @md:justify-start space-x-2">
                          <span className="text-blue-400 text-xs font-mono bg-blue-900/20 px-2 py-1 rounded w-fit">
                            {playerOutcome}
                          </span>
                          <button
                            onClick={() =>
                              matchPrediction(prediction.index, prediction.amount)
                            }
                            disabled={isPending}
                            className="px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-400/30 rounded hover:bg-purple-500/20 hover:border-purple-400/50 transition-all duration-200 font-mono text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isPending ? "MATCHING..." : `BET ${outcomeNames[1 - Number(prediction.outcomeA)]}`}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-end @md:justify-start space-x-2">
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
                );
              })}
            </div>
          </div>
        )}

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

// EventItem component for individual event display
const EventItem: React.FC<{
  event: any;
  eventIndex: number;
  onBetClick: (
    eventIndex: number,
    outcomeA: string,
    outcomeB: string,
    selectedOutcome: number
  ) => void;
  userAddress?: string;
}> = ({ event, eventIndex, onBetClick, userAddress }) => {
  const chainId = useChainId();
  const availableCoins = coins[chainId] || [];
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showPredictions, setShowPredictions] = useState(false);

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

  // Helper function to get token info
  const getTokenInfo = (tokenAddress: string) => {
    return availableCoins.find(
      (coin) => coin.address.toLowerCase() === tokenAddress.toLowerCase()
    );
  };

  // Helper function to format timestamp to time distance
  const formatStartTime = (value: any): string => {
    try {
      const timestamp =
        typeof value === "bigint" ? Number(value) * 1000 : Number(value) * 1000;
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return String(value);
    }
  };

  const outcomeA = parseBytes32ToText(event.outcomeA);
  const outcomeB = parseBytes32ToText(event.outcomeB);
  const startTime = formatStartTime(event.startTime);
  const tokenInfo = getTokenInfo(event.acceptedToken);

  if (showPredictions) {
    return (
      <PredictionsView
        eventIndex={eventIndex}
        eventData={event}
        onBack={() => setShowPredictions(false)}
      />
    );
  }

  return (
    <>
      <div className="bg-gray-800/50 rounded-lg p-4 border border-green-400/10">
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-start sm:justify-between sm:space-y-0 mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-green-400 font-mono text-sm break-words">
                STARTS {startTime.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="text-xs text-gray-400 font-mono bg-gray-700/30 px-2 py-1 rounded flex items-center space-x-2 w-fit">
            <span className="whitespace-nowrap">
              {event.creatorFeePercent}% fee
            </span>
            {tokenInfo && (
              <div className="flex items-center space-x-1">
                <img
                  src={tokenInfo.logo}
                  alt={tokenInfo.name}
                  className="w-3 h-3 flex-shrink-0"
                />
                <span className="text-gray-400 whitespace-nowrap">
                  {tokenInfo.name}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div
            onClick={() => onBetClick(eventIndex, outcomeA, outcomeB, 0)}
            className="bg-blue-900/20 border border-blue-400/20 rounded px-3 py-3 cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-blue-900/30 hover:border-blue-400/40 hover:shadow-lg hover:shadow-blue-400/20"
          >
            <div className="text-white break-words">{outcomeA}</div>
          </div>
          <div
            onClick={() => onBetClick(eventIndex, outcomeA, outcomeB, 1)}
            className="bg-purple-900/20 border border-purple-400/20 rounded px-3 py-3 cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-purple-900/30 hover:border-purple-400/40 hover:shadow-lg hover:shadow-purple-400/20"
          >
            <div className="text-white break-words">{outcomeB}</div>
          </div>
        </div>

        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 text-xs text-gray-400 font-mono mt-4">
          <div className="flex items-center justify-between sm:justify-start space-x-2">
            <button
              onClick={() => setShowPredictions(true)}
              className="px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-400/30 rounded hover:bg-blue-500/20 hover:border-blue-400/50 transition-all duration-200 font-mono text-xs font-semibold sm:inline hidden"
            >
              VIEW PREDICTIONS
            </button>
            <span className="text-xs text-gray-500 bg-gray-700/50 px-2 py-1 rounded w-fit">
              {event.status === 0
                ? "PENDING"
                : event.status === 1
                  ? "ACTIVE"
                  : "RESOLVED"}
            </span>
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
            <div className="flex items-center space-x-2 bg-gray-700/30 px-2 py-1 rounded">
              <span className="text-gray-500 whitespace-nowrap">Creator:</span>
              {event.creator ? (
                <CreatorDisplay address={event.creator} />
              ) : (
                <span className="text-green-400">N/A</span>
              )}
            </div>
            {event.creator &&
              userAddress &&
              event.creator.toLowerCase() === userAddress.toLowerCase() && (
                <button
                  onClick={() => setShowGradeModal(true)}
                  className="px-3 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-400/30 rounded hover:bg-yellow-500/20 hover:border-yellow-400/50 transition-all duration-200 font-mono text-xs font-semibold w-full sm:w-auto"
                >
                  GRADE
                </button>
              )}
          </div>
        </div>

        {/* View Predictions Button - Mobile Full Width */}
        <div className="sm:hidden mt-2">
          <button
            onClick={() => setShowPredictions(true)}
            className="w-full px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-400/30 rounded hover:bg-blue-500/20 hover:border-blue-400/50 transition-all duration-200 font-mono text-xs font-semibold"
          >
            VIEW PREDICTIONS
          </button>
        </div>
      </div>

      {/* Grade Event Modal */}
      {showGradeModal && (
        <GradeEvent
          eventIndex={eventIndex}
          outcomeA={outcomeA}
          outcomeB={outcomeB}
          onClose={() => setShowGradeModal(false)}
        />
      )}
    </>
  );
};

export function ViewEvents() {
  const { address } = useAccount();

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
          ? eventsRange.data.map((event, index) => (
              <EventItem
                key={index}
                event={event}
                eventIndex={index}
                userAddress={address}
                onBetClick={(
                  eventIndex,
                  outcomeA,
                  outcomeB,
                  selectedOutcome
                ) => {
                  setBettingEventIndex(eventIndex);
                  setBettingOutcomes({ outcomeA, outcomeB });
                  setSelectedBetOutcome(selectedOutcome);
                }}
              />
            ))
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
            acceptedToken={
              eventsRange.data?.[bettingEventIndex]?.acceptedToken || ""
            }
            onClose={() => {
              setBettingEventIndex(null);
              setBettingOutcomes(null);
              setSelectedBetOutcome(null);
            }}
          />
        )}
    </div>
  );
}
