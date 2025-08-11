import {
  useReadProtomarketEvents,
  useReadProtomarketGetEventCount,
  useReadProtomarketGetEventsRange,
} from "../generated";
import { hexToString } from "viem";
import { formatDistanceToNow } from "date-fns";
import { useChainId } from "wagmi";
import { monadTestnet } from "wagmi/chains";

export function ViewEvents() {
  const events = useReadProtomarketEvents({
    args: [0n],
  }); // errors if arg bigint is greater than total amount of events size
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
    <>
      {isLoading && <div>LOADING EVENTS...</div>}
      {errors.map((err) => {
        if (!err) return;
        return Object.entries(err).map(([key, value]) => {
          if (typeof value === "string") {
            return (
              <div key={key}>
                {key}: {value}
              </div>
            );
          }
        });
      })}
      <div>
        <div>Event Count: {eventCount.data}</div>
        <div>Events Range: </div>
        {eventsRange.data?.map((ev, index) =>
          Object.entries(ev).map(([key, value]) => {
            let displayValue = String(value);

            // Parse outcomeA and outcomeB from bytes32 to text
            if (key === "outcomeA" || key === "outcomeB") {
              displayValue = parseBytes32ToText(value);
            }

            // Format startTime as time distance
            if (key === "startTime") {
              displayValue = formatStartTime(value);
            }

            return (
              <div key={`${index}-${key}`}>
                {key}: {displayValue}
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
