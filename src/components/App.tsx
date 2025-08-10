import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { CreateEventComponent } from "./CreateEventComponent";
import { ViewEvents } from "./ViewEvents";

function App() {
  const [count, setCount] = useState(0);
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Eth Frontend</h1>

      <div style={{ marginBottom: "20px" }}>
        {isConnected ? (
          <div>
            <p>Connected: {address}</p>
            <button onClick={() => disconnect()}>Disconnect</button>
          </div>
        ) : (
          <button onClick={() => connect({ connector: injected() })}>
            Connect Wallet
          </button>
        )}
      </div>

      <button onClick={() => setCount((count) => count + 1)}>
        Count is {count}
      </button>

      <p>React app with Bun and Wagmi ready!</p>
      <CreateEventComponent />
      <ViewEvents />
    </div>
  );
}

export default App;
