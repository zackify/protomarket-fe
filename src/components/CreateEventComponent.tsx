import {
  useWaitForTransactionReceipt,
  useChainId,
  useSwitchChain,
  useWriteContract,
  useAccount,
} from "wagmi";
import { abi } from "../models/abi";
import { monadTestnet } from "wagmi/chains";

export function CreateEventComponent() {
  const { isConnected } = useAccount();
  const { switchChain } = useSwitchChain();

  const {
    data: hash,
    writeContract,
    isPending,
    error: writeError,
    isError: isWriteError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const createEvent = async () => {
    // we should call this directly in the menu bar when loading the website.
    // phantom wallet will ask to switch to the correct chain.
    await switchChain({ chainId: monadTestnet.id });

    try {
      const result = writeContract({
        address: "0x792a00E52B858E913d20B364D06CF89865Ad3f9b",
        abi: abi,
        functionName: "createEvents",
        chainId: monadTestnet.id,
        args: [
          [
            {
              outcomeA: "Team trio wins",
              outcomeB: "Team dual wins",
              startTime: 1756674800n,
              creatorFeePercent: 5n,
              acceptedToken: "0x0000000000000000000000000000000000000000",
            },
          ],
        ],
      });

      console.log("WriteContract called, result:", result);
    } catch (error) {
      console.error("WriteContract error:", error);
    }
  };

  return (
    <div>
      <button onClick={createEvent} disabled={isPending || !isConnected}>
        {isPending ? "Creating Event..." : "Create Event"}
      </button>

      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Event created successfully!</div>}
    </div>
  );
}
