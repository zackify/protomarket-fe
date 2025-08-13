import React, { useState } from "react";
import {
  useWaitForTransactionReceipt,
  useWriteContract,
  useAccount,
} from "wagmi";
import { abi } from "../config/abi";
import { monadTestnet } from "wagmi/chains";
import { coins, type Coin } from "../models/coins";
import { Dropdown, type DropdownOption } from "./Dropdown";
import { useAppContext } from "../contexts/AppContext";

export function CreateEventComponent() {
  const { isConnected } = useAccount();
  const { selectedChain, address } = useAppContext();
  const chainId = selectedChain.id;

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [outcomeA, setOutcomeA] = useState("");
  const [outcomeB, setOutcomeB] = useState("");
  const [feePercent, setFeePercent] = useState(0);
  const [selectedToken, setSelectedToken] = useState("");
  const [startDate, setStartDate] = useState("");

  const {
    data: hash,
    writeContract,
    isPending,
    error: writeError,
    isError: isWriteError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  // Get available coins for current chain
  const availableCoins = coins[chainId] || [];

  // Set default to first available token for current network
  React.useEffect(() => {
    if (availableCoins.length > 0) {
      // Always set to first token when chain changes
      setSelectedToken(availableCoins[0]?.address || "");
    } else {
      // Clear selection if no tokens available for this chain
      setSelectedToken("");
    }
  }, [chainId, availableCoins]); // Depend on both chainId and availableCoins

  // Create dropdown options for tokens
  const tokenOptions: DropdownOption[] = availableCoins.map((coin: Coin) => ({
    value: coin.address,
    label: coin.name,
    icon: <img src={coin.logo} alt={coin.name} className="w-5 h-5" />,
  }));

  const createEvent = async () => {
    if (!outcomeA.trim() || !outcomeB.trim()) {
      alert("Please enter both outcomes");
      return;
    }

    if (!selectedToken) {
      alert("Please select an accepted token");
      return;
    }

    if (!startDate) {
      alert("Please select a start date and time");
      return;
    }

    try {
      // Convert datetime-local to UTC seconds
      const startTimeUTC = BigInt(
        Math.floor(new Date(startDate).getTime() / 1000)
      );

      const result = writeContract({
        address,
        abi,
        functionName: "createEvents",
        chainId: selectedChain.id,
        args: [
          [
            {
              title: title.trim(),
              outcomeA: outcomeA.trim(),
              outcomeB: outcomeB.trim(),
              startTime: startTimeUTC,
              creatorFeePercent: BigInt(feePercent),
              acceptedToken: selectedToken as `0x${string}`,
            },
          ],
        ],
      });

      console.log("WriteContract called, result:", result);
    } catch (error) {
      console.error("WriteContract error:", error);
    }
  };

  const resetForm = () => {
    setOutcomeA("");
    setOutcomeB("");
    setFeePercent(0);
    setStartDate("");
    // Keep selected token as default
  };

  React.useEffect(() => {
    if (isConfirmed) {
      resetForm();
      setIsFormOpen(false); // Close form after successful creation
    }
  }, [isConfirmed]);

  return (
    <div className="bg-gray-900/30 rounded-lg p-6 border border-green-400/20">
      <div className={isFormOpen ? "mb-6" : "mb-0"}>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-4 py-2 bg-green-400/10 text-green-400 border border-green-400/30 rounded-lg hover:bg-green-400/20 hover:border-green-400/50 transition-all duration-200 font-mono text-sm font-semibold"
        >
          {isFormOpen ? "Cancel" : "Create Event"}
        </button>
      </div>

      {isFormOpen && (
        <div className="space-y-4">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-mono text-green-400 mb-2">
              EVENT NAME
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event name..."
              className="w-full px-4 py-3 bg-gray-800 border border-green-400/20 rounded-lg text-white font-mono text-sm placeholder-gray-500 focus:outline-none focus:border-green-400/50 focus:ring-1 focus:ring-green-400/20"
              maxLength={100}
            />
          </div>

          {/* Outcome A Input */}
          <div>
            <label className="block text-sm font-mono text-green-400 mb-2">
              OUTCOME A
            </label>
            <input
              type="text"
              value={outcomeA}
              onChange={(e) => setOutcomeA(e.target.value)}
              placeholder="Enter first possible outcome..."
              className="w-full px-4 py-3 bg-gray-800 border border-green-400/20 rounded-lg text-white font-mono text-sm placeholder-gray-500 focus:outline-none focus:border-green-400/50 focus:ring-1 focus:ring-green-400/20"
              maxLength={50}
            />
          </div>

          {/* Outcome B Input */}
          <div>
            <label className="block text-sm font-mono text-green-400 mb-2">
              OUTCOME B
            </label>
            <input
              type="text"
              value={outcomeB}
              onChange={(e) => setOutcomeB(e.target.value)}
              placeholder="Enter second possible outcome..."
              className="w-full px-4 py-3 bg-gray-800 border border-green-400/20 rounded-lg text-white font-mono text-sm placeholder-gray-500 focus:outline-none focus:border-green-400/50 focus:ring-1 focus:ring-green-400/20"
              maxLength={50}
            />
          </div>

          {/* Fee Percent Input */}
          <div>
            <label className="block text-sm font-mono text-green-400 mb-2">
              CREATOR FEE (%)
            </label>
            <input
              type="number"
              value={feePercent}
              onChange={(e) => setFeePercent(Number(e.target.value))}
              min="0"
              max="25"
              className="w-full px-4 py-3 bg-gray-800 border border-green-400/20 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-green-400/50 focus:ring-1 focus:ring-green-400/20"
            />
            <p className="text-xs text-gray-500 mt-1 font-mono">
              Default: 0% (0-25% allowed)
            </p>
          </div>

          {/* Start Date Input */}
          <div>
            <label className="block text-sm font-mono text-green-400 mb-2">
              START DATE & TIME
            </label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-green-400/20 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-green-400/50 focus:ring-1 focus:ring-green-400/20"
            />
            <p className="text-xs text-gray-500 mt-1 font-mono">
              Event will start at the specified time
            </p>
          </div>

          {/* Token Selection */}
          <div>
            <label className="block text-sm font-mono text-green-400 mb-2">
              ACCEPTED TOKEN
            </label>
            <Dropdown
              options={tokenOptions}
              selectedValue={selectedToken}
              onSelect={setSelectedToken}
              placeholder="Select token..."
              className="w-full"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              onClick={createEvent}
              disabled={
                isPending ||
                !isConnected ||
                !outcomeA.trim() ||
                !outcomeB.trim()
              }
              className="w-full px-6 py-3 bg-green-400/10 text-green-400 border border-green-400/30 rounded-lg hover:bg-green-400/20 hover:border-green-400/50 transition-all duration-200 font-mono text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-green-400/20"
            >
              {isPending ? "CREATING EVENT..." : "CREATE EVENT"}
            </button>
          </div>

          {/* Transaction Status */}
          {hash && (
            <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4">
              <div className="text-blue-400 font-mono text-sm">
                Transaction Hash: <br />
                <span className="text-xs break-all">{hash}</span>
              </div>
            </div>
          )}

          {isConfirming && (
            <div className="bg-yellow-900/20 border border-yellow-400/30 rounded-lg p-4">
              <div className="text-yellow-400 font-mono text-sm animate-pulse">
                Waiting for confirmation...
              </div>
            </div>
          )}

          {isConfirmed && (
            <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-4">
              <div className="text-green-400 font-mono text-sm">
                Event created successfully! 🎉
              </div>
            </div>
          )}

          {isWriteError && writeError && (
            <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-4">
              <div className="text-red-400 font-mono text-sm">
                Error: {writeError.message}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
