import { useWaitForTransactionReceipt } from "wagmi";
import { useWriteProtomarketCreateEvents } from "../generated";

export function CreateEventComponent() {
  const {
    data: hash,
    writeContract,
    isPending,
  } = useWriteProtomarketCreateEvents();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  //if !formdata: EventData[] return // ALSO FORM SHOULD NOT SUBMIT IF EMPTY ARRAY SUBMITTED

  const createEvent = () => {
    writeContract({
      args: [
        [
          {
            outcomeA: "Team A Wins",
            outcomeB: "Team B Wins",
            startTime: 1756684800n,
            creatorFeePercent: 5n,
            acceptedToken: "0x0000000000000000000000000000000000000000",
          },
        ],
      ],
    });
  };

  // BUG: Event attempting to be created with ETH.
  return (
    <div>
      <button onClick={createEvent} disabled={isPending}>
        {isPending ? "Creating Event..." : "Create Event"}
      </button>

      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Event created successfully!</div>}
    </div>
  );
}
