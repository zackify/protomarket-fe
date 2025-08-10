import {
  useReadProtomarketEvents,
  useReadProtomarketGetEventCount,
  useReadProtomarketGetEventsRange,
} from "../generated";

export function ViewEvents() {
  const events = useReadProtomarketEvents({
    args: [0n],
  }); // errors if arg bigint is greater than total amount of events size
  const eventCount = useReadProtomarketGetEventCount();
  const eventsRange = useReadProtomarketGetEventsRange({ args: [0n, 1n] }); // errors if end arg bigint is greater than total amount of events

  //   console.log(events);
  //   console.log(eventCount);
  //   console.log(eventsRange);

  const isLoading =
    eventCount.isLoading || eventsRange.isLoading || events.isLoading;
  const errors = [events.error, eventCount.error, eventsRange.error];

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
        <div>Events: {events.data}</div>
        <div>Event Count: {eventCount.data}</div>
        <div>Events Range: </div>
        {eventsRange.data?.map((ev) =>
          Object.entries(ev).map(([key, value]) => {
            return (
              <div key={key}>
                {key}: {String(value)}
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
